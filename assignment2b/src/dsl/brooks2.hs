{- Sample input (output from monte_carlo) is in src/test/input.txt
   Expected output is in src/test/expout.txt                       -}

{-
    @author Daniel Curtis Mills
    This is an implementation of the brooks2 Python program re-written in Haskell.
    The main method reads a series of params from stdin, and stores them as an
    association list. The program them follows the Brooks' law algorithm to iteratively
    adjust certain given values. The program then outputs the updated attributes,
    sorted in a new order.

    The program has lots of recursion. The function to search in the association list,
    and the function to create the association list are both recirsive. Also, the main
    driving function of the program, loopStep, uses recursion to implement a loop.

    The program implements the Aspect abstraction by logging the state of the algorithm
    after each step. This is output using the trace function, which prints to
    stderr so it does not interfere with the pipe, which only reads from stdout
-}
import Data.List
import Debug.Trace
import Control.Monad

-- Searches list for given key and returns value
findv :: String -> [(String, Double)] -> Double
findv _ [] = -1 -- if it didn't find the key
findv key (l:ls)
    | fst l == key = snd l -- if first entry has key, return val
    | otherwise = findv key ls -- else recurse on rest of list

-- Converts String from input to a Double, including True and False
str2Flt :: String -> Double
str2Flt "False" = 0.0
str2Flt "True" = 1.0
str2Flt s = read s

-- Ensures every param name in the header is correct in output
prefix :: String -> String
prefix s
    | s == "d" = ">d"
    | s == "ep"  || s == "np" = "<" ++ s
    | s == "sDR" || s == "verbose" = "?" ++ s
    | otherwise = "$" ++ s

-- Converts array of strings into a list of tuples (param name, param value)
-- Ex: ["a", "1", "b", "2"] returns [("a", 1.0), ("b", 2.0)]
buildTup :: [String] -> [(String, Double)]
buildTup [] = []
buildTup (x1:x2:xs) = (prefix x1, str2Flt x2) : buildTup xs

-- Creates comma-saparated string of each first value in list of tuples
-- Ex: [("a", 1), ("b", 2)] would return "a, b"
nameHeader :: [(String, Double)] -> String
nameHeader vals = intercalate ", " $ map fst vals

-- Creates comma-separated string of each second value in list of tuples
-- Ex: [("a", 1), ("b", 2)] would return "1, 2"
printVals :: [(String, Double)] -> String
printVals vals = intercalate ", " $ map show $ map snd vals

-- Calc comm overhead from total personnel
-- See _co inner function within the step function in brooks2.py
co :: [(String, Double)] -> Double -> Double
co old pomp = pomp * (myTeam ^ 2 + others ^ 2)
    where
        ts = findv "$ts" old
        tp = (findv "<ep" old) + (findv "<np" old)
        myTeam = ts - 1
        others = tp / ts - 1

-- Restrains a value to be between 0 and 100
restrain :: Double -> Double
restrain x = maximum (0 : (minimum (100: x: [])) :[])

-- Takes a step in the algorithm. See step function in brooks2.py
-- t: step #
-- params: the params that were input initially
-- old: the values from the previous step
step :: Int -> [(String, Double)] -> [(String, Double)] -> [(String, Double)]
step t params old =
    ("?t", fromIntegral t) :
    ("aR", restrain aR) :
    ("co", restrain (co old (findv "$pomposity" params))) :
    (">d", restrain d) :
    ("<ep", restrain ep) :
    ("ept", restrain ept) :
    ("$nprod", findv "$nprod" params) :
    ("<np", restrain np) :
    ("paR", restrain paR) :
    ("ps", restrain ps) :
    ("sdR", restrain sdR) :
    ("$ts", findv "$ts" params) :
    ("$to", findv "$to" params) :
    ("$r", r) : []
    -- all of these calculations come from the step functiion in brooks2.py.
    -- Ex: (findv "<np" old) is equivalent to i.np in the python program
    where
        aR = (findv "<np" old) / (findv "$learning_curve" params)
        ps = (findv "$optimism" params) * fromIntegral t
        paR
            | (findv "ps" old) - (findv ">d" old) < (findv "$atleast" params) && t < (floor ((findv "$done_percent" params) * fromIntegral t / 100)) = 6
            | otherwise = 0
        sdR = (findv "$nprod" old) * (1 - (findv "co" old) / 100) * ((findv "$productivity_new" params) * (findv "<np" old) + (findv "$productivity_exp" params) * ((findv "<ep" old) - (findv "ept" old)))
        ept = (findv "<np" old) * (findv "$to" old) / 100
        ep = (findv "<ep" old) + (findv "aR" old)
        np = (findv "<np" old) + ((findv "paR" old) - (findv "aR" old))
        d = (findv ">d" old) + (findv "sdR" old)
        r = (findv "$r" old) - (findv "sdR" old)

