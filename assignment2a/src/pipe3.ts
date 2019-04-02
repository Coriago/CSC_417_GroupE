/*  Pipe 3: 
    This pipe will cut the data into a best and worst bucket....
*/

/*  Step 1:
    Read the csv from standard input
*/
import * as readline from 'readline';

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/*  Step 2:
    Use a library to convert the csv to a readable file, 
    specifically an object
*/
let table: string[];
import * as csvParse from 'csv-parse';
var parser:csvParse.CsvParser = csvParse({delimiter: ','}, function(data, err) {
    
});

/*  Step 3:
    Peform recursive cuts and sort data into best and the rest
    using the argmin values attached at the end of each line
*/
