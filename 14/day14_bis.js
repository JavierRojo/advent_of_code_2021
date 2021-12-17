/*
--- Part Two ---
The resulting polymer isn't nearly strong enough to reinforce the submarine. You'll need to run more steps of the pair insertion process; a total of 40 steps should do it.

In the above example, the most common element is B (occurring 2192039569602 times) and the least common element is H (occurring 3849876073 times); subtracting these produces 2188189693529.

Apply 40 steps of pair insertion to the polymer template and find the most and least common elements in the result. What do you get if you take the quantity of the most common element and subtract the quantity of the least common element?
*/
const { Console } = require('console');
var fs = require('fs');

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
    let template = rawBlocks[0].split("");
    let rawInstructions = rawBlocks[1].split("\n");

    rawInstructions.forEach(row => {
        instructions.push(row.split(" -> "));
    });
    return [template,instructions];
}


function puzzle14(inputData){
    let nSteps = 40;
    let polymer = inputData[0];
    let instructions = CreateDictionnary(inputData[1]);
    let polymerPairs = CreatePairsDictionnary(inputData[1]);
    let letterCount = CreateLettersDictionnary(instructions);
    FillLetterDictionnary(letterCount,polymer);
    FillPairDictionnary(polymerPairs,polymer);
    for(let i = 0; i< nSteps; i++){
        console.log("step " +(i+1));
        let info = Step(polymerPairs, letterCount, instructions);
        letterCount = info[0];
        polymerPairs = info[1];
    }
    console.log("SOLUTION");
    console.log(letterCount);
    console.log(getPoints(letterCount));
}

function Step(polymerPairs, letterCount, instructions){
    let nextDic = {};
    Object.assign(nextDic, polymerPairs);
    let pairs = Object.keys(polymerPairs);
    for(let i = 0; i < pairs.length ; i++){
        let pair = pairs[i];
        let n = polymerPairs[pair];
        if( n > 0 ){        
            //quitar vieja pareja y añadir 2 parejas [0]new y new[1] si es que está en las instrucciones
            let newChar = instructions[pair]
            let newPair1 = pair[0]+newChar;
            let newPair2 = newChar+pair[1];
            letterCount[newChar]+=n;
            nextDic[pair] -= n;
            nextDic[newPair1] += n;
            nextDic[newPair2] += n;
        }        
    }    
    return [letterCount, nextDic];
}

function getPoints(countDict){    
    let mostOccur = 0;
    let leastOccur = 99999999999999999;
    let letters = Object.keys(countDict);
    for(let i=0; i<letters.length; i++){
        let n = countDict[letters[i]]
        if(n>mostOccur) mostOccur = n;
        if(n<leastOccur) leastOccur = n;
    }
    return(mostOccur-leastOccur);
}


function FillLetterDictionnary(dic,polymer){
    polymer.forEach((letter)=>{
        dic[letter]++;
    });
    return dic;
}

function CreateLettersDictionnary(instructionsArray){
    let dic = {}
    let pairs = Object.keys(instructionsArray);
    pairs.forEach((pair)=>{
        dic[pair[0]]=0;
        dic[pair[1]]=0;
        dic[instructionsArray[pair]]=0;
    });
    return dic;
}

function CreatePairsDictionnary(instructionsArray){
    let dic = {}
    instructionsArray.forEach((ins)=>{
        dic[ins[0]] = 0;
    });
    return dic;
}

function FillPairDictionnary(dic,polymer){
    for(let i = 1; i < polymer.length; i++){
        dic[polymer[i-1]+polymer[i]]++;
    }
}

function CreateDictionnary(instructionsArray){
    let dic = {}
    instructionsArray.forEach((ins)=>{
        dic[ins[0]] = ins[1];
    });
    return dic;
}


//puzzle14(readRawData(getTestData()));
getData("day14_input.txt");
