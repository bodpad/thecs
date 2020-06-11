function shuffling(arr) {
    const N = arr.length;
    for (let i = 0; i < N; i++) {
        const R = Math.floor(Math.random() * (i + 1));
        const SWAP = arr[R];
        arr[R] = arr[i];
        arr[i] = SWAP;
    }
}
