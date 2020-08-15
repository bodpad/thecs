"""
Name:     Priority Queue
Language: Python 3.9
License:  MIT
"""
class PriorityQueue:
    def __init__(self):
        self.pq = []
        self.N = 0

    def isEmpty(self):
        return self.N == 0

    def insert(self, key):
        self.pq.append(key)
        self.swim(self.N)

    def delMax(self):
        max = self.pq[1]
        self.exch(1, self.N)
        self.N -= 1
        self.sink(1)
        self.pq[self.N+1] = None
        return max

    def swim(self, k):
        while k > 1 and self.less(k/2, k):
            self.exch(k, k/2)
            k = k/2

    def sink(self, k):
        while k*2 <= self.N:
            j = k*2
            if j < self.N and self.less(j, j+1):
                j += 1
            if not self.less(k, j):
                break
            self.exch(k, j)
            k = j

    def exch(self, i, j):
        self.pq[i], self.pq[j] = self.pq[j], self.pq[i]

    def less(self, i, j):
        return self.pq[i] < self.pq[j]
