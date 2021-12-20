/*
--- Part Two ---
Maybe a fancy trick shot isn't the best idea; after all, you only have one probe, so you had better not miss.

To get the best idea of what your options are for launching the probe, you need to find every initial velocity 
that causes the probe to eventually be within the target area after any step.

In the above example, there are 112 different initial velocity values that meet these criteria:

23,-10  25,-9   27,-5   29,-6   22,-6   21,-7   9,0     27,-7   24,-5
25,-7   26,-6   25,-5   6,8     11,-2   20,-5   29,-10  6,3     28,-7
8,0     30,-6   29,-8   20,-10  6,7     6,4     6,1     14,-4   21,-6
26,-10  7,-1    7,7     8,-1    21,-9   6,2     20,-7   30,-10  14,-3
20,-8   13,-2   7,3     28,-8   29,-9   15,-3   22,-5   26,-8   25,-8
25,-6   15,-4   9,-2    15,-2   12,-2   28,-9   12,-3   24,-6   23,-7
25,-10  7,8     11,-3   26,-7   7,1     23,-9   6,0     22,-10  27,-6
8,1     22,-8   13,-4   7,6     28,-6   11,-4   12,-4   26,-9   7,4
24,-10  23,-8   30,-8   7,0     9,-1    10,-1   26,-5   22,-9   6,5
7,5     23,-6   28,-10  10,-2   11,-1   20,-9   14,-2   29,-7   13,-3
23,-5   24,-8   27,-9   30,-7   28,-5   21,-10  7,9     6,6     21,-5
27,-10  7,2     30,-9   21,-8   22,-7   24,-9   20,-6   6,9     29,-5
8,-2    27,-8   30,-5   24,-7

How many distinct initial velocity values cause the probe to be within the target area after any step?

ySpeed cannot be higher than or equal to ABS(yBounds[0]), as it would simply fall through no matter xSpeed. In this case, ySpeed < 10
There are a square of posibilities of "first shots": this means, shoooting straight at the area with the first step. This would mean 10x5= 50 of the cases
xSpeed must be always lower than xBounds[1] and cannot be in the range ([xBounds[1]/2]+1) to xBounds[0]. In this case, always xSpeed <= 30, xSpeed not in [16,19]
There is a value where xSpeed will never reach xBounds[0]. xSpeed must be higher than that. xSpeed >= 6
ySpeed must be higher than or equal to yBounds[0] ySpeed >= -10 


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
        ) return p;

        if(
            ys <0 && 
            currentPoint[1] < yBounds[0]
        )return null;

        if(
            currentPoint[0] > xBounds[1]
        )return null;

        if(
            currentPoint[0] < xBounds[0] && xs == 0
        )return null;

        xs = xs==0? 0 : xs-1;
        //xs = Math.max(0, xs);
        ys--;     
    }while(!found && count < n);
    return null;

}

function puzzle17(inputData){
    console.log(inputData);

    let xBounds = inputData[0];
    let yBounds = inputData[1];
    let paths = [];
    let vels = [];


    for(let ySpeed = yBounds[0]; ySpeed < Math.abs(yBounds[0]); ySpeed++){        
        for(let xSpeed = 0; xSpeed <= xBounds[1]; xSpeed++){
            let path = getPath(xSpeed, ySpeed, xBounds, yBounds, 8000);
            if (path){
                paths.push(path);
                vels.push([xSpeed,ySpeed])
            }
        }
    }
    console.log("SOLUTION")
    console.log(paths.length);
}

//getData("day17_test.txt");
getData("day17_input.txt");
