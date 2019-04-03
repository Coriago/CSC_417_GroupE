"use strict";
/*  Pipe 3:
    This pipe will cut the data into a best and worst bucket....
*/
exports.__esModule = true;
/*  Step 1:
    Read from standard input
*/
//Import the readline module for reading stdin
var readline = require("readline");
//Set up an interface to hold the stdin and stdout
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
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
    }
    //Set number of rows
    table.prototype.colSet = function () {
        this.cols = this.data[0].length;
    };
    return table;
}());
//Create an instance of table
var csv = new table();
/*  Step 3:
    Peform recursive cuts and sort data into best and the rest
    using the argmin values attached at the end of each line
*/
