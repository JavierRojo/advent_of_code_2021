/*
--- Day 14: Extended Polymerization ---
The incredible pressures at this depth are starting to put a strain on your submarine. 
The submarine has polymerization equipment that would produce suitable materials to reinforce 
the submarine, and the nearby volcanically-active caves should even have the necessary 
input elements in sufficient quantities.

The submarine manual contains instructions for finding the optimal polymer formula; 
specifically, it offers a polymer template and a list of pair insertion rules (your puzzle input). 
You just need to work out what polymer would result after repeating the pair insertion process a few times.

For example:

NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
The first line is the polymer template - this is the starting point of the process.

The following section defines the pair insertion rules. A rule like AB -> C means that 
when elements A and B are immediately adjacent, element C should be inserted between them. 
These insertions all happen simultaneously.

So, starting with the polymer template NNCB, the first step simultaneously considers all three pairs:

The first pair (NN) matches the rule NN -> C, so element C is inserted between the first N and the second N.
The second pair (NC) matches the rule NC -> B, so element B is inserted between the N and the C.
The third pair (CB) matches the rule CB -> H, so element H is inserted between the C and the B.
Note that these pairs overlap: the second element of one pair is the first element of the next pair. 
Also, because all pairs are considered simultaneously, inserted elements are not considered to be part of a pair until the next step.

After the first step of this process, the polymer becomes NCNBCHB.

Here are the results of a few steps using the above rules:

Template:     NNCB
After step 1: NCNBCHB
After step 2: NBCCNBBBCBHCB
After step 3: NBBBCNCCNBBNBNBBCHBHHBCHB
After step 4: NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB
This polymer grows quickly. After step 5, it has length 97; After step 10, it has length 3073. 
After step 10, B occurs 1749 times, C occurs 298 times, H occurs 161 times, and N occurs 865 times; 
taking the quantity of the most common element (B, 1749) and subtracting the quantity 
of the least common element (H, 161) produces 1749 - 161 = 1588.

Apply 10 steps of pair insertion to the polymer template and find the most and least common elements 
in the result. What do you get if you take the quantity of the most common element 
and subtract the quantity of the least common element?

*/
var fs = require('fs');
const { get } = require('http');

function getTestData(){
    return ""+
    "NNCB"+"\n\n"+
    "CH -> B"+"\n"+
    "HH -> N"+"\n"+
    "CB -> H"+"\n"+
    "NH -> C"+"\n"+
    "HB -> C"+"\n"+
    "HC -> B"+"\n"+
    "HN -> C"+"\n"+
    "NN -> C"+"\n"+
    "BH -> H"+"\n"+
    "NC -> B"+"\n"+
    "NB -> B"+"\n"+
    "BN -> B"+"\n"+
    "BB -> N"+"\n"+
    "BC -> B"+"\n"+
    "CC -> N"+"\n"+
    "CN -> C"
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

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle14(arrayData);
      });
}

function readRawData(rawData){
    let instructions = [];
    let rawBlocks = rawData.split("\n\n");
    let template = rawBlocks[0];//.split("");
    let rawInstructions = rawBlocks[1].split("\n");

    rawInstructions.forEach(row => {
        instructions.push(row.split(" -> "));
    });
    return [template,instructions];
}


function puzzle14(inputData){    
    let nSteps = 10;
    let polymer = inputData[0];
    let instructions = inputData[1];
    for(let i = 0; i< nSteps; i++){
        polymer = step(polymer, instructions);
    }
    console.log("SOLUTION");
    console.log(getPoints(polymer));
}

function findUnique(str){
    // The variable that contains the unique values
    let uniq = "";
     
    for(let i = 0; i < str.length; i++){
      // Checking if the uniq contains the character
      if(uniq.includes(str[i]) === false){
        // If the character not present in uniq
        // Concatenate the character with uniq
        uniq += str[i]
      }
    }
    return uniq;
 }


function countChars(char, str){
    return (str.split(char).length-1);

}

function getPoints(polymer){
    let uniqueElements = findUnique(polymer);
    let points = [];
    for(let i=0; i<uniqueElements.length; i++){
        points.push([uniqueElements[i],countChars(uniqueElements[i], polymer)]);
    };
    let mostOccur = points[0];
    let leastOccur = points[0];
    points.forEach(p => {
        if(p[1]>mostOccur[1]){
            mostOccur = p;
        }
        if(p[1]<leastOccur[1]){
            leastOccur = p;
        }        
    });

    return(mostOccur[1]-leastOccur[1]);

}

function step(initialPoly, instructions){
    let newPoly = "";
    let toBeAdded = [];

    // Recorrer el polímero inicial
    for(let i = 1; i < initialPoly.length; i++){
        instructions.forEach((ins)=>{
            if(initialPoly[i-1]+initialPoly[i] == ins[0]){
                // IT IS A MATCH!
                // Si coincide con una instruccion, anotar el índice y el caracter a insertar
                toBeAdded.push([i,ins[1]]);
            }
        });
    }
    let pointer = 0; //puntero al elemento de la lista toBeAdded que queremos considerar  
    // Elaboramos una vez recorridos todos el nuevo polímero, con cuidado de los índices.


    for(let i = 0; i< initialPoly.length; i++){
        if(toBeAdded[pointer] && toBeAdded[pointer][0] == i){
            newPoly += toBeAdded[pointer][1]
            pointer++
            i--;
        }
        else{
            newPoly += initialPoly[i];
        }
    }
    return newPoly;
}

//puzzle14(readRawData(getTestData()));
getData("day14_input.txt");
