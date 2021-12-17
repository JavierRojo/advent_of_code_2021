/*
--- Day 11: Dumbo Octopus ---
You enter a large cavern full of rare bioluminescent dumbo octopuses! 
They seem to not like the Christmas lights on your submarine, so you turn them off for now.

There are 100 octopuses arranged neatly in a 10 by 10 grid. 
Each octopus slowly gains energy over time and flashes brightly for a moment when its energy is full.
Although your lights are off, maybe you could navigate through the cave without disturbing the octopuses 
if you could predict when the flashes of light will happen.

Each octopus has an energy level - your submarine can remotely measure the energy level of each octopus (your puzzle input). For example:

5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526

The energy level of each octopus is a value between 0 and 9. Here, 
the top-left octopus has an energy level of 5, 
the bottom-right one has an energy level of 6, and so on.

You can model the energy levels and flashes of light in steps. During a single step, the following occurs:

First, the energy level of each octopus increases by 1.
Then, any octopus with an energy level greater than 9 flashes. This increases the 
energy level of all adjacent octopuses by 1, including octopuses that are diagonally adjacent. 
If this causes an octopus to have an energy level greater than 9, it also flashes. 
This process continues as long as new octopuses keep having their energy level increased beyond 9. 
(An octopus can only flash at most once per step.)
Finally, any octopus that flashed during this step has its energy level set to 0, as it used all of its energy to flash.
Adjacent flashes can cause an octopus to flash on a step even if it begins that step with very little energy. 
Consider the middle octopus with 1 energy in this situation:


After step 10, there have been a total of 204 flashes.

After 100 steps, there have been a total of 1656 flashes.

Given the starting energy levels of the dumbo octopuses in your cavern, 
simulate 100 steps. How many total flashes are there after 100 steps?
*/
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle11(arrayData);
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

function getBasicTestData(){
    return ""+
    "11111"+"\n"+
    "19991"+"\n"+
    "19191"+"\n"+
    "19991"+"\n"+
    "11111"
}

function getTestData(){
    return ""+
    "5483143223"+"\n"+
    "2745854711"+"\n"+
    "5264556173"+"\n"+
    "6141336146"+"\n"+
    "6357385478"+"\n"+
    "4167524645"+"\n"+
    "2176841721"+"\n"+
    "6882881134"+"\n"+
    "4846848554"+"\n"+
    "5283751526"
}

function copyArray(currentArray){
    let newArray = currentArray.map(function(arr) {
        return arr.slice();
    });
    return newArray;
}
// --- //

function puzzle11(inputData){
    console.log("Before any steps:");
    console.log(inputData);
    let nSteps = 100;
    var nFlashes = 0;
    let tmpFlashes = 0;
    let nextStep = [];
    nextStep = copyArray(inputData);

    for(let n=0; n<nSteps; n++){
        [tmpFlashes,nextStep] = step(nextStep);
        console.log("After step "+(n+1));
        //console.log(nextStep);
        nFlashes = nFlashes + tmpFlashes;
    }

    console.log("SOLUTION");
    console.log(nFlashes);
}

/*
First, the energy level of each octopus increases by 1.
Then, any octopus with an energy level greater than 9 flashes. This increases the 
energy level of all adjacent octopuses by 1, including octopuses that are diagonally adjacent. 
If this causes an octopus to have an energy level greater than 9, it also flashes. 
This process continues as long as new octopuses keep having their energy level increased beyond 9. 
(An octopus can only flash at most once per step.)
Finally, any octopus that flashed during this step has its energy level set to 0, as it used all of its energy to flash.
*/
function step(map){
    let nRows = map.length;
    let nCols = map[0].length;
    let newMap = copyArray(map);
    let flashed = createBoolMatrix(10,10);
    let nflashes = 0;
    for(let i=0; i<nRows;i++){
        for(let j=0; j<nCols;j++){
            newMap[i][j]++;         
        }
    }
    let anyFlash = false;
    do{
        anyFlash = false;
        for(let i=0; i<nRows;i++){
            for(let j=0; j<nCols;j++){
                if(newMap[i][j]>9 && flashed[i][j] == false){
                    // FLASH!
                    anyFlash = true;
                    nflashes++;
                    flashed[i][j] = true;
                    newMap[i][j] = 0;
                    let ns = getNeighboursIndexes(i,j,newMap);
                    ns.forEach(n => {
                        if(flashed[n[0]][n[1]] == false){
                            newMap[n[0]][n[1]]++;
                        }                        
                    });
                }
            }
        }

    }while(anyFlash)
    //console.log(flashed);

    

    return [nflashes,newMap];
}

function createBoolMatrix(rows,cols,value=false){
    let arr = [];
    for(let i=0; i<rows;i++){
        let r =[];
        for(let j=0; j<cols;j++){
            r.push(value);
        }
        arr.push(r);
    }
    return arr;
}

function getNeighboursIndexes(r,c,map){
    let nRows = map.length;
    let nCols = map[0].length;
    let upper = false;
    let bottom = false;
    let right = false;
    let left = false;

    
    // --- VERTICAL
    if(r==0)upper = true;
    if(r == nRows-1) bottom = true;
    // --- HORIZONTAL
    if(c==0) left = true;
    if(c == nCols-1) right = true;

    if(upper && left)  return [[0,1],[1,1],[1,0]];
    if(upper && right) return [[0,nCols-2],[1,nCols-2],[1,nCols-1]];
    
    if(bottom && left)  return [[nRows-2,0],[nRows-2,1],[nRows-1,1]];
    if(bottom && right) return [[nRows-1,nCols-2],[nRows-2,nCols-2],[nRows-2,nCols-1]];

    
    if(upper) return [[0,c-1],[1,c-1],[1,c],[1,c+1],[0,c+1]];
    if(bottom) return [[nRows-1,c-1],[nRows-2,c-1],[nRows-2,c],[nRows-2,c+1],[nRows-1,c+1]];
    if(left) return [[r-1,0],[r-1,1],[r,1],[r+1,1],[r+1,0]];
    if(right) return [[r-1,nCols-1],[r-1,nCols-2],[r,nCols-2],[r+1,nCols-2],[r+1,nCols-1]];

    return [[r,c-1],[r+1,c-1],[r+1,c],[r+1,c+1],[r,c+1],[r-1,c+1],[r-1,c],[r-1,c-1]];
}

//puzzle11(readRawData(getBasicTestData()));
//puzzle11(readRawData(getTestData()));
getData("day11_input.txt");