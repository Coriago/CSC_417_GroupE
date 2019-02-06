Magic sub: #Num has: 'n mu m2 sd id lo hi txt w'

  ! Num methods !

  num: txt
    n := 0.
    mu := 0.
    m2 := 0.
    sd := 0.
    id := id.
    lo := (10 raisedTo: 32).
    self txt := txt.
    w := 1.
  ! "end num"
  numInc: x d: d
    x = '?' ifTrue: [^x].
    self n := self n + 1.
    d := x - (self mu).
    self mu := self mu + (d / (self n)).
    self m2 := self m2 + (d*(x - (self mu))).
    x > self hi ifTrue: self hi := x.
    x < self lo ifTrue: self lo := x.
    self n >= 2 ifTrue: self sd := (self m2 / (self n - 1 + (10 raisedTo: -32))) raisedTo: 0.5.
    ^x.
  ! "end numInc"
  numDec: x d: d
    x = '?' ifTrue: [^x].
    self n := 1 ifTrue: [^x].
    self n := self n - 1.
    d := x - (self mu).
    self mu := self mu - (d / (self mu)).
    self m2 := self m2 - (d * (x - (self mu))).
    self n >= 2 ifTrue: self sd := (self m2 / (self n - 1 + (10 raisedTo: -32))) raisedTo: 0.5.
    ^x.
  !"end numDec"
! "end class"
