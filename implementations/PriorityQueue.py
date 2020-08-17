"""
Name:     Priority Queue implementation
Language: Python 3.8
Author:   Thecs.org team
License:  MIT
"""
class PriorityQueue:
    def __init__(self):
        self._pq = [None]
        self._n = 0

    def is_empty(self):
        return self._n == 0

    def add(self, key):
        self._pq.append(key)
        self._n += 1
        self._swim(self._n)

    def del_max(self):
        max = self._pq[1]
        self._exch(1, self._n)
        self._n -= 1
        self._sink(1)
        self._pq[self._n+1] = None
        return max

    def _swim(self, k):
        while k > 1 and self._less(k//2, k):
            self._exch(k, k//2)
            k = k//2

    def _sink(self, k):
        while k*2 <= self._n:
            j = k*2
            if j < self._n and self._less(j, j+1):
                j += 1
            if not self._less(k, j):
                break
            self._exch(k, j)
            k = j

    def _exch(self, i, j):
        self._pq[i], self._pq[j] = self._pq[j], self._pq[i]

    def _less(self, i, j):
        return self._pq[i] < self._pq[j]
