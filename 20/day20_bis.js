/*
--- Part Two ---
You still can't quite make out the details in the image. Maybe you just didn't enhance it enough.

If you enhance the starting input image in the above example a total of 50 times, 3351 pixels are lit in the final output image.

Start again with the original input image and apply the image enhancement algorithm 50 times. How many pixels are lit in the resulting image?
*/
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle20(arrayData);
      });
}

function readRawData(rawData){
    rawData = rawData.replace(/(\r\n|\n|\r)/gm, "\n");
    let blocks = rawData.split("\n\n");
    let instructions = blocks[0];
    let srows = blocks[1].split("\n");

    let rows = []
    srows.forEach(sr =>{
        let SDataString = sr.split("");
        let row = [];
        SDataString.forEach(c =>{
          row.push(c=="#");
        });
        rows.push(row);
    });
    return [blocks[0],rows];
}

function deepCopy(currentArray){
  var newArray = [];
  newArray = JSON.parse(JSON.stringify(currentArray));
  return newArray;
}

function getNumberFromCharBits(CharBits){
  let sum = 0;
  for(let n = 0 ; n<CharBits.length ; n++){
    if(CharBits[n]=="#"){
      sum += 2**(CharBits.length - n - 1);
    }
  }
  return sum;
}

function getNumberFromBoolBits(BoolBits){
  let sum = 0;
  for(let n = 0 ; n<BoolBits.length ; n++){
    if(BoolBits[n] == true){
      sum += 2**(BoolBits.length - n - 1);
    }
  }
  return sum;
}

function generateArray(n,value){
  return new Array(n).fill(value);
}

function addFrame(map, value){
  for(let i = 0; i<map.length; i++){
    map[i].unshift(value);
    map[i].push(value);
  }
  map.unshift(generateArray(map[0].length,value))
  map.push(generateArray(map[0].length,value))
}

function printMap(map){
  for(let r=0; r<map.length; r++){
    let row = "";
    for(let c=0; c<map[r].length; c++){
      row += map[r][c] == true? "#" : "."
    }
    console.log(row);
  }
}

function getMatrix(r,c,map){
  return [
    map[r-1][c-1], map[r-1][c], map[r-1][c+1], 
    map[r][c-1], map[r][c], map[r][c+1], 
    map[r+1][c-1], map[r+1][c], map[r+1][c+1] 
  ];
}

function step(instructions, map, frameValue=false){
  addFrame(map, map[0][0]);
  map2 = deepCopy(map);
  for(let r = 1; r< map.length-1; r++){
    for(let c = 1; c<map[r].length-1; c++){
      let numberInstruction = getNumberFromBoolBits(getMatrix(r,c,map));
      map2[r][c] = (instructions[numberInstruction] == "#")
    }
  }

  let newInfValue = instructions[0]=="#"? !map[0][0] : map[0][0];

let r;
  for(r = 0; r<map2.length; r++){
    map2[r][0] = newInfValue;
    map2[r][map2[0].length-1] = newInfValue;
}

let c;
  for(c = 0; c<map2[0].length; c++){
      map2[0][c] = newInfValue;
      map2[map2.length-1][c] = newInfValue;
  } 

  return map2;
}

function countLights(map){
  let sum = 0;
  for(let r = 1; r< map.length-1; r++){
    for(let c = 1; c<map[r].length-1; c++){
      if(map[r][c])sum++;
    }
  }
  return sum;

}

function puzzle20(inputData){
    let instructions = inputData[0];
    let map = inputData[1];
    addFrame(map,false);
    addFrame(map,false);
    let nSteps = 50;

    for(let n=0; n<nSteps; n++){
      map = step(instructions, map);
    }
    console.log("SOLUTION");
    console.log(countLights(map));
}


//getData("day20_test.txt");
getData("day20_input.txt");
