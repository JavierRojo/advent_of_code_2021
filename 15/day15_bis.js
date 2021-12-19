/*
--- Day 15: Chiton ---
You've almost reached the exit of the cave, but the walls are getting closer together. 
Your submarine can barely still fit, though; the main problem is that the walls of the cave are covered in chitons, 
and it would be best not to bump any of them.

The cavern is large, but has a very low ceiling, restricting your motion to two dimensions. 
The shape of the cavern resembles a square; a quick scan of chiton density produces a map 
of risk level throughout the cave (your puzzle input). For example:

1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581

You start in the top left position, your destination is the bottom right position, and you cannot move diagonally. 
The number at each position is its risk level; to determine the total risk of an entire path, add up the risk levels 
of each position you enter (that is, don't count the risk level of your starting position unless you enter it; leaving it adds no risk to your total).
Your goal is to find a path with the lowest total risk. In this example, a path with the lowest total risk is highlighted here:

The total risk of this path is 40 (the starting position is never entered, so its risk is not counted).
What is the lowest total risk of any path from the top left to the bottom right?
*/
const { create } = require('domain');
var fs = require('fs');
const { exit } = require('process');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle15(arrayData);
      });
}

function readRawData(rawData){
    let map = [];
    rawData = rawData.replace(/(\r\n|\n|\r)/gm, "\n");
    let stringRows = rawData.split("\n");

    stringRows.forEach(row => {
        let stringrow = row.split("");
        let introw = [];
        stringrow.forEach(s => {
            introw.push(parseInt(s));            
        });
        map.push(introw);
    });
    return map;
}

function modifyInputMap(inputMap){
    let template = deepCopy(inputMap);
    let output = [];
    for(let r = 0; r<5; r++)
        for(let c=0; c<5; c++){
            let factor = r+c;
            let chunk = deepCopy(template);
            chunk.forEach(row => {
                for(let e=0; e< row.length; e++){
                    row[e] += factor;
                    row[e] = row[e] <= 9 ? row[e] : row[e] % 9;
                }                
            });
            if(c==0)
                chunk.forEach(row => {output.push(row);});
            else
                for(let i = 0; i<template[0].length; i++)
                    for(let j= 0; j<template[0].length; j++)
                        output[r*template.length+i].push(chunk[i][j]);      
        }    
    return output;
}

function deepCopy(currentArray){
    var newArray = [];

    for (var i = 0; i < currentArray.length; i++)
        newArray[i] = currentArray[i].slice();
    return newArray;
}

function printMatrix(m){
    m.forEach(row => {
        console.log(""+row);        
    });
}

function getNeighbourIx(r,c,nRows,nCols,onlyDownAndRight=true){
    let ns = [];
    if(onlyDownAndRight){
        if(r < nRows-1) ns.push([r+1,c]);
        if(c < nCols-1) ns.push([r,c+1]);
    }
    else{
        if(r < nRows-1) ns.push([r+1,c]);
        if(c < nCols-1) ns.push([r,c+1]);
        if(r > 0) ns.push([r-1,c]);
        if(c > 0) ns.push([r,c-1]);
    }
    return ns;
}

function getValueAt(map,ixPair){
    return map[ ixPair[0] ][ ixPair[1] ];
}

function puzzle15(inputData){
    inputData = modifyInputMap(inputData);
    //printMatrix(inputData);

    //printMatrix(inputData);
    console.log("");
    let weights = calculatePath(inputData); //A*
    //console.log(weights);
    
    // last element should have same weight as last element
    //let w = calculateWeight(weightsMap, inputData, inputData.length-1, inputData[0].length-1);

    console.log("SOLUTION");
    let path = pathFromWeights(weights);
    //console.log(path);
    path.forEach(n=>{
        console.log(inputData[n[0]][n[1]]);
    });

    //printPropertyMatrix(weights,"g", true);
    //console.log(" ");
    //printPropertyMatrix(weights,"h", true);
    
    console.log(riskFromPath(path,inputData))
}

// --- FUNCTIONS ---- //
function riskFromPath(path,map){
    let sum = 0;
    path.forEach(n=>{
        sum += map[n[0]][n[1]];
    });
    return sum;
}
function pathFromWeights(weights){
    let ret = [];
    let row = weights.length-1;
    let col = weights[0].length-1;
    let currentNode = weights[row][col];
    let ix = [row,col];
    //console.log(weights);


    while(currentNode["parent"] != null){
        ret.push(ix);
        ix = currentNode["parent"];
        currentNode = getValueAt(weights,ix);
    }

    return ret;

}

