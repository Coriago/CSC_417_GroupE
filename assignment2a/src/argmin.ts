import * as fs from "fs";

// The column names of the input data.
var attributes: Array<String>; 
var numCols:number;

// The input data itself.
var rows:number[][]; 
var numRows:number;

// An array of the last column of the input.
var lastCol:number[]; 

// allStdDevs[ i ] stores the standard deviation of elements in 
// "lastCol" from i to "numRows".
var allStdDevs:number[]; 

var minBinSize:number;
var minRise:number;
var COHEN:number = 0.3;
var data: Array<String>; 
function readInput() {
    data = fs.readFileSync( '/dev/stdin', 'utf8' ).split( "\n" );
    attributes = data[ 0 ].split( "," );
    rows = data.slice( 1, data.length - 1).map( 
        line => line.split(",").map(Number)
    );
}

function numInc( aggr, value ) {
    // TODO maybe handle case where "value" is "?".
    aggr.count++; 
    var delta  = value - aggr.mean;
    aggr.mean += delta / aggr.count;
    aggr.M2 += delta * ( value - aggr.mean );
    if ( value > aggr.max ) aggr.max = value; 
    if ( value < aggr.min ) aggr.min = value;
    if ( aggr.count >= 2 ) aggr.sd = Math.sqrt( aggr.M2 / ( aggr.count - 1 + 10**-32) );
}

function numDec( aggr, value ) {
    if ( aggr.count == 1 ) return;
    aggr.count--; 
    var delta  = value - aggr.mean;
    aggr.mean -= delta / aggr.count;
    aggr.M2 -= delta * ( value - aggr.mean );
    if ( aggr.count >= 2 ) {
        aggr.sd = Math.sqrt( aggr.M2 / ( aggr.count - 1 + 10**-32) );
    }
}

function getStdDev( lo, hi ) {
    var aggr = { count: 0, mean: 0, M2: 0, sd: 0, max: -1 * 10**32, min: 10**32 };
    // Assumes we're working with "lastCol" to avoid passing arrays by value.
    for ( var i = lo; i < hi; i++ ) {
        numInc( aggr, lastCol[ i ]);
    }
    return aggr;
}

function initValues() {
    numRows = rows.length;
    numCols = rows[ 0 ].length;

    minBinSize = Math.floor( Math.sqrt( numRows ) );

    lastCol = rows.map( row => row[ numCols - 1] );

    var totalStdDev = getStdDev( 0, numRows ).sd;
    minRise = COHEN * totalStdDev ;
}

function calcSplits() {
    function getTotalVariance( aggrA, aggrB ) {
        var count:number = aggrA.count + aggrB.count + 0.0001;
        var stdDevA:number = ( ( aggrA.count / count ) * aggrA.sd );
        var stdDevB:number = ( ( aggrB.count / count ) * aggrB.sd );
        return stdDevA + stdDevB;
    }

    function argmin( min, max ) {
        var cut:number;

        if ( ( max - min ) > ( 2 * minBinSize ) ) {
            var aboveSplitAggr = getStdDev( min, numRows );
            var belowSplitAggr = getStdDev( 0, 0);
            var best:number = aboveSplitAggr.sd;

            var tmp:number;
            var value:number;

            for ( var split = min; split < max; split++ ) {
                value = lastCol[ split ];
                numInc( belowSplitAggr, value );
                numDec( aboveSplitAggr, value );
                if ( ( belowSplitAggr.count >= minBinSize ) &&
                     ( aboveSplitAggr.count >= minBinSize ) ) 
                {
                    if ( ( belowSplitAggr.max - belowSplitAggr.min ) > minRise ) 
                    {
                        if ( ( aboveSplitAggr.max - aboveSplitAggr.min ) > minRise ) 
                        {
                            tmp = getTotalVariance( belowSplitAggr, aboveSplitAggr ) * 1.05;
                            if ( tmp < best ) 
                            {
                                cut = split;
                                best = tmp;

                            }
                        }
                    }
                }
            }
        }
        return cut + 1;
    }

    var count:number = 0;
    var cut:number = 0;
    var sym:string = "|..";
    var prevCut:number;

    for ( var i = 0; i < numCols - 1; i++ ) {
        process.stdout.write( attributes[ i ] + ", " );
    }
    process.stdout.write( attributes[ i ] + "\n" ); 

    for ( var i = 0; i < numRows; i++ ) {
        count++;
        if ( ( numRows - i ) > minBinSize ) {
            prevCut = cut;
            cut = argmin( i, numRows);

            for ( var j = i; j < cut; j++ ) {
                process.stdout.write( rows[ j ] + "," + cut + "\n" );
            }
            i = cut - 1;
        }
    }

    for ( var i = prevCut; i < numRows; i++ ) {
        process.stdout.write( rows[ i ] + "," + numRows + "\n" );
    }
}

readInput();
initValues();
calcSplits();
