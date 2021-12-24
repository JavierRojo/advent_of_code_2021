/*
--- Day 20: Trench Map ---
With the scanners fully deployed, you turn their attention to mapping the floor of the ocean trench.

When you get back the image from the scanners, it seems to just be random noise. Perhaps you can combine an image enhancement algorithm and the input image (your puzzle input) to clean it up a little.

For example:

..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##
#..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###
.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#.
.#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#.....
.#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#..
...####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.....
..##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###
The first section is the image enhancement algorithm. It is normally given on a single line, but it has been wrapped to multiple lines in this example for legibility. The second section is the input image, a two-dimensional grid of light pixels (#) and dark pixels (.).

The image enhancement algorithm describes how to enhance an image by simultaneously converting all pixels in the input image into an output image. Each pixel of the output image is determined by looking at a 3x3 square of pixels centered on the corresponding input image pixel. So, to determine the value of the pixel at (5,10) in the output image, nine pixels from the input image need to be considered: (4,9), (4,10), (4,11), (5,9), (5,10), (5,11), (6,9), (6,10), and (6,11). These nine input pixels are combined into a single binary number that is used as an index in the image enhancement algorithm string.

For example, to determine the output pixel that corresponds to the very middle pixel of the input image, the nine pixels marked by [...] would need to be considered:

# . . # .
#[. . .].
#[# . .]#
.[. # .].
. . # # #
Starting from the top-left and reading across each row, these pixels are ..., then #.., then .#.; combining these forms ...#...#.. By turning dark pixels (.) into 0 and light pixels (#) into 1, the binary number 000100010 can be formed, which is 34 in decimal.

The image enhancement algorithm string is exactly 512 characters long, enough to match every possible 9-bit binary number. The first few characters of the string (numbered starting from zero) are as follows:

0         10        20        30  34    40        50        60        70
|         |         |         |   |     |         |         |         |
..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##
In the middle of this first group of characters, the character at index 34 can be found: #. So, the output pixel in the center of the output image should be #, a light pixel.

This process can then be repeated to calculate every pixel of the output image.

Through advances in imaging technology, the images being operated on here are infinite in size. Every pixel of the infinite output image needs to be calculated exactly based on the relevant pixels of the input image. The small input image you have is only a small region of the actual infinite input image; the rest of the input image consists of dark pixels (.). For the purposes of the example, to save on space, only a portion of the infinite-sized input and output images will be shown.

The starting input image, therefore, looks something like this, with more dark pixels (.) extending forever in every direction not shown here:

...............
...............
...............
...............
...............
.....#..#......
.....#.........
.....##..#.....
.......#.......
.......###.....
...............
...............
...............
...............
...............
By applying the image enhancement algorithm to every pixel simultaneously, the following output image can be obtained:

...............
...............
...............
...............
.....##.##.....
....#..#.#.....
....##.#..#....
....####..#....
.....#..##.....
......##..#....
.......#.#.....
...............
...............
...............
...............
Through further advances in imaging technology, the above output image can also be used as an input image! This allows it to be enhanced a second time:

...............
...............
...............
..........#....
....#..#.#.....
...#.#...###...
...#...##.#....
...#.....#.#...
....#.#####....
.....#.#####...
......##.##....
.......###.....
...............
...............
...............
Truly incredible - now the small details are really starting to come through. After enhancing the original input image twice, 35 pixels are lit.

Start with the original input image and apply the image enhancement algorithm twice, being careful to account for the infinite size of the images. How many pixels are lit in the resulting image?
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
    addFrame(map,false);
    //printMap(map);
    map1 = step(instructions, map);
    //printMap(map1);
    map2 = step(instructions, map1);   
    //console.log("---");
    //printMap(map2); 
    console.log("SOLUTION");
    console.log(countLights(map2));
}


//getData("day20_test.txt");
getData("day20_input.txt");
