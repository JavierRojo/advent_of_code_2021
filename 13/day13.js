/*

--- Day 13: Transparent Origami ---
You reach another volcanically active part of the cave. It would be nice if you could do some kind of thermal imaging so you could tell ahead of time which caves are too hot to safely enter.

Fortunately, the submarine seems to be equipped with a thermal camera! When you activate it, you are greeted with:

Congratulations on your purchase! To activate this infrared thermal imaging
camera system, please enter the code found on page 1 of the manual.
Apparently, the Elves have never used this feature. To your surprise, you manage to find the manual; as you go to open it, page 1 falls out. It's a large sheet of transparent paper! The transparent paper is marked with random dots and includes instructions on how to fold it up (your puzzle input). For example:

6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
The first section is a list of dots on the transparent paper. 0,0 represents the top-left coordinate. The first value, x, increases to the right. The second value, y, increases downward. So, the coordinate 3,0 is to the right of 0,0, and the coordinate 0,7 is below 0,0. The coordinates in this example form the following pattern, where # is a dot on the paper and . is an empty, unmarked position:

...#..#..#.
....#......
...........
#..........
...#....#.#
...........
...........
...........
...........
...........
.#....#.##.
....#......
......#...#
#..........
#.#........
Then, there is a list of fold instructions. Each instruction indicates a 
line on the transparent paper and wants you to fold the paper up (for horizontal y=... lines) 
or left (for vertical x=... lines). In this example, the first fold instruction 
is fold along y=7, which designates the line formed by all of the positions where y is 7 (marked here with -):

...#..#..#.
....#......
...........
#..........
...#....#.#
...........
...........
-----------
...........
...........
.#....#.##.
....#......
......#...#
#..........
#.#........
Because this is a horizontal line, fold the bottom half up. Some of the dots might 
end up overlapping after the fold is complete, but dots will never appear exactly 
on a fold line. The result of doing this fold looks like this:

#.##..#..#.
#...#......
......#...#
#...#......
.#.#..#.###
...........
...........
Now, only 17 dots are visible.

Notice, for example, the two dots in the bottom left corner before the transparent paper 
is folded; after the fold is complete, those dots appear in the top left corner (at 0,0 and 0,1). 
Because the paper is transparent, the dot just below them in the result (at 0,3) remains visible, 
as it can be seen through the transparent paper.
Also notice that some dots can end up overlapping; in this case, the dots merge together and become a single dot.
The second fold instruction is fold along x=5, which indicates this line:

#.##.|#..#.
#...#|.....
.....|#...#
#...#|.....
.#.#.|#.###
.....|.....
.....|.....
Because this is a vertical line, fold left:

#####
#...#
#...#
#...#
#####
.....
.....
The instructions made a square!

The transparent paper is pretty big, so for now, focus on just completing the first fold. 
After the first fold in the example above, 17 dots are visible - dots that end up 
overlapping after the fold is completed count as a single dot.
How many dots are visible after completing just the first fold instruction on your transparent paper?

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

    dots = fold(instructions[0],dots);
    /*for(let i=0;i<instructions.length;i++){
        dots = fold(instructions[i],dots);
    }*/

    console.log("SOLUTION");
    //drawPaper(dots);
    dots.filter(onlyUnique);
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
                d[1] = ins[1] - (d[1] - ins[1]);
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
