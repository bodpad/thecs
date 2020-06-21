import java.util.ArrayList;

class BinaryHeap
{
    private ArrayList<Key> pq;
    private int N;

    PriorityQueue()
    {
        pq = new ArrayList<Key>();
        N = 0;
    }

    public boolean isEmpty()
    {
        return N == 0;
    }

    public void insert(Key key)
    {
        pq.add(key);
        swim(N);
    }

    public Key delMax()
    {
        Key max = pq[1];
        exch(1, N--);
        sink(1);
        pq[N+1] = null;
        return max;
    }

    private void swim(int k)
    {
        while (k > 1 && less(k/2, k))
        {
            exch(k, k/2);
            k = k/2;
        }
    }

    private void sink(k: int)
    {
        while (k*2 <= N) {
            int j = k*2;
            if (j < N && less(j, j+1)) j++;
            if (!less(k, j)) break;
            exch(k, j);
            k = j;
        }
    }
}
