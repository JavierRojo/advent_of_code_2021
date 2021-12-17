/*
--- Day 9: Smoke Basin ---
These caves seem to be lava tubes. Parts are even still volcanically active; small hydrothermal vents release smoke into the caves that slowly settles like rain.

If you can model how the smoke flows through the caves, you might be able to avoid it and be that much safer. The submarine generates a heightmap of the floor of the nearby caves for you (your puzzle input).

Smoke flows to the lowest point of the area it's in. For example, consider the following heightmap:

2199943210
3987894921
9856789892
8767896789
9899965678

Each number corresponds to the height of a particular location, where 9 is the highest and 0 is the lowest a location can be.
Your first goal is to find the low points - the locations that are lower than any of its adjacent locations. 
Most locations have four adjacent locations (up, down, left, and right); 
locations on the edge or corner of the map have three or two adjacent locations, respectively. (Diagonal locations do not count as adjacent.)
In the above example, there are four low points, all highlighted: two are in the first row (a 1 and a 0), 
one is in the third row (a 5), and one is in the bottom row (also a 5). All other locations on 
the heightmap have some lower adjacent location, and so are not low points.

The risk level of a low point is 1 plus its height. In the above example, the risk levels of 
the low points are 2, 1, 6, and 6. The sum of the risk levels of all low points in the heightmap is therefore 15.

Find all of the low points on your heightmap. What is the sum of the risk levels of all low points on your heightmap?
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
    let points = getMinPoints(inputData);
    console.log("SOLUTION");
    let risk = getTotalRiskLevels(points);
    console.log(points); 
    console.log(risk);
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
                console.log("("+row+", "+ col+"): "+map[row][col],neighbours);
                points.push(map[row][col]);
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


function getRiskLevel(height){
    return height+1;
}
function getTotalRiskLevels(points){
    let sum = 0;
    points.forEach(p => {
        sum += getRiskLevel(p);        
    });
    return sum;
}




//puzzle9(readRawData(getTestData()));
getData("day09_input.txt");



