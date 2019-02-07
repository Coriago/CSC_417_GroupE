#! /usr/bin/env gst
FileStream fileIn: 'my.st' "mytricks" !
FileStream fileIn: 'num.st' "yourcode" !

| num |
num := Num new.
num nextPutAll: #( 2 3 4 4 4 4 5 5 6 7 7
                8 9 9 9 9 10 11 12 12).
num sd asFloatE oo. "==> 3.06"
num mu oo. "==> 7"
num n  oo. "==> 20" !

(#(1 2 3) eject: [:x | x > 1.5]) oo!

#(10 21 32 43 54) b4Now: [:b4 :now|
    ((now-b4)/b4) asFloatE oo] !

|x y z w|
x := (Employee new)  name: 'tammy'.
y := (Employee new)  name: 'tammy'.
z := (Employee new)  name: 'Huy'; age: 18.

w := {1. 2. #abc. z. {x. x. x. {y.}.}. 4. {{{5.}.}.}.}.
    "z visit: [:n| n oo].
    "
    w visit:[:a| a oo] 