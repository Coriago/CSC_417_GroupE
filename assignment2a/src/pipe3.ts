/*  Pipe 3: 
    This pipe will cut the data into a best and worst bucket....
*/

/*  Step 1:
    Read the csv from standard input
*/
var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let table = '';

rl.on('line', (line) => {
    table = line;
});
/*  Step 2:
    Use a library to convert the csv to a readable file, 
    specifically an object
*/


/*  Step 3:
    Peform recursive cuts and sort data into best and the rest
    using the argmin values attached at the end of each line
*/
