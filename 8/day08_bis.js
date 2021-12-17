/*
--- Part Two ---
Through a little deduction, you should now be able to determine the remaining digits. 
Consider again the first example above:

acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf

After some careful analysis, the mapping between signal wires and segments only 
make sense in the following configuration:

 dddd
e    a
e    a
 ffff
g    b
g    b
 cccc

So, the unique signal patterns would correspond to the following digits:
----
ab: 1
abef: 4
abd: 7
abcdefg: 8

bcdef: 5
acdfg: 2
abcdf: 3

abcdef: 9 
bcdefg: 6
abcdeg: 0
----

acedgfb: 8
cdfbe: 5
gcdfa: 2
fbcad: 3
dab: 7
cefabd: 9
cdfgeb: 6
eafb: 4
cagedb: 0
ab: 1

Then, the four digits of the output value can be decoded:

cdfeb: 5
fcadb: 3
cdfeb: 5
cdbaf: 3

Therefore, the output value for this entry is 5353.
Following this same process for each entry in the second, 
larger example above, the output value of each entry can be determined:

fdgacbe cefdb cefbgd gcbe: 8394
fcgedb cgb dgebacf gc: 9781
cg cg fdcagb cbg: 1197
efabcd cedba gadfec cb: 9361
gecf egdcabf bgf bfgea: 4873
gebdcfa ecba ca fadegcb: 8418
cefg dcbef fcge gbcadfe: 4548
ed bcgafe cdgba cbgef: 1625
gbdfcae bgc cg cgb: 8717
fgae cfgab fg bagce: 4315

Adding all of the output values in this larger example produces 61229.
For each entry, determine all of the wire/segment connections and decode the four-digit output values. 
What do you get if you add up all of the output values?
*/
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle8(arrayData);
      });
}

function getTestData(){
    return ""+
    "be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe"+"\n"+
    "edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc"+"\n"+
    "fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg"+"\n"+
    "fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb"+"\n"+
    "aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea"+"\n"+
    "fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb"+"\n"+
    "dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe"+"\n"+
    "bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef"+"\n"+
    "egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb"+"\n"+
    "gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce"
    
    return ""+
    "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf"
}

function guessEasyNumbers(chars){
    switch(chars.length){
        case 2:
            return 1;
        case 4:
            return 4;
        case 3:
            return 7;
        case 7:
            return 8;
        default:
            return -1;
    }    
}

function sortAlphabets(text) {
    return text.split('').sort().join('');
};

/*
ab: 1
abef: 4
abd: 7
abcdefg: 8

bcdef: 5
acdfg: 2
abcdf: 3

abcdef: 9 
bcdefg: 6
abcdeg: 0
*/

function getFiveSegmentNumbers(wordArray){
    let res = [];
    wordArray.forEach(w => {
        if(w.length == 5)res.push(w);        
    });
    return res;
}

function getSixSegmentNumbers(wordArray){
    let res = [];
    wordArray.forEach(w => {
        if(w.length == 6)res.push(w);        
    });
    return res;
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

function getCables(signalArray){
    for(let i = 0; i< signalArray.length; i++){
        signalArray[i] = sortAlphabets(signalArray[i]);
    }
    
    // -------------- SET VARIABLES
    let numbers =[];
    let fiveSegCandidates = getFiveSegmentNumbers(signalArray);
    let sixSegCandidates = getSixSegmentNumbers(signalArray);
    for(let i=0; i<signalArray.length; i++){
        numbers.push(null);
    }


    // -------------- GET BASIC NUMBERS (1, 4, 7, 8)
    signalArray.forEach(word => {
        let number = guessEasyNumbers(word);
        if(number != -1) numbers[number] = word;  
    });

    // -------------- WE GET 9
    sixSegCandidates.forEach(word => {
        if(charsContained(word,numbers[4])){
            numbers[9] = word;                
        }
    });
    sixSegCandidates = removeItemOnce(sixSegCandidates,numbers[9]);

    // -------------- WE GET 3
    let fiveCorrespondences = [];
    fiveSegCandidates.forEach(word => {
        let nFours = 0;
        fiveSegCandidates.forEach(otherword => {
            let m = nCommonChars(word,otherword);
            if(m == 4)nFours++;
        });
        if(nFours ==2)numbers[3] = word;
    });
    fiveSegCandidates = removeItemOnce(fiveSegCandidates,numbers[3]);
    
    // -------------- WE GET 2 AND 5
    fiveSegCandidates.forEach(word => {
        if(charsContained(numbers[9],word))numbers[5] = word;
        else numbers[2] = word;
    });

    // -------------- WE GET 0 AND 6
    sixSegCandidates.forEach(word => {
        if(charsContained(word,numbers[5]))numbers[6] = word;
        else numbers[0] = word;
    });
    return numbers;
}

function charsContained(bigWord, smallWord){
    let matches = nCommonChars(bigWord,smallWord);
    let ret = (matches == smallWord.length);
    return ret;
}

function nCommonChars(word1, word2){
    let matches = 0;
    word1.split('').forEach(c=>{
        if(word2.includes(c)){
            matches++;
        }
    });
    return matches;
}

function decodeNumber(word, dic){
    let w = sortAlphabets(word);
    for(let i = 0; i< dic.length; i++){
        if(dic[i] == w) return i;
    }
    return -1;

}

function decodeOutput(output, dic){
    let sum = 0;
    for(let i = 0; i<output.length; i++){
        let n = decodeNumber(output[i], dic);
        if(n != -1){
            let pow = (output.length-i)-1;
            sum += n*(10**pow);
        }
    }
    return sum;
}


function puzzle8(inputData){
    //row[0] == cables
    //row[1] == result
    let sum = 0;
    

    inputData.forEach(row => {
        let dic = getCables(row[0]);
        let finalNumber = decodeOutput(row[1],dic);      
        console.log(finalNumber);
        sum += finalNumber;  
    });
    console.log("SOLUTION");
    console.log(sum)
}

function readRawData(rawData){
    let allRows=[];
    let tempSegmentArray = rawData.split("\n");
    tempSegmentArray.forEach(row => {
        let parts = row.split(" | ");
        let a = parts[0].split(" ");
        let b = parts[1].split(" ");
        allRows.push([a,b]);              
    });
    return allRows;
}

//puzzle8(readRawData(getTestData()));
getData("day08_input.txt");



