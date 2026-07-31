from random import *
import timefor i in rang(1,10**2):
    print(" ")
p = " "
for i in range(1,10**3):
    c = randint(1,10**2)
    while c>0:
        p+=" "
        c-+1
    if i %10==0:
        print(p+"🧁 Happy birthday!")
    elif i %8==0:
        print(p+"🍫")
    elif i%6==0:
        print(p+"🍬")
    elif i%4==0:
        print(p+"🍩")
    elif i%2:    
        print(p+"Happy birthday!💖")
    else:
        print(p+"❤️")
    p=" "
    time.sleep(0.3)
    