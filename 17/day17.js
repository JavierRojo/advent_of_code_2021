/*
--- Day 17: Trick Shot ---
You finally decode the Elves' message. HI, the message says. You continue searching for the sleigh keys.
Ahead of you is what appears to be a large ocean trench. Could the keys have fallen into it? You'd better send a probe to investigate.
The probe launcher on your submarine can fire the probe with any integer velocity in the x (forward) and y (upward, or downward if negative) directions. 
For example, an initial x,y velocity like 0,10 would fire the probe straight up, while an initial velocity like 10,-1 would fire the probe forward at a slight downward angle.
The probe's x,y position starts at 0,0. Then, it will follow some trajectory by moving in steps. On each step, these changes occur in the following order:

The probe's x position increases by its x velocity.
The probe's y position increases by its y velocity.
Due to drag, the probe's x velocity changes by 1 toward the value 0; that is, it decreases by 1 
    if it is greater than 0, increases by 1 if it is less than 0, or does not change if it is already 0.
Due to gravity, the probe's y velocity decreases by 1.

For the probe to successfully make it into the trench, the probe must be on some trajectory that 
causes it to be within a target area after any step. The submarine computer has already calculated 
this target area (your puzzle input). For example:

target area: x=20..30, y=-10..-5
This target area means that you need to find initial x,y velocity values 
such that after any step, the probe's x position is at least 20 and at most 30, 
and the probe's y position is at least -10 and at most -5.

Given this target area, one initial velocity that causes the probe to be within the target area after any step is 7,2:

.............#....#............
.......#..............#........
...............................
S........................#.....
...............................
...............................
...........................#...
...............................
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................TTTTTTTT#TT
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................TTTTTTTTTTT
In this diagram, S is the probe's initial position, 0,0. The x coordinate increases to the right, and the y coordinate increases upward. In the bottom right, positions that are within the target area are shown as T. After each step (until the target area is reached), the position of the probe is marked with #. (The bottom-right # is both a position the probe reaches and a position in the target area.)

Another initial velocity that causes the probe to be within the target area after any step is 6,3:

...............#..#............
...........#........#..........
...............................
......#..............#.........
...............................
...............................
S....................#.........
...............................
...............................
...............................
.....................#.........
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................T#TTTTTTTTT
....................TTTTTTTTTTT
Another one is 9,0:

S........#.....................
.................#.............
...............................
........................#......
...............................
....................TTTTTTTTTTT
....................TTTTTTTTTT#
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................TTTTTTTTTTT
One initial velocity that doesn't cause the probe to be within the target area after any step is 17,-4:

S..............................................................
...............................................................
...............................................................
...............................................................
.................#.............................................
....................TTTTTTTTTTT................................
....................TTTTTTTTTTT................................
....................TTTTTTTTTTT................................
....................TTTTTTTTTTT................................
....................TTTTTTTTTTT..#.............................
....................TTTTTTTTTTT................................
...............................................................
...............................................................
...............................................................
...............................................................
................................................#..............
...............................................................
...............................................................
...............................................................
...............................................................
...............................................................
...............................................................
..............................................................#
The probe appears to pass through the target area, but is never within it after any step. Instead, it continues down and to the right - only the first few steps are shown.

If you're going to fire a highly scientific probe out of a super cool probe launcher, 
you might as well do it with style. How high can you make the probe go while still reaching the target area?

In the above example, using an initial velocity of 6,9 is the best you can do, 
causing the probe to reach a maximum y position of 45. (Any higher initial y velocity causes the probe to overshoot the target area entirely.)

Find the initial velocity that causes the probe to reach the highest y position and still eventually 
be within the target area after any step. What is the highest y position it reaches on this trajectory?

*/

var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle17(arrayData);
      });
}

function readRawData(rawData){
    //"target area: x=20..30, y=-10..-5"
    let strBounds = rawData.split(": ")[1].split(", ");
    let xStrBounds = strBounds[0].split("..");
    let yStrBounds = strBounds[1].split("..");
    xStrBounds[0] = xStrBounds[0].split("=")[1]; //removes x=
    yStrBounds[0] = yStrBounds[0].split("=")[1]; //removes y=
    let xBounds = [parseInt(xStrBounds[0]), parseInt(xStrBounds[1])]
    let yBounds = [parseInt(yStrBounds[0]), parseInt(yStrBounds[1])]
    return [xBounds, yBounds];
}

function calculateXSpeed(xBounds){
    for(let xs=0; xs<=xBounds[0]; xs++){
        let p = getxPath(xs);
        if(anyPointInBounds(p,xBounds))return xs;
    }
    return -1;
}

function anyPointInBounds(list, bounds){
    for(let i = 0 ; i< list.length; i++){
        if(list[i] >= bounds[0] && list[i]<=bounds[1]){
            return true;
        }
    }
    return false;
}

function getMaxHeight(path){
    let m = 0;
    for(let i = 0; i< path.length; i++){
        m = Math.max(m,path[i][1]);
    }
    return m;
}

function getxPath(xs){
    let p = [];
    p.push(0);
    while(xs>0){
        p.push(p[p.length-1]+xs);
        xs--;
    }
    return p;
}

function getPath(xs, ys, xBounds, yBounds, n){
    let p= [];
    count = 0; 
    found = false;
    currentPoint = [0,0]
    p.push([...currentPoint])

    do{
        count ++;
        currentPoint[0] += xs;
        currentPoint[1] += ys;
        p.push([...currentPoint])
        if(
            currentPoint[0] >= xBounds[0] && 
            currentPoint[0] <= xBounds[1] &&
            currentPoint[1] >= yBounds[0] && 
            currentPoint[1] <= yBounds[1]
            ) break;

        if(ys <0 && currentPoint[1] < yBounds[0])break;
        xs = xs==0? 0 : xs-1;
        //xs = Math.max(0, xs);
        ys--;     
    }while(!found && count < n);
    return p;

}

function puzzle17(inputData){
    console.log(inputData);

    let xBounds = inputData[0];
    let yBounds = inputData[1];
    let y_speed = Math.abs(yBounds[0])-1;
    let x_speed = calculateXSpeed(xBounds);
    let path = getPath(x_speed, y_speed, xBounds, yBounds, 800);


    console.log("SOLUTION");
    /*path.forEach(p => {
        console.log(p);        
    });*/
    console.log("---");
    console.log([x_speed, y_speed])
    console.log(getMaxHeight(path));
}

//getData("day17_test.txt");
getData("day17_input.txt");