function createMetaMap(map){
    let nRows = map.length;
    let nCols = map[0].length;

    let metaMap = [];
    for(let r=0; r<nRows; r++){
        let row = [];
        for(let c=0; c<nCols; c++){
            row.push(undefined);
        }
        metaMap.push(row);
    }
    return metaMap;
}

function printPropertyMatrix(map,feature,printExistance = false){
    let nRows = map.length;
    let nCols = map[0].length;
    for(let r=0; r<nRows; r++){
        let row = "";
        for(let c=0; c<nCols; c++){
            row += "|";
            if(map[r][c] == undefined) row += ".";
            else{
                if(map[r][c][feature]){                    
                    row += printExistance? "#" : map[r][c][feature];
                }
                else if(map[r][c].length == 1) row+= map[r][c]
                else row+= " "
            }
        }
        console.log(row);
    }
}

function createMetaData(F,g,h,parent){
    let dic = {}
    dic["F"] = F;
    dic["g"] = g; // We don't count the cost of entering the first cell
    dic["h"] = h //calculateH([0,0],nRows, nCols);
    dic["parent"] = parent;
    return dic;
}

function remove(arr,ix){
    for(let i=0; i<arr.length; i++){
        if(ix[0] == arr[i][0] && ix[1] == arr[i][1]){
            arr.splice(i, 1);
            break;
        }
    }
    return arr;
}

function calculatePath(map){
    let nRows = map.length;
    let nCols = map[0].length;
    openCells = []; //list of Ix
    closeCells = []; //list of Ix
    let openMap = createMetaMap(map);
    let closedMap = createMetaMap(map);

    let initialCell = createMetaData(0,0,calculateH([0,0],nRows, nCols),null);
    openMap[0][0] = initialCell;

    let foundEnd = false;
    let count = 0;
    do{
        if(count %10000 == 0) console.log(count);
        count++;
        let candidate = getCandidate(openCells, openMap); //candidate Ix
        //console.log(candidate);
        //Copy so below instruction doesnt mess up
        closedMap[candidate[0]][candidate[1]] = Object.assign({}, getValueAt(openMap,candidate));
        openMap[candidate[0]][candidate[1]] = undefined;
        openCells = remove(openCells, candidate);

        let neighbours = getNeighbourIx(candidate[0],candidate[1],nRows,nCols,false);
        neighbours.forEach(n => {
            if(getValueAt(closedMap,n) == undefined){
                let hValue = calculateH(n,nRows,nCols);
                let gValue = getValueAt(closedMap,candidate)["g"] + getValueAt(map,n); // int(sdata[n[1]][n[0]])
                let F = gValue + hValue; // F = current weight + heuristic

                if(getValueAt(openMap,n) == undefined){
                    openMap[n[0]][n[1]] = createMetaData(F,gValue, hValue,candidate);
                    openCells.push(n);
                } else if(gValue < getValueAt(openMap,n)["g"]){
                    openMap[n[0]][n[1]]["F"] = F;
                    openMap[n[0]][n[1]]["g"] = gValue;
                    openMap[n[0]][n[1]]["parent"] = candidate;
                }
            }
        });

        if (getValueAt(closedMap,[nRows-1, nCols-1])){
            foundEnd = true;
        }
    } while(!foundEnd);
    return closedMap;// closedMap[nRows-1, nCols-1];
}

function getCandidate(openCells, metaMap){
    let value;
    let returnIx = [0,0];

    openCells.forEach(cIx =>{
        let fConsidered = getValueAt(metaMap,cIx)["F"];
        if (value == undefined || fConsidered < value){
            value = fConsidered;
            returnIx = cIx;
        }
    });    
    return returnIx;
}

function calculateH(nodeIx, nRows, nCols){
    // Heuristic function
    // https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    let D = 1; // Any value higher than 1 results in some paths not being checked!!
    let dx = Math.abs(nRows-1 - nodeIx[0]);
    let dy = Math.abs(nCols-1 - nodeIx[1]);
    return (dx + dy) * D;

}

//getData("day15_little.txt");
//getData("day15_test.txt");
getData("day15_input.txt");