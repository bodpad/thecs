"use strict";
/**
 * Shuffle the sequence arr in place.
 * License: MIT
 */
function shuffle(arr) {
    const N = arr.length;
    for (let i = 0; i < N; i++) {
        // r is a random integer between 0 and i
        // such that 0 <= r <= i.
        const r = Math.floor(Math.random() * (i + 1));
        // Exchange i and r item inside an array.
        const SWAP = arr[r];
        arr[r] = arr[i];
        arr[i] = SWAP;
    }
}
// Usage example
const names = ['Ali', 'Ben', 'Dan', 'Eva', 'Jay', 'Kit', 'Leo', 'Max', 'Rob', 'Tom'];
shuffle(names);
//# sourceMappingURL=Shuffling.js.map