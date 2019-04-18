{- Sample input (output from monte_carlo) is in src/test/input.txt
   Expected output is in src/test/expout.txt                       -}
import Data.List
import Debug.Trace

-- Searches list for given key and returns value
findv :: String -> [(String, Float)] -> Float
findv _ [] = -1 -- if it didn't find the key
findv key (l:ls)
    | fst l == key = snd l -- if first entry has key, return val
    | otherwise = findv key ls -- else recurse on rest of list

-- Converts String from input to a float, including True and False
str2Flt :: String -> Float
str2Flt "False" = 0.0
str2Flt "True" = 1.0
str2Flt s = read s

-- Ensures every param name in the header is correct in output
prefix :: String -> String
prefix s
    | s == "d" = ">d"
    | s == "ep"  || s == "np" = "<" ++ s
    | s == "sDr" || s == "verbose" = "?" ++ s
    | otherwise = "$" ++ s

-- Converts array of strings into a list of tuples (param name, param value)
-- Ex: ["a", "1", "b", "2"] returns [("a", 1.0), ("b", 2.0)]
buildTup :: [String] -> [(String, Float)]
buildTup [] = []
buildTup (x1:x2:xs) = (x1, str2Flt x2) : buildTup xs

-- Creates comma-saparated string of each first value in list of tuples
-- Ex: [("a", 1), ("b", 2)] would return "a, b"
nameHeader :: [(String, Float)] -> String
nameHeader x = "?t, " ++ (intercalate ", " $ map fst x)

-- Calc comm overhead from total personnel
-- See _co inner function within the step function in brooks2.py
co :: [(String, Float)] -> Float -> Float
co old pomp = pomp * (myTeam ^ 2 + others ^ 2)
    where
        ts = findv "ts" old
        tp = (findv "ep" old) + (findv "np" old)
        myTeam = ts - 1
        others = tp / ts - 1

-- Restrains a value to be between 0 and 100
restrain :: Float -> Float
restrain x = maximum (0 : (minimum (100: x: [])) :[])

-- Takes a step in the algorithm. See step function in brooks2.py
-- t: step #
-- dt: change in t after every step
-- params: the params that were input initially
-- old: the previous associations
step :: Int -> Int -> [(String, Float)] -> [(String, Float)] -> [(String, Float)]
step t dt params old =
    ("aR", restrain aR) :
    ("co", restrain (co old (findv "pomposity" params))) :
    ("d", restrain d) :
    ("ep", restrain ep) :
    ("ept", restrain ept) :
    ("nprod", findv "nprod" params) :
    ("np", restrain np) :
    ("paR", restrain paR) :
    ("ps", restrain ps) :
    ("sdR", restrain sdR) :
    ("ts", findv "ts" params) :
    ("to", findv "to" params) :
    ("r", restrain r) : []
    -- all of these calculations come from the step functiion in brooks2.py.
    -- Ex: (findv "np" old) is equivalent to i.np in the python program
    where
        aR = (findv "np" old) / (findv "learning_curve" params)
        ps = (findv "optimism" params) * fromIntegral t
        paR = 6
        sdR = (findv "nprod" old) * (1 - (findv "co" old) / 100) * ((findv "productivity_new" params) * (findv "np" old) + (findv "productivity_exp" params) * ((findv "ep" old) - (findv "ept" old)))
        ept = (findv "np" old) * (findv "to" old) / 100
        ep = (findv "ep" old) + (findv "aR" old) * fromIntegral dt
        np = (findv "np" old) + ((findv "paR" old) - (findv "aR" old)) * fromIntegral dt
        d = (findv "d" old) + (findv "sdR" old) * fromIntegral dt
        r = (findv "r" old) - (findv "sdR" old) * fromIntegral dt

-- Uses recursion to run the step function a certain number of times. initial t is 29 from main
loopStep :: Int -> [(String, Float)] -> [(String, Float)] -> [(String, Float)]
loopStep 0 params vals = step 0 1 params vals
loopStep t params vals = step t 1 params (loopStep (t - 1) params vals)



main = do
    input <- getLine -- Stores input (only one line)
    -- gets rid of braces, quotes, colons, and commas, and stores as array of Strings
    let line = words [c | c <- input, c /= '{' && c/= '}' && c /= '\'' && c /= ':' && c /= ',']
    -- create set of tuples representing the params
    let params = buildTup line

    -- the initial values that brooks2.py has before it runs step 0
    -- I have no idea where the numbers came from but this is what they are
    let iVals = ("aR", 0) :
                ("co", 0) :
                ("d", 0.79) :
                ("ep", 1) :
                ("ept", 0) :
                ("nprod", 0.38) :
                ("np", 25) :
                ("paR", 0) :
                ("ps", 0) :
                ("sdR", 0) :
                ("ts", 43.84) :
                ("to", 76.47) :
                ("r", 3.1) : []

    let vals = loopStep 29 params iVals -- this is the result after running 29 steps

    -- these are the values we will need to output
    print $ findv "atleast" params
    print $ findv "d" vals
    print $ findv "done_percent" params
    print $ findv "ep" vals -- wrong
    print $ findv "learning_curve" params
    print $ findv "np" vals -- wrong
    print $ findv "nprod" params
    print $ findv "optimism" params
    print $ findv "pomposity" params
    print $ findv "productivity_exp" params
    print $ findv "productivity_new" params
    print $ findv "r" vals -- correct but should be output as integer
    print $ findv "to" params
    print $ findv "ts" params
    print $ findv "verbose" params
    
    -- params !! 3  : -- atleast
    -- params !! 7  : -- d
    -- params !! 4  : -- done_percent
    -- params !! 8  : -- ep
    -- params !! 1  : -- learning_curve
    -- params !! 10 : -- np
    -- params !! 9  : -- nprod
    -- params !! 2  : -- optimism
    -- params !! 0  : -- pomposity
    -- params !! 6  : -- productivity_exp
    -- params !! 5  : -- productivity_new
    -- params !! 13 : -- r
    -- params !! 12 : -- to
    -- params !! 11 : -- ts
    -- params !! 14 : -- verbose
    -- []
