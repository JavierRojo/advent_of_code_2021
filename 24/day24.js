/*
--- Day 24: Arithmetic Logic Unit ---
Magic smoke starts leaking from the submarine's arithmetic logic unit (ALU). 
Without the ability to perform basic arithmetic and logic functions, the submarine can't produce cool patterns with its Christmas lights!
It also can't navigate. Or run the oxygen system. Don't worry, though - you probably have enough oxygen left to give you enough time to build a new ALU.

The ALU is a four-dimensional processing unit: it has integer variables w, x, y, and z. 
These variables all start with the value 0. The ALU also supports six instructions:

inp a - Read an input value and write it to variable a.
add a b - Add the value of a to the value of b, then store the result in variable a.
mul a b - Multiply the value of a by the value of b, then store the result in variable a.
div a b - Divide the value of a by the value of b, truncate the result to an integer, then store the result in variable a. 
          (Here, "truncate" means to round the value toward zero.)
mod a b - Divide the value of a by the value of b, then store the remainder in variable a. 
          (This is also called the modulo operation.)
eql a b - If the value of a and b are equal, then store the value 1 in variable a. Otherwise, store the value 0 in variable a.

In all of these instructions, a and b are placeholders; 
a will always be the variable where the result of the operation is stored (one of w, x, y, or z), 
while b can be either a variable or a number. 
Numbers can be positive or negative, but will always be integers.


The ALU has no jump instructions; in an ALU program, every instruction is run exactly once in order from top to bottom. 
The program halts after the last instruction has finished executing.

(Program authors should be especially cautious; attempting to execute div with b=0 or attempting to execute mod with a<0 or b<=0 will cause 
  the program to crash and might even damage the ALU. These operations are never intended in any serious ALU program.)

For example, here is an ALU program which takes an input number, negates it, and stores it in x:

inp x
mul x -1
Here is an ALU program which takes two input numbers, then sets z to 1 if the second input number 
is three times larger than the first input number, or sets z to 0 otherwise:

inp z
inp x
mul z 3
eql z x
Here is an ALU program which takes a non-negative integer as input, converts it into binary, 
and stores the lowest (1's) bit in z, the second-lowest (2's) bit in y, the third-lowest (4's) bit in x, 
and the fourth-lowest (8's) bit in w:

inp w
add z w
mod z 2
div w 2
add y w
mod y 2
div w 2
add x w
mod x 2
div w 2
mod w 2
Once you have built a replacement ALU, you can install it in the submarine, which will immediately resume 
what it was doing when the ALU failed: validating the submarine's model number. 
To do this, the ALU will run the MOdel Number Automatic Detector program (MONAD, your puzzle input).

Submarine model numbers are always fourteen-digit numbers consisting only of digits 1 through 9. 
The digit 0 cannot appear in a model number.

When MONAD checks a hypothetical fourteen-digit model number, it uses fourteen separate inp instructions, 
each expecting a single digit of the model number in order of most to least significant. 
(So, to check the model number 13579246899999, you would give 1 to the first inp instruction, 3 to the second inp instruction, 
  5 to the third inp instruction, and so on.) This means that when operating MONAD, each input instruction should only ever 
  be given an integer value of at least 1 and at most 9.

Then, after MONAD has finished running all of its instructions, it will indicate that the model number was valid by 
leaving a 0 in variable z. However, if the model number was invalid, it will leave some other non-zero value in z.

MONAD imposes additional, mysterious restrictions on model numbers, and legend says the last copy of the 
MONAD documentation was eaten by a tanuki. You'll need to figure out what MONAD does some other way.

To enable as many submarine features as possible, find the largest valid fourteen-digit model number 
that contains no 0 digits. What is the largest model number accepted by MONAD?

*/


