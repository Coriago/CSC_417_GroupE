/*  Pipe 3: 
    This pipe will cut the data into a best and worst bucket....
*/

/*  Step 1:
    Read from standard input
*/

//Import the readline module for reading stdin
import * as readline from 'readline';
//Set up an interface to hold the stdin and stdout
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/*  Step 2:
    Use a library to convert the csv to a readable file, 
    specifically an object
*/

//Table class to hold all of the info from the csv
class table {
    //Number of collumns
    cols: number;
    //Number of rows
    rows: number;
    //Array to store the data from the CSV file
    data: string[][];

    //Constructor
    constructor() {
        this.cols = 0;
        this.rows = 0;
    }

    //Set number of rows
    colSet() {
        this.cols = this.data[0].length;
    }
}
//Create an instance of table
var csv = new table();

//Import the readline module for reading stdin
import * as parse from 'papaparse';

rl.on('line', (input: string) => {
    csv.data[csv.rows] = input;
})
/*  Step 3:
    Peform recursive cuts and sort data into best and the rest
    using the argmin values attached at the end of each line
*/
