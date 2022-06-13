/*

--- Day 23: Amphipod ---
A group of amphipods notice your fancy submarine and flag you down. "With such an impressive shell," one amphipod says, "surely you can help us with a question that has stumped our best scientists."

They go on to explain that a group of timid, stubborn amphipods live in a nearby burrow. 
Four types of amphipods live there: Amber (A), Bronze (B), Copper (C), and Desert (D). 
They live in a burrow that consists of a hallway and four side rooms. 
The side rooms are initially full of amphipods, and the hallway is initially empty.

They give you a diagram of the situation (your puzzle input), including locations of each amphipod 
(A, B, C, or D, each of which is occupying an otherwise open space), walls (#), and open space (.).

For example:

#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########

The amphipods would like a method to organize every amphipod into side rooms so that each side room contains one type of 
amphipod and the types are sorted A-D going left to right, like this:

#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #########

Amphipods can move up, down, left, or right so long as they are moving into an unoccupied open space. 
Each type of amphipod requires a different amount of energy to move one step: 
Amber amphipods require 1 energy per step, 
Bronze amphipods require 10 energy, 
Copper amphipods require 100, and 
Desert ones require 1000. 

The amphipods would like you to find a way to organize the amphipods that requires the least total energy.

However, because they are timid and stubborn, the amphipods have some extra rules:

Amphipods will never stop on the space immediately outside any room. They can move into that space so long as they immediately continue moving. 
(Specifically, this refers to the four open spaces in the hallway that are directly above an amphipod starting position.)
Amphipods will never move from the hallway into a room unless that room is their destination room and that room contains no amphipods 
which do not also have that room as their own destination. If an amphipod's starting room is not its destination room, 
it can stay in that room until it leaves the room. (For example, an Amber amphipod will not move from the hallway into the right three rooms, 
and will only move into the leftmost room if that room is empty or if it only contains other Amber amphipods.)
Once an amphipod stops moving in the hallway, it will stay in that spot until it can move into a room. 
(That is, once any amphipod starts moving, any other amphipods currently in the hallway are locked in place and will not move again until they can move fully into a room.)
In the above example, the amphipods can be organized using a minimum of 12521 energy. One way to do this is shown below.

Starting configuration:

#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########
One Bronze amphipod moves into the hallway, taking 4 steps and using 40 energy:

#############
#...B.......#
###B#C#.#D###
  #A#D#C#A#
  #########
The only Copper amphipod not in its side room moves there, taking 4 steps and using 400 energy:

#############
#...B.......#
###B#.#C#D###
  #A#D#C#A#
  #########
A Desert amphipod moves out of the way, taking 3 steps and using 3000 energy, and then the Bronze amphipod takes its place, taking 3 steps and using 30 energy:

#############
#.....D.....#
###B#.#C#D###
  #A#B#C#A#
  #########
The leftmost Bronze amphipod moves to its room using 40 energy:

#############
#.....D.....#
###.#B#C#D###
  #A#B#C#A#
  #########
Both amphipods in the rightmost room move into the hallway, using 2003 energy in total:

#############
#.....D.D.A.#
###.#B#C#.###
  #A#B#C#.#
  #########
Both Desert amphipods move into the rightmost room using 7000 energy:

#############
#.........A.#
###.#B#C#D###
  #A#B#C#D#
  #########
Finally, the last Amber amphipod moves into its room, using 8 energy:

#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #########
What is the least energy required to organize the amphipods?

*/

var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle23(arrayData);
      });
}

function readRawData(rawData){
    rawData = rawData.replace(/(\r\n|\n|\r)/gm, "\n");
    let stringRows = rawData.split("\n");
    stringRows.pop();
    stringRows[stringRows.length-2] +="  "
    stringRows[stringRows.length-1] +="  "
    return stringRows;
}


