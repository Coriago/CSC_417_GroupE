"use strict";
exports.__esModule = true;
/*  Pipe 3:
    This pipe will cut the data into a best and worst bucket....
*/
//Import the readline module for reading stdin
var Papa = require("papaparse");
/*  Step 1:
    Read from standard input

    Might not be needed

//Import the readline module for reading stdin
import * as readline from 'readline';
//Set up an interface to hold the stdin and stdout
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', (input: string) => {

    csv.data[csv.rows] = ;
})
*/
/*  Step 2:
    Use a library to convert the csv to a readable file,
    specifically an object
*/
//Table class to hold all of the info from the csv
var table = /** @class */ (function () {
    //Constructor
    function table() {
        this.cols = 0;
        this.rows = 0;
        this.enough = 0.5;
    }
    //Set number of cols
    table.prototype.colSet = function () {
        this.cols = this.data[0].length - 1;
        this.c = this.cols - 1;
    };
    //Set the number of rows
    table.prototype.rowSet = function () {
        this.rows = this.data.length - 1;
    };
    //Calculate Enough
    table.prototype.enoughCalc = function () {
        this.enough = this.rows ^ this.enough;
    };
    return table;
}());
//Create an instance of table
var csv = new table();
//Parse the CSV file from standard in
var parsed = Papa.parse(process.stdin);
//Move the data over to the data object
csv.data = parsed.data;
//Calculate the number of columns 
csv.colSet();
console.log(csv.cols);
//Calculate the number of columns
csv.rowSet();
console.log(csv.rows);
//Calculate enough
csv.enoughCalc();
console.log(csv.enough);
/*  Step 3:
    Peform recursive cuts and sort data into best and the rest
    using the argmin values attached at the end of each line
*/
function cuts(input, low, high, pre) {
    //Concatinate the preface with the last value 
    var tbPrint = pre.concat(input.data[low][input.c]);
    process.stderr.write(tbPrint);
    if (high - low > input.enough) {
        //Grab cut from the last column of the high row
        var cut = Number(input.data[high][input.cols]);
        if (cut) {
            return cuts(input, cut + 1, high, pre.concat("|.."));
        }
    }
    mark(input, 1, low - 1);
    mark(input, low, high);
}
function mark(input, low, high) {
    var b = band(input, low, high);
    var i;
    for (i = low; i <= high; i++) {
        input.data[i][input.cols] = b;
    }
}
//FIGURE OUT WHAT MOST IS!!!
function band(input, low, high) {
    console.log("band");
    if (low == 1) {
        return ("..").concat(input.data[low][input.c]);
    }
    else if (high == Most) {
        return ("..").concat(input.data[low][input.c]);
    }
    else {
        return String(input.data[low][input.c]).concat("..", input.data[high][input.c]);
    }
}
cuts(csv, 1, csv.rows, "|.. ");
