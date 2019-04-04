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
    }
    //Set number of cols
    table.prototype.colSet = function () {
        this.cols = this.data[0].length;
    };
    //Set the number of rows
    table.prototype.rowSet = function () {
        this.rows = this.data.length;
    };
    return table;
}());
//Create an instance of table
var csv = new table();
var fs_1 = require("fs");
var file = fs_1.readFileSync('sim.csv', 'utf8');
Papa.parse(file, { complete: function (result) { return console.dir(result.data); } });
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
/*  Step 3:
    Peform recursive cuts and sort data into best and the rest
    using the argmin values attached at the end of each line
*/
