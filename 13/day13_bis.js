/*
--- Part Two ---
Finish folding the transparent paper according to the instructions. The manual says the code is always eight capital letters.

What code do you use to activate the infrared thermal imaging camera system?

*/
var fs = require('fs');

function copyArray(currentArray){
    let newArray = currentArray.map(function(arr) {
        return arr.slice();
    });
    return newArray;
}

function createMatrix(nrows,ncols){
    let res = [];
    for(let r=0; r<nrows; r++){
        let row =[];        
        for(let c=0; c<ncols; c++){
            row.push(false);
        }
        res.push(row);
    }
    return res;
}

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle13(arrayData);
      });
}

function readRawData(rawData){
    let initialDots = [];
    let instructions = [];
    let rawBlocks = rawData.split("\n\n");
    let rawDots = rawBlocks[0].split("\n");
    let rawInstructions = rawBlocks[1].split("\n");

    rawDots.forEach(row => {
        let stringrow = row.split(",");
        let x = parseInt(stringrow[0]);
        let y = parseInt(stringrow[1]);
        initialDots.push([x,y]);
    });

    rawInstructions.forEach(row => {
        let stringrow = row.split(" ");
        let info = stringrow[2].split("=");
        let coord = info[0];
        let n = parseInt(info[1]);
        instructions.push([coord,n]);
    });


    return [initialDots,instructions];
}

function getTestData(){
    return "6,10"+"\n"+
    "0,14"+"\n"+
    "9,10"+"\n"+
    "0,3"+"\n"+
    "10,4"+"\n"+
    "4,11"+"\n"+
    "6,0"+"\n"+
    "6,12"+"\n"+
    "4,1"+"\n"+
    "0,13"+"\n"+
    "10,12"+"\n"+
    "3,4"+"\n"+
    "3,0"+"\n"+
    "8,4"+"\n"+
    "1,10"+"\n"+    
    "2,14"+"\n"+    
    "8,10"+"\n"+
    "9,0"+"\n\n"+
    "fold along y=7"+"\n"+
    "fold along x=5"
}

function getMax(points) {
    let maxX = 0;
    let maxY = 0;
    points.forEach(p => {
        maxX = Math.max(p[0],maxX);
        maxY = Math.max(p[1],maxY);        
    });
    return [maxX, maxY]

}

function getSize(instructions){
    let maxX = 0;
    let maxY = 0;
    let checkedX = false;
    let checkedY = false;
    instructions.forEach(i => {
        if(i[0] == "x" && !checkedX){
            checkedX = true;
            maxX = i[1]*2+1;
        }
        if(i[0] == "y" && !checkedY){
            checkedY = true;
            maxY = i[1]*2+1;
        }          
    });
    return [maxX, maxY]

}

function drawPaper(dots){
    
    let s = getMax(dots);
    let map = [];
    for(let i=0; i<=s[1]; i++){
        let row =[];
        for(let j = 0; j<=s[0];j++){
            row.push(".");
        }
        map.push(row);
    }
    dots.forEach((d)=>{
        map[d[1]][d[0]] = "#";
    });

    map.forEach((row)=>{
        console.log(row.join(""));
    })    
}

function pointInArray(p,arr){
    for(let i= 0; i<arr.length; i++){
        if(p[0] == arr[i][0] && p[1] == arr[i][1]) return true;
    }
    return false;
}

function puzzle13(inputData){
    let dots = inputData[0];
    let instructions = inputData[1];
    console.log(dots.length);

    //dots = fold(instructions[0],dots);
    for(let i=0;i<instructions.length;i++){
        let tmp = copyArray(dots);
        dots = fold(instructions[i],tmp);
    }

    console.log("SOLUTION");
    drawPaper(dots);
    console.log(dots.length);

}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function fold(ins, dots){
    let tmpDots = [];
    if(ins[0] == "x"){
        tmpDots = [];
        dots.forEach((d)=>{
            if(d[0] <= ins[1] && !pointInArray(d,tmpDots)){tmpDots.push(d);}
            else{
                d[0] = ins[1] - Math.abs(d[0] - ins[1]);
                if(!pointInArray(d,tmpDots))tmpDots.push(d);
            }
        });
        dots = tmpDots;
    }

    if(ins[0] == "y"){
        tmpDots = [];
        dots.forEach((d)=>{
            if(d[1] <= ins[1] && !pointInArray(d,tmpDots)){tmpDots.push(d);}
            else{ 
                d[1] = ins[1] - Math.abs(d[1] - ins[1]);
                if(!pointInArray(d,tmpDots))tmpDots.push(d);
            }
        });
        dots = tmpDots;
    }    
    console.log(dots.length);
    return dots;
}

function PAUSE(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

function CompareArrays(p1,p2){
    if(p1.length != p2.length) return false;
    for(let i=0;i<p1.length;i++){
        if (p1[i] != p2[i])return false;
    }
    return true;
}

//puzzle13(readRawData(getTestData()));
getData("day13_input.txt");
