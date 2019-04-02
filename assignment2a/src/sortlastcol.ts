//2d array that stores each row of nums
let vals: number[][];

//store each row in row array

//then push row array into vals

function mergeSort(vals: number[][], n: number): void {
    if (n < 2)
        return;
    var mid: number = n / 2;
    var left, right: number[][];
    for (var i: number = 0; i < mid; i++) {
        left[i] = vals[i];
    }
    for (var i: number = mid; i < n; i++) {
        right[i - mid] = vals[i];
    }

    mergeSort(left, mid);
    mergeSort(right, mid);

    merge(vals, left, right, mid, n - mid);
}

function merge(vals: number[][], left: number[][], right: number[][],
    leftn: number, rightn: number) {
    var i, j, k: number = 0;
    while (i < leftn && j < rightn) {
        if (left[left.length - 1] <= )
    }
}