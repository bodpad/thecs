"""
Shuffle the sequence arr in place.
License: MIT
"""
import random


def shuffle(arr):
    N = len(arr)
    i = 0

    while i < N:
        # r is a random integer between 0 and i
        # such that 0 <= r <= i.
        r = random.randint(0, i)

        # Exchange i and r item inside an array.
        arr[i], arr[r] = arr[r], arr[i]

        i += 1


# Usage example
names = ['Ali', 'Ben', 'Dan', 'Eva', 'Jay', 'Kit', 'Leo', 'Max', 'Rob', 'Tom']

shuffle(names)
