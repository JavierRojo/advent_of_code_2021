/*
--- Day 22: Reactor Reboot ---
Operating at these extreme ocean depths has overloaded the submarine's reactor; it needs to be rebooted.
The reactor core is made up of a large 3-dimensional grid made up entirely of cubes, one cube per integer
3-dimensional coordinate (x,y,z). Each cube can be either on or off; at the start of the reboot process, they are all off. 
(Could it be an old model of a reactor you've seen before?)

To reboot the reactor, you just need to set all of the cubes to either on or off by following a 
list of reboot steps (your puzzle input). Each step specifies a cuboid (the set of all cubes that 
have coordinates which fall within ranges for x, y, and z) and whether to turn all of the cubes in that cuboid on or off.

For example, given these reboot steps:

on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10
The first step (on x=10..12,y=10..12,z=10..12) turns on a 3x3x3 cuboid consisting of 27 cubes:

10,10,10
10,10,11
10,10,12
10,11,10
10,11,11
10,11,12
10,12,10
10,12,11
10,12,12
11,10,10
11,10,11
11,10,12
11,11,10
11,11,11
11,11,12
11,12,10
11,12,11
11,12,12
12,10,10
12,10,11
12,10,12
12,11,10
12,11,11
12,11,12
12,12,10
12,12,11
12,12,12
The second step (on x=11..13,y=11..13,z=11..13) turns on a 3x3x3 cuboid that overlaps with the first. As a result, only 19 additional cubes turn on; the rest are already on from the previous step:

11,11,13
11,12,13
11,13,11
11,13,12
11,13,13
12,11,13
12,12,13
12,13,11
12,13,12
12,13,13
13,11,11
13,11,12
13,11,13
13,12,11
13,12,12
13,12,13
13,13,11
13,13,12
13,13,13
The third step (off x=9..11,y=9..11,z=9..11) turns off a 3x3x3 cuboid that overlaps partially with some cubes that are on, ultimately turning off 8 cubes:

10,10,10
10,10,11
10,11,10
10,11,11
11,10,10
11,10,11
11,11,10
11,11,11
The final step (on x=10..10,y=10..10,z=10..10) turns on a single cube, 10,10,10. After this last step, 39 cubes are on.

The initialization procedure only uses cubes that have x, y, and z positions of at least -50 and at most 50. For now, ignore cubes outside this region.

Here is a larger example:

on x=-20..26,y=-36..17,z=-47..7
on x=-20..33,y=-21..23,z=-26..28
on x=-22..28,y=-29..23,z=-38..16
on x=-46..7,y=-6..46,z=-50..-1
on x=-49..1,y=-3..46,z=-24..28
on x=2..47,y=-22..22,z=-23..27
on x=-27..23,y=-28..26,z=-21..29
on x=-39..5,y=-6..47,z=-3..44
on x=-30..21,y=-8..43,z=-13..34
on x=-22..26,y=-27..20,z=-29..19
off x=-48..-32,y=26..41,z=-47..-37
on x=-12..35,y=6..50,z=-50..-2
off x=-48..-32,y=-32..-16,z=-15..-5
on x=-18..26,y=-33..15,z=-7..46
off x=-40..-22,y=-38..-28,z=23..41
on x=-16..35,y=-41..10,z=-47..6
off x=-32..-23,y=11..30,z=-14..3
on x=-49..-5,y=-3..45,z=-29..18
off x=18..30,y=-20..-8,z=-3..13
on x=-41..9,y=-7..43,z=-33..15
on x=-54112..-39298,y=-85059..-49293,z=-27449..7877
on x=967..23432,y=45373..81175,z=27513..53682

The last two steps are fully outside the initialization procedure area; 
all other steps are fully within it. After executing these steps in the initialization procedure region, 590784 cubes are on.

Execute the reboot steps. Afterward, considering only cubes in the region x=-50..50,y=-50..50,z=-50..50, how many cubes are on?

*/
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle22(arrayData);
      });
}

function readRawData(rawData){
    rawData = rawData.replace(/(\r\n|\n|\r)/gm, "\n");
    let stringInstructions = rawData.split("\n");
    let instructions = []
    stringInstructions.forEach(s =>{
        let instruction = [];
        let onPlusNumbers = s.split(" "); // on  +  x=-41..9,y=-7..43,z=-33..15
        instruction.push(onPlusNumbers[0]);
        let ranges = onPlusNumbers[1].split(","); // x=-41..9   +   y=-7..43  +  z=-33..15
        ranges.forEach(range =>{
          let nums = ((range.split("="))[1]).split("..");
          instruction.push( [ parseInt(nums[0]) , parseInt(nums[1]) ] );
        });
        instructions.push(instruction);    
    });
    return instructions;
}

function notInRange(m,M, min, max){
  return m>max || M<min;
}

function filterData(data, limit){
  console.log("filtering by " + limit);
  for(let i = 0; i< data.length; i++){
    let ins = data[i];
    if(
      notInRange(ins[1][0], ins[1][1],-limit,limit) ||
      notInRange(ins[2][0], ins[2][1],-limit,limit) || 
      notInRange(ins[3][0], ins[3][1],-limit,limit)
      ){
        // Completely out of boundaries
        data.splice(i, 1);
        i--;
      }
    // Once the extreme case is discarded, we can adjust to remain on the [-limit, limit] range

    if(ins[1][0] < -limit) ins[1][0] = -limit;
    if(ins[1][1] >  limit) ins[1][1] = limit;    
    if(ins[2][0] < -limit) ins[2][0] = -limit;
    if(ins[2][1] >  limit) ins[2][1] = limit;    
    if(ins[3][0] < -limit) ins[3][0] = -limit;
    if(ins[3][1] >  limit) ins[3][1] = limit;    
  }
}
function compareVector3(pos1, pos2){
  return (pos1[0]==pos2[0] && pos1[1]==pos2[1] && pos1[2]==pos2[2]);
}
function checkPointInPoints(p, points){
  for(let i = 0; i< points.length; i++){
    if(compareVector3(p, points[i])){
      return i;
    }
  }
  return false;
}
function addIfNew(point, array){
  let ix = checkPointInPoints(point,array);
  if(ix === false){
    array.push(point)
  }
}

function removeIfExists(point, array){
  let i = checkPointInPoints(point,array);
  if(i !== false){
    array.splice(i,1);
  }
}

function stringify(x,y,z){
  return ""+x+"|"+y+"|"+z;
}

function calculateLightsSingleInstruction(ins, lights){
  console.log(ins);
  for(let x = ins[1][0]; x<=ins[1][1]; x++){
    for(let y = ins[2][0]; y<=ins[2][1]; y++){
      for(let z = ins[3][0]; z<=ins[3][1]; z++){
        if(ins[0] == "on"){
          lights[stringify(x,y,z)] = true;
        }
        else{
          delete lights[stringify(x,y,z)];
        }      
      }      
    }
  }
}

function puzzle22(inputData){
    filterData(inputData, 50);
    //console.log(inputData);
    
    let lights = {};
    for(let i = 0; i< inputData.length; i++){
      calculateLightsSingleInstruction(inputData[i],lights);
      console.log(Object.keys(lights).length);
    }

    console.log("SOLUTION");
    console.log(Object.keys(lights).length);
}

//getData("day22_smallTest.txt");
//getData("day22_test.txt");
getData("day22_input.txt");
