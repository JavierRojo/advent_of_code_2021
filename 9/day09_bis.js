/*
--- Part Two ---
Next, you need to find the largest basins so you know what areas are most important to avoid.

A basin is all locations that eventually flow downward to a single low point. Therefore, every low point has a basin, although some basins are very small. Locations of height 9 do not count as being in any basin, and all other locations will always be part of exactly one basin.

The size of a basin is the number of locations within the basin, including the low point. The example above has four basins.

The top-left basin, size 3:

2199943210
3987894921
9856789892
8767896789
9899965678
The top-right basin, size 9:

2199943210
3987894921
9856789892
8767896789
9899965678
The middle basin, size 14:

2199943210
3987894921
9856789892
8767896789
9899965678
The bottom-right basin, size 9:

2199943210
3987894921
9856789892
8767896789
9899965678
Find the three largest basins and multiply their sizes together. In the above example, this is 9 * 14 * 9 = 1134.

What do you get if you multiply together the sizes of the three largest basins?
*/
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle9(arrayData);
      });
}

function readRawData(rawData){
    let allRows=[];
    let tempSegmentArray = rawData.split("\n");
    tempSegmentArray.forEach(row => {
        let stringrow = row.split("");
        let introw = [];
        stringrow.forEach(s => {
            introw.push(parseInt(s));            
        });
        allRows.push(introw);     
    });
    return allRows;
}

function getTestData(){
    return ""+
    "2199943210"+"\n"+
    "3987894921"+"\n"+
    "9856789892"+"\n"+
    "8767896789"+"\n"+
    "9899965678"
}

// --- //

function puzzle9(inputData){   
    let lowestPoints = getMinPoints(inputData);
    let basins = getBasins(lowestPoints, inputData);
    console.log("SOLUTION");
    console.log(basins);
    console.log(getResult(basins));
}

function getResult(sizes){
    console.log(sizes);
    sizes.sort(function(a, b) {
        return b-a;
      });
    console.log(sizes);

    console.log(sizes[0], sizes[1], sizes[2]);
    return sizes[0] * sizes[1] * sizes[2];
}

function getMinPoints(map){
    let points = [];
    let nrows = map.length;
    let ncols = map[0].length;

    for(row =0; row<nrows; row++){
        for (col = 0; col<ncols; col++){
            let neighbours = getNeighbours(row,col,map);
            let isLocalMinimum = isMinimum(map[row][col],neighbours);
            if(isLocalMinimum){
                //console.log("row number "+row);
                //console.log("("+row+", "+ col+"): "+map[row][col],neighbours);
                points.push([row,col]);
            }
        }
    }
    return points;
}

function isMinimum(n,neighbours){
    for(let i=0; i<neighbours.length; i++){
        let neighbour = neighbours[i];
        if(n >= neighbour){
            return false;
        }
    }                   
    return true;
}

function getNeighbours(row,col,map){
    let neighbours = [];
    let nrows = map.length;
    let ncols = map[0].length;

    // VERTICAL NEIGHBOURS
    if(row == 0){
        neighbours.push(map[1][col]);
    }
    else if(row == nrows-1){
        neighbours.push(map[nrows-2][col]);
    }
    else{
        neighbours.push(map[row-1][col]);
        neighbours.push(map[row+1][col]);
    }

    // HORIZONTAL NEIGHBOURS
    if(col == 0){
        neighbours.push(map[row][1]);
    }
    else if(col == ncols-1){
        neighbours.push(map[row][ncols-2]);
    }
    else{
        neighbours.push(map[row][col-1]);
        neighbours.push(map[row][col+1]);
    }
    return neighbours;
}

function getNeighboursIndex(row,col,map){
    let neighbours = [];
    let nrows = map.length;
    let ncols = map[0].length;

    // VERTICAL NEIGHBOURS
    if(row == 0){
        neighbours.push([1,col]);
    }
    else if(row == nrows-1){
        neighbours.push([nrows-2,col]);
    }
    else{
        neighbours.push([row-1,col]);
        neighbours.push([row+1,col]);
    }

    // HORIZONTAL NEIGHBOURS
    if(col == 0){
        neighbours.push([row,1]);
    }
    else if(col == ncols-1){
        neighbours.push([row,ncols-2]);
    }
    else{
        neighbours.push([row,col-1]);
        neighbours.push([row,col+1]);
    }
    return neighbours;
}

function getBasin(lowestPoint, map){
    let points =[];
    points.push(lowestPoint);
    let validAdditions = false;
    do{
        validAdditions = false;
        points.forEach(p => {
            let neighbours = getNeighboursIndex(p[0],p[1],map);
            for(let i=0; i<neighbours.length; i++){
                let n = neighbours[i];
                if(contains(points,n) || map[n[0]][n[1]] == 9)continue;
                else{
                    points.push(n);
                    validAdditions = true;
                }
            }            
        });
    }while(validAdditions)
    return points;
}

function getBasins(lowestPoints, map){
    let basins = [];
    lowestPoints.forEach(p => {
        let b = getBasin(p, map);       
        basins.push(b.length);
    });
    return basins;
}

function contains(array, point) {
    var i = array.length;
    while (i--) {
       if (array[i][0] == point[0] && array[i][1] == point[1]) {
           return true;
       }
    }
    return false;
}



//puzzle9(readRawData(getTestData()));
getData("day09_input.txt");