AMPHIPODS = [];
ORIGINAL_AMPHIPODS = [];
A_HOME = [[2,3],[3,3]];
B_HOME = [[2,5],[3,5]];
C_HOME = [[2,7],[3,7]];
D_HOME = [[2,9],[3,9]];
HOMES = [A_HOME, B_HOME, C_HOME, D_HOME];
CANDIDATE_PATHS = [];
DISCARDED_PATHS = [];
/*PATHS = [
  [[IX_IN_AMPHIPODS,[ORIGIN],[DEST]]  , [IX_IN_AMPHIPODS,[ORIGIN],[DEST]] , ... ], 
  [ ... ]  
  //origin is last dest. For current status we only need to check last DEST
  [ ... ]
];*/

function getCost(type){
  return 10**type;
}

function isInHallway(coords){
  return(coords[0]==1)
}

function isAtHome(type, coords){
  return comparePositions(HOMES[type], coords);
}

function comparePositions(arr, c){
  let found = false;
  arr.forEach(cell => {
    if(cell[0] == c[0] && cell[1] == c[1])found = true;
  });
  return found;
}

function isEmpty(c){
  let occupied = false;
  AMPHIPODS.forEach(a => {
    if(a[1] == c[0] && a[2] == c[1])occupied = true;  
  });
  return !occupied;
}

function isHouseEmpty(type){
  let intruder = false;
  AMPHIPODS.forEach(a => {
    if(a[0]!=type && comparePositions(HOMES[type],[a[1],a[2]])) 
      intruder = true;    
  });
  return !intruder;

}

function typeToInt(charType){
  if(charType == "A")return 0;
  if(charType == "B")return 1;
  if(charType == "C")return 2;
  if(charType == "D")return 3;
}

function posibleHallwayDestinations(){
  return [1,2,4,6,8,10,11];
}

function reachableHallwayDestinations(coord){
  if(coord[0] > 2 && !isEmpty([2, coord[1]])){
    return [];
  } 
  let ops = posibleHallwayDestinations();
  AMPHIPODS.forEach(a=>{
    if(a[1]==1){
      if(a[2]<coord[1]){
        ops = ops.filter(item => (item > a[2]));
      }else{
        ops = ops.filter(item => (item < a[2]));
      }
    }
  });
  return ops;
}
function encodePath(pathArray){

}

function decodePath(path){

}

function getAllMoves(){
  let moves = [];
  count = -1;
  AMPHIPODS.forEach(a => {
    count++;
    if(isInHallway([a[1],a[2]])){
      // THEN ONLY OPTION IS TO GO HOME DIRECTLY ONLY IF POSSIBLE
      if(isHouseEmpty){
        // ONLY IF NOBODY IS ON THE WAY
        // MOVE TO BOTTOM OR IF OCCUPIED TOP OF HOME
      }      
    }
    else{//IT IS READY TO GO TO HALLWAY
      let ops = reachableHallwayDestinations([a[1],a[2]]);
      if(ops.length > 0){
        ops.forEach(op =>{
          moves.push([count,a[1],a[2], 1, op]);
        });        
      }
    }
  });
  return moves;
}
function allAmphipodsAtHome(){
  let atHome = true;
  AMPHIPODS.forEach(a => {
    atHome = atHome && a[3];     
  });
  return atHome;
}

function solve(){
  let moves = getAllMoves();
  // SORT BY COST AND STORE

  if(allAmphipodsAtHome())return true;
  else{
    //solve from here
  }
}

// [ TYPE, R, C, ATHOME, COST]
function getAmphipods(map, amphipodsArray){
  for(let r = 2; r < 4; r++){
    for(let c=3; c<10; c+=2){
      amphipodsArray.push([typeToInt((map[r])[c]), r, c, isAtHome(typeToInt((map[r])[c]),[r,c]), getCost(typeToInt((map[r])[c]))]);
    }
  }
}

function puzzle23(inputData){   
    console.log(inputData);
    getAmphipods(inputData, AMPHIPODS);
    getAmphipods(inputData, ORIGINAL_AMPHIPODS);
    console.log(AMPHIPODS);
    let paths = getAllMoves(AMPHIPODS);
    console.log("SOLUTION");
    console.log(paths);
}

getData("day23_test.txt");
//getData("day23_input.txt");
