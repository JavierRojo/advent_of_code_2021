/*
--- Part Two ---
Unfortunately, considering only horizontal and vertical lines doesn't 
give you the full picture; you need to also consider diagonal lines.

Because of the limits of the hydrothermal vent mapping system, the lines 
in your list will only ever be horizontal, vertical, or a diagonal line 
at exactly 45 degrees. In other words:

An entry like 1,1 -> 3,3 covers points 1,1, 2,2, and 3,3.
An entry like 9,7 -> 7,9 covers points 9,7, 8,8, and 7,9.
Considering all lines from the above example would now produce 
the following diagram:

1.1....11.
.111...2..
..2.1.111.
...1.2.2..
.112313211
...1.2....
..1...1...
.1.....1..
1.......1.
222111....
You still need to determine the number of points where at least two lines overlap. 
In the above example, this is still anywhere in the diagram 
with a 2 or larger - now a total of 12 points.

Consider all of the lines. At how many points do at least two lines overlap?
*/


const { Console } = require('console');
const { create } = require('domain');
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle5(arrayData);
      });
}

function getTestData(){
    return "0,9 -> 5,9"+"\n"+
    "8,0 -> 0,8"+"\n"+
    "9,4 -> 3,4"+"\n"+
    "2,2 -> 2,1"+"\n"+
    "7,0 -> 7,4"+"\n"+
    "6,4 -> 2,0"+"\n"+
    "0,9 -> 2,9"+"\n"+
    "3,4 -> 1,4"+"\n"+
    "0,0 -> 8,8"+"\n"+
    "5,5 -> 8,2"
}


function puzzle5(inputData){   
    //let newData = filterHorVert(inputData);
    let newData = inputData;
    let size = getMax(inputData);
    let matrix= createMatrix(size[0]+1, size[1]+1);
    newData.forEach(segment => {
        addSegmentToMatrix(segment, matrix);        
    });
    console.log("SOLUTION");
    console.log(countPoints(matrix));
}

function countPoints(matrix){
    let count = 0;
    matrix.forEach(row => {
        row.forEach(point => {
            if(point >=2) count++;            
        });        
    });
    return count;
}

function readRawData(rawData){
    let allSegments=[];
    let tempSegmentArray = rawData.split("\n");
    tempSegmentArray.forEach(seg => {
        let p1 = [];
        let p2 = [];
        let points = seg.split(" -> ");
        let p1s = points[0].split(",");
        let p2s = points[1].split(",");
        p1 = [parseInt(p1s[0]), parseInt(p1s[1])];
        p2 = [parseInt(p2s[0]), parseInt(p2s[1])];
        allSegments.push([p1,p2]);              
    });
    return allSegments;
}

function addSegmentToMatrix(segment, matrix){
    let points = getPointsFromSegment(segment);
    points.forEach(p => {
        matrix[p[1]][p[0]]++;        
    });    
}

function getPointsFromSegment(segment){
    let points = [];
    let p1 = segment[0];
    let p2 = segment[1];
    let diffX = p2[0]-p1[0];
    let diffY = p2[1]-p1[1];
    let diff = Math.max(Math.abs(diffX), Math.abs(diffY));
    let i=0;
    for(let i=0; i<=diff; i++){
        let addX = diffX==0? 0 : Math.round(diffX/Math.abs(diffX))*i;
        let addY = diffY==0? 0 : Math.round(diffY/Math.abs(diffY))*i;


        let x = p1[0]+ addX;
        let y = p1[1]+ addY;
        points.push([x,y]);
    }
    return points;
}

function filterHorVert(originalData){
    let newData = [];
    originalData.forEach(segment => {
        if(segment[0][0] == segment[1][0] || segment[0][1] == segment[1][1]) newData.push(segment);        
    });
    return newData;
}

function getMax(data){
    let maxX = 0;
    let maxY = 0;
    data.forEach(segment => {
        maxX = Math.max(segment[0][0],maxX);
        maxX = Math.max(segment[1][0],maxX);
        maxY = Math.max(segment[0][1],maxY);
        maxY = Math.max(segment[1][1],maxY);        
    });
    return [maxX, maxY];
}

function createMatrix(nrows,ncols){
    let res = [];
    for(let r=0; r<nrows; r++){
        let row =[];        
        for(let c=0; c<ncols; c++){
            row.push(0);
        }
        res.push(row);
    }
    return res;
}

puzzle5(readRawData(getTestData()));
getData("day05_input.txt");



