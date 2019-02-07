Magic sub: #Num has: 'n mu m2 sd id lo hi txt w'

! Num methods !
  init
    self n: 0;
         mu: 0;
         m2: 0;
         sd: 0;
         id: id;
         lo: (10 raisedTo: 32);
         hi: -1 * (10 raisedTo: 32);
         txt: txt;
         w: 1.
  ! "end init"
  numInc: x
    | d |
    x = '?' ifTrue: [^x].
    n := n + 1.
    d := x - (mu).
    mu :=  mu + (d / n).
    m2 :=  m2 + (d*(x - mu)).
    x > hi ifTrue: [hi := x].
    x <  lo ifTrue: [lo := x].
    n >= 2 ifTrue: [sd := ((m2 / (n - 1 + (10 raisedTo: -32))) sqrt)].
    ^x.
  ! "end numInc"
  numDec: x
    | d |
    x = '?' ifTrue: [^x].
    n = 1 ifTrue: [^x].
    n :=  n - 1.
    d := x - mu.
    mu :=  mu - (d / mu).
    m2 :=  m2 - (d * (x - mu)).
    n >= 2 ifTrue: [sd := ((m2 / (n - 1 + (10 raisedTo: -32))) sqrt)].
    ^x.
  !"end numDec"
  nextPutAll: a
    a do: [:x | self numInc: x].
  !"end nextPutAll"
    "Constructor for Num type."
    init
        self n: 0;
             mu: 0;
             m2: 0;
             sd: 0;
             id: id;
             hi: (-1 * ( 10 raisedTo: 32 ) );
             lo: (10 raisedTo: 32);
             txt: txt;
             w: 1.
    ! "end num"
    numInc: x 
      | d |
      x = '?' ifTrue: [^x].
      n := n + 1.
      d := x - (mu).
      mu := mu + (d / (n)).
      m2 := m2 + (d*(x - (mu))).
      x > hi ifTrue: [hi := x].
      x < lo ifTrue: [lo := x].
      n >= 2 ifTrue: [sd := ((m2 / (n - 1 + (10 raisedTo: -32))) sqrt )].
      ^x.
    ! "end numInc"
    numDec: x 
      | d |
      x = '?' ifTrue: [^x].
      n = 1 ifTrue: [^x].
      n := n - 1.
      d := x - (mu).
      mu := mu - (d / (mu)).
      m2 := m2 - (d * (x - (mu))).
      n >= 2 ifTrue: [sd := ((m2 / (n - 1 + (10 raisedTo: -32))) sqrt )].
      ^x.
    !"end numDec"

    nextPutAll: a
      a do: [:x | self numInc: x].
        
    ! "end nextPutAll"
! "end class"

! Collection methods !
    eject: aBlock
      ^self select: [:element | (aBlock value: element) not].
    ! "end eject"
    
    b4Now: aBlock
      1 to: (self size - 1) do: [:i | aBlock value: (self at: i) value: (self at: (i + 1))].
    ! "end b4Now"

!