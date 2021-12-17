/*
--- Day 5: Hydrothermal Venture ---
You come across a field of hydrothermal vents on the ocean floor! These vents 
constantly produce large, opaque clouds, so it would be best to avoid them if possible.

They tend to form in lines; the submarine helpfully produces a list of 
nearby lines of vents (your puzzle input) for you to review. For example:

0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
Each line of vents is given as a line segment in the format x1,y1 -> x2,y2 
where x1,y1 are the coordinates of one end the line segment and x2,y2 are 
the coordinates of the other end. These line segments include the points at both ends. 
In other words:

An entry like 1,1 -> 1,3 covers points 1,1, 1,2, and 1,3.
An entry like 9,7 -> 7,7 covers points 9,7, 8,7, and 7,7.
For now, only consider horizontal and vertical lines: lines where either x1 = x2 or y1 = y2.

So, the horizontal and vertical lines from the above list would produce the following diagram:

.......1..
..1....1..
..1....1..
.......1..
.112111211
..........
..........
..........
..........
222111....
In this diagram, the top left corner is 0,0 and the bottom right corner is 9,9. 
Each position is shown as the number of lines which cover that point or . 
if no line covers that point. The top-left pair of 1s, for example, 
comes from 2,2 -> 2,1; the very bottom row is formed by the overlapping 
lines 0,9 -> 5,9 and 0,9 -> 2,9.

To avoid the most dangerous areas, you need to determine the number of 
points where at least two lines overlap. In the above example, this is 
anywhere in the diagram with a 2 or larger - a total of 5 points.

Consider only horizontal and vertical lines. At how many points do at least two lines overlap?
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
    let newData = filterHorVert(inputData);
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

//puzzle5(readRawData(getTestData()));
getData("day05_input.txt");



