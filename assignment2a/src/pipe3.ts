/*  Pipe 3: 
    This pipe will cut the data into a best and worst bucket....
*/

/*  Step 1:
    Read the csv from standard input
*/
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

/*  Step 2:
    Grab std from last row and multiply by .3 
*/