/*
IMPORTANT NOTE: Input has loops of 18 instructions with small variations:
    inp w         >> reading the digit [1-9]
    mul x 0       >> x goes to zero (independent from previous loop)
    add x z       >> x = z0
    mod x 26      >> x = z0%26
    div z [D1]    >> z = z/[D1]
    add x [A1]    >> x = (z0%26) + [A1]
    eql x w       >> ((z0%26) + [A1]) == w -> 1 or 0
    eql x 0       >> if (((z0%26) + [A1]) == w) -> x=0
    mul y 0       >> y goes to zero (independent from previous loop)
    add y 25      >> y=25
    mul y x       >> y = 25 or 0
    add y 1       >> y = 26 or 1
    mul z y       >> z = z*(26 or 1)
    mul y 0       >> y goes to zero
    add y w       >> y = w
    add y [A2]    >> y = w + [A2]
    mul y x       >> y = x* (w + [A2]) -> x is 1 or 0!
    add z y       >> z = z+y

*/

const { debug, Console } = require('console');
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle24(arrayData);
      });
}

function readRawData(rawData){
    rawData = rawData.replace(/(\r\n|\n|\r)/gm, "\n");
    let stringInstructions = rawData.split("\n");
    return stringInstructions;
}
// --- //

function splitInstructions(mergedInstructions){
  let instructions = [];
  let nInstructions = mergedInstructions.length/14;
  for (let i = 0; i < 14; i++) {
    instructions.push(mergedInstructions.slice(nInstructions*i,nInstructions*(i+1)));    
  }
  return instructions;
}

function getParams(instructions){
  let paramIns = [];
  instructions.forEach(instructionSet => {
    let D1 = parseInt((instructionSet[4].split(" "))[2]);
    let A1 = parseInt((instructionSet[5].split(" "))[2]);
    let A2 = parseInt((instructionSet[15].split(" "))[2]);
    paramIns.push([D1,A1,A2]);
  });
  return paramIns;
}

function getDs(ins){
  let relations = [];
  let buffer = [];
  let currentD1Ix = 0;
  for(let i = 0; i<7; i++){
    relations.push([0,0]);
  }
  let count = 0;
  ins.forEach(i => {
    if(i[0] == 1){
      buffer.push(currentD1Ix);
      relations[currentD1Ix][0] = count;
      currentD1Ix++;
    }else{
      let ix = buffer.pop();
      relations[ix][1] = count;
    }
    count++;    
  });
  return relations;
}

function addValueToRelations(rels, ins){
  rels.forEach(r => {
    let w0 = r[0];
    let w1 = r[1];
    r.push(ins[w0][2] + ins[w1][1]);    
  });
  return rels;
}

function allPositives(rels){
  rels.forEach(r => {
    if(r[2] <0){
      let r0 = r[0];
      let r1 = r[1];
      let r2 = r[2];
      r[0] = r1;
      r[1] = r0;
      r[2] = -r2;
    }   
  });
  return rels;

}

function step(w,z0,params){
  let x0 = (params[1]+(z0%26)) != w? 1 : 0;
  let y0 = 25*x0 + 1;
  let z1 = Math.floor(z0/params[0])*y0;
  let z2 = z1 + ( (w*params[2]) * x0);
  return z2;
}


function puzzle24(inputData){
    let instructions = splitInstructions(inputData);
    let paramInstructions = getParams(instructions);
    console.log(paramInstructions);
    let rels = getDs(paramInstructions);
    console.log(rels);
    let relsAdd = addValueToRelations(rels, paramInstructions);
    console.log(relsAdd);
    let relsAddPos = allPositives(relsAdd);
    console.log(relsAddPos);

    // FIND MAYOR COMBINATION: r[1] = 9, all of them > calculate r[0] = r[1]-r[2]
    let ws = [];
    for(let i=0;i<14;i++){
      ws.push(0);
    }
    for(let i = 0; i<7; i++){
      ws[relsAddPos[i][1]] = 9;
      ws[relsAddPos[i][0]] = 9 - relsAddPos[i][2];
    }
    
    // FIND MINOR COMBINATION: r[0] = 1, all of them > calculate r[1] = r[0]+r[2]et ws = [];
    let ws2 = [];
    for(let i=0;i<14;i++){
      ws2.push(0);
    }
    for(let i = 0; i<7; i++){
      ws2[relsAddPos[i][0]] = 1;
      ws2[relsAddPos[i][1]] = 1 + relsAddPos[i][2];
    }
  
    console.log("SOLUTION");
    console.log(ws);
    console.log(ws2);
}


//getData("day24_pretest.txt");
//getData("day24_test.txt");
getData("day24_input.txt");
