function shuffling(arr: number[]): void
{
    const N: number = arr.length;

    for (let i = 0; i < N; i++) {
        const R: number = Math.floor(Math.random() * (i + 1));
        const SWAP: number = arr[R];
        arr[R] = arr[i];
        arr[i] = SWAP;
    }
}
