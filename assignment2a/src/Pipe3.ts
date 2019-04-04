/*  Pipe 3: 
    This pipe will cut the data into a best and worst bucket....
*/


/*  Step 1:
    Convert the csv to a readable file, specifically an object
*/
/**
 * This code is taken from Daniel Mills
 */
import * as fs from "fs";

function readInput(dataTable: table) {
    var data:Array<String> = fs.readFileSync( '/dev/stdin', 'utf8' ).split( "\n" );
    dataTable.attributes = data[ 0 ].split( "," );
    dataTable.dataSet(data.slice( 1, data.length - 1).map( 
        line => line.split(",").map(String)
    ));
}

//Table class to hold all of the info from the csv
class table {
    //Number of columns
    cols: number;
    //Number of rows
    rows: number;
    //Holder c
    enough: number;
    //Filed for c
    c: number;
    //Headers of the table
    attributes: Array<String>;
    //Array to store the data from the CSV file
    data: string[][];

    //Constructor
    constructor() {
        this.cols = 0;
        this.rows = 0;
        this.enough = 0.5;
    }

    //Functin to set the data
    dataSet(newData: string[][]){
        console.log("setting");
        this.data = newData;
        this.cols = this.data[0].length - 1;
        this.c = this.cols - 1;
        this.rows = this.data.length - 1;
        this.enough = this.rows**this.enough;
    }

    print() {
        console.log("Cols: " + this.cols);
        console.log("Rows: " + this.rows);
        console.log("C: " + this.c);
        console.log("Enough: " + this.enough);
        console.log("Attributes: " + this.attributes);
    }
}
//Create an instance of table
var csv = new table();
//Parse the CSV file from standard in and move the data over to the data object
readInput(csv);
csv.print();

/*  Step 3:
    Peform recursive cuts and sort data into best and the rest
    using the argmin values attached at the end of each line
*/
function cuts(input: table, low: number, high: number, pre: string) {
    //Concatinate the preface with the last value 
    console.log(input.data[low]);
    console.log(low);
    let tbPrint:string = pre.concat(input.data[low][input.c]);
    process.stderr.write(tbPrint);
    if(high - low > input.enough) {
        //Grab cut from the last column of the high row
        let cut:number = Number(input.data[high][input.cols]);
        if(cut) {
            return cuts(input, cut + 1, high, pre.concat("|.."));
        }
    }
    mark(input, 1, low -1);
    mark(input, low, high);
}

function mark(input: table, low: number, high: number) {
    let b = band(input, low, high);
    let i:number;
    for(i = low; i <= high; i++ ) {
        input.data[i][input.cols + 1] = b
    }
}

function band(input: table, low: number, high: number) {
    console.log("band");
    if(low == 1) {
        return ("..").concat(String(input.data[high][input.c]));
    } else {
        return String(input.data[low][input.c]).concat("..", String(input.data[high][input.c]));
    }
}
console.log("\n-- ".concat(String(csv.data[0][csv.c]), "----------"));
cuts(csv, 1, csv.rows, "|.. ");
console.log(String(csv.cols).concat(", ", ",!klass"));
for( var i = 0; i < csv.rows; i++) {
    for( var j = 0; j < csv.cols - 1; j++) {
        process.stdout.write(csv.data[i][j] + ",");
    }
    process.stdout.write(csv.data[i][j] + "\n");
}