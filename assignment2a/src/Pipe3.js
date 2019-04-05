"use strict";
/*  Pipe 3:
    This pipe will cut the data into a best and worst bucket....
*/
exports.__esModule = true;
/*  Step 1:
    Convert the csv to a readable file, specifically an object
*/
/**
 * This code is taken from Daniel Mills
 */
var fs = require("fs");
function readInput(dataTable) {
    var data = fs.readFileSync('/dev/stdin', 'utf8').split("\n");
    dataTable.attributes = data[0].split(",");
    dataTable.dataSet(data.slice(1, data.length - 1).map(function (line) { return line.split(",").map(String); }));
}
//Table class to hold all of the info from the csv
var table = /** @class */ (function () {
    //Constructor
    function table() {
        this.cols = 0;
        this.rows = 0;
        this.enough = 0.5;
    }
    //Functin to set the data
    table.prototype.dataSet = function (newData) {
        console.log("setting");
        this.data = newData;
        this.cols = this.data[0].length - 1;
        this.c = this.cols - 1;
        this.rows = this.data.length - 1;
        this.enough = Math.pow(this.rows, this.enough);
    };
    table.prototype.print = function () {
        console.log("Cols: " + this.cols);
        console.log("Rows: " + this.rows);
        console.log("C: " + this.c);
        console.log("Enough: " + this.enough);
        console.log("Attributes: " + this.attributes);
    };
    return table;
}());
//Create an instance of table
var csv = new table();
//Parse the CSV file from standard in and move the data over to the data object
readInput(csv);
csv.print();
/*  Step 3:
    Peform recursive cuts and sort data into best and the rest
    using the argmin values attached at the end of each line
*/
function cuts(input, low, high, pre) {
    //Concatinate the preface with the last value 
    console.log(input.data[low]);
    console.log(low);
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
        input.data[i][input.cols + 1] = b;
    }
}
function band(input, low, high) {
    console.log("band");
    if (low == 1) {
        return ("..").concat(String(input.data[high][input.c]));
    }
    else {
        return String(input.data[low][input.c]).concat("..", String(input.data[high][input.c]));
    }
}
console.log("\n-- ".concat(String(csv.data[0][csv.c]), "----------"));
cuts(csv, 1, csv.rows, "|.. ");
console.log(String(csv.cols).concat(", ", ",!klass"));
for (var i = 0; i < csv.rows; i++) {
    for (var j = 0; j < csv.cols - 1; j++) {
        process.stdout.write(csv.data[i][j] + ",");
    }
    process.stdout.write(csv.data[i][j] + "\n");
}
