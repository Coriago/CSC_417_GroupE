-- vim: ts=2 sw=2 sts=2 expandtab:cindent:formatoptions+=cro 
--------- --------- --------- --------- --------- ---------~

--Questions for Class: --
--1. Where is Lean.label.enough? --
--  A. What is the ^ before hand? --
--2. What are the values returned from rows(). It seems that a
--   

require "lib"
require "num"
require "rows"

function label(data,  enough,rows, most,cohen)
  rows = data.rows -- Grab the #rows from data object
  enough = (#rows)^Lean.label.enough 

  --
  local function band(c,lo,hi)
    print( "band" )
    if lo==1 then
      return "..".. rows[hi][c]
    elseif hi == most then
      return rows[lo][c]..".."
    else
      return rows[lo][c]..".."..rows[hi][c] end
  end

  local function argmin(c,lo,hi,     l,r,cut,best ,tmp,x)
    if (hi - lo > 2*enough) then
      l,r = num(), num()
      for i=lo,hi do numInc(r, rows[i][c]) end
      best = r.sd
      for i=lo,hi do
        x = rows[i][c]
        numInc(l, x)
        numDec(r, x)
        if l.n >= enough and r.n >= enough then
          if l.hi - l.lo > cohen then
            if r.hi - r.lo > cohen then
            tmp = numXpect(l,r) * Lean.label.margin
            if tmp < best then
               cut,best = i, tmp end end end end end end 
    return cut
  end

  local function mark(c, lo,hi,   b)
    b= band(c,lo,hi)
    for r=lo,hi do rows[r][c+1]=b end 
  end

  local function cuts(c,lo,hi,pre,       cut,txt,b)
    fyi(pre .. rows[lo][c])
    if hi - lo > enough then
      cut = argmin(c,lo,hi,cohen)
      if cut then
        return cuts(c,cut+1,hi, pre.."|..") end end
    mark(c,1,lo-1)
    mark(c,lo,hi)
  end

  -- Sets "c" to the number of attributes/columns in input data.
  local c=#data.name
  -- Sorts by last field of "rows". rows is the input minus the attribute names.
  ksort(c,rows)
  local all = num()
  -- Iterates over rows of data. For each row, the current std
  -- deviation of the dom column is updated with the dom value for 
  -- that row. The "all" object stores stats "t.sd" (std deviation)
  -- and "t.n" that counts the number of values the std deviation is
  -- calculated on.
  for i=1,#data.rows  do numInc(all, rows[i][c]) end
  cohen = all.sd*Lean.label.cohen
  fyi("\n-- ".. data.name[c] .. "----------")
  cuts(c,1,#data.rows,"|.. ") 
  print(cat(data.name,", ") .. ",!klass" )
  dump(rows)
end

return {main=function() return label(rows()) end}