-- Uses recursion to run the step function a certain number of times. initial t is 29 from main
-- This function returns a list. Each element of the list is a list of tuples representing the
-- values after each step. This is to implement the verbose funcitonality
-- t: step #
-- params: params initially read from input
-- vals: the list of values from the Brooks' law algorithm
loopStep :: Int -> [(String, Double)] -> [(String, Double)] -> [[(String, Double)]]
loopStep 0 params vals = [step 0 params vals]
loopStep t params vals = traceShow (head list) $ step t params (head list) : list
        where
            list = loopStep (t - 1) params vals

-- Returns the valuse sorted in the desired order for this program's output
-- vals: the list of values from the Brooks' law algorithm
-- params: the params initially read from input
output :: [(String, Double)] -> [(String, Double)] -> [(String, Double)]
output vals params =
    vals   !! 0  : -- t
    params !! 3  : -- atleast
    vals   !! 3  : -- d
    params !! 4  : -- done_percent
    vals   !! 4  : -- ep
    params !! 1  : -- learning_curve
    vals   !! 7  : -- np
    params !! 9  : -- nprod
    params !! 2  : -- optimism
    params !! 0  : -- pomposity
    params !! 6  : -- productivity_exp
    params !! 5  : -- productivity_new
    vals   !! 13 : -- r
    vals   !! 12 : -- to
    vals   !! 11 : -- ts
    params !! 14 : -- verbose
    []

-- Either prints all the lists of tuples in list or only the first one
-- verbose: whether the verbose flag is true or not
-- list: the list of lists of tuples to print
-- params: the params initially read from input
printAll :: Double -> [[(String, Double)]] -> [(String, Double)] -> IO [()]
printAll 0.0 list params = mapM putStrLn $ map printVals $ map (\vals -> output vals params) $ (last list) : []
printAll 1.0 list params = mapM putStrLn $ map printVals $ map (\vals -> output vals params) list

-- runs the program
main = do
    input <- getLine -- Stores input (only one line)
    -- gets rid of braces, quotes, colons, and commas, and stores as array of Strings
    let line = words [c | c <- input, c /= '{' && c/= '}' && c /= '\'' && c /= ':' && c /= ',']
    -- create set of tuples representing the params
    let params = buildTup line

    -- the initial values that brooks2.py has before it runs step 0
    let iVals = ("aR", 0) :
                ("co", 0) :
                (">d", findv ">d" params) :
                ("<ep", fromIntegral (floor (findv "<ep" params))) :
                ("ept", 0) :
                ("$nprod", findv "$nprod" params) :
                ("<np", fromIntegral (floor (findv "<np" params))) :
                ("paR", 0) :
                ("ps", 0) :
                ("sdR", 0) :
                ("$ts", findv "$ts" params) :
                ("$to", findv "$to" params) :
                ("$r", findv "$r" params) : []

    -- we reverse this because the recursive loopStep function lists the values backwards
    let list = reverse $ loopStep 29 params iVals -- this is the result after running 29 steps

    -- prints the header of the output
    putStrLn $ nameHeader $ output (head list) params
    -- prints either all or just the last list of attributes, depending on verbose flag
    printAll (findv "?verbose" params) list params
    -- if verbose is true, we need to print the last value a second time
    when ((findv "?verbose" params) == 1.0) $ putStrLn $ printVals $ output (last list) params