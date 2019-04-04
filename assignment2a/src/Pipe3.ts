/*  Pipe 3: 
    This pipe will cut the data into a best and worst bucket....
*/
//Import the readline module for reading stdin
import * as Papa from 'papaparse';

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
class table {
    //Number of columns
    cols: number;
    //Number of rows
    rows: number;
    //Holder c
    enough: number;
    //Filed for c
    c: number;
    //Array to store the data from the CSV file
    data: string[][];

    //Constructor
    constructor() {
        this.cols = 0;
        this.rows = 0;
        this.enough = 0.5;
    }

    //Set number of cols
    colSet() {
        this.cols = this.data[0].length - 1;
        this.c = this.cols - 1;
    }

    //Set the number of rows
    rowSet() {
        this.rows = this.data.length - 1;
    }

    //Calculate Enough
    enoughCalc() {
        this.enough = this.rows^this.enough;
    }
}
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
function cuts(input: table, low: number, high: number, pre: string) {
    //Concatinate the preface with the last value 
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
        input.data[i][input.cols] = b
    }
}

//FIGURE OUT WHAT MOST IS!!!
function band(input: table, low: number, high: number) {
    console.log( "band");
    if(low == 1) {
        return ("..").concat(input.data[low][input.c]);
    } else if(high == Most) {
        return ("..").concat(input.data[low][input.c]);
    } else {
        return String(input.data[low][input.c]).concat("..", input.data[high][input.c]);
    }
}

cuts(csv, 1, csv.rows, "|.. ");
