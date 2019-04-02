import * as readline from "readline";
import * as fs from "fs";

function readVals(): number[][] {
    
    //2d array that stores each row of nums
    var vals: number[][];
    //TODO: store each row from stdn in a row array
    
    //then push row array into vals
    return vals;
}

function mergeSort(vals: number[][], n: number): void {
    if (n < 2)
        return;
    var mid: number = n / 2;
    var left: number[][], right: number[][];
    for (var i: number = 0; i < mid; i++)
        left[i] = vals[i];

    for (var i: number = mid; i < n; i++)
        right[i - mid] = vals[i];

    mergeSort(left, mid);
    mergeSort(right, mid);

    merge(vals, left, right, mid, n - mid);
}

function merge(vals: number[][], left: number[][], right: number[][],
    leftn: number, rightn: number) {
    var i: number = 0, j: number = 0, k: number = 0;
    while (i < leftn && j < rightn) 
        if (left[left.length - 1] <= right[right.length - 1])
            vals[k++] = left[i++];
        else
            vals[k++] = right[j++];

    while (i < leftn)
        vals[k++] = left[i++];
    while (j < rightn)
        vals[k++] = right[j++];
}