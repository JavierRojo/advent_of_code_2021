/*

Initial state: 3,4,3,1,2
After  1 day:  2,3,2,0,1
After  2 days: 1,2,1,6,0,8
After  3 days: 0,1,0,5,6,7,8
After  4 days: 6,0,6,4,5,6,7,8,8
After  5 days: 5,6,5,3,4,5,6,7,7,8
After  6 days: 4,5,4,2,3,4,5,6,6,7
After  7 days: 3,4,3,1,2,3,4,5,5,6
After  8 days: 2,3,2,0,1,2,3,4,4,5
After  9 days: 1,2,1,6,0,1,2,3,3,4,8
After 10 days: 0,1,0,5,6,0,1,2,2,3,7,8
After 11 days: 6,0,6,4,5,6,0,1,1,2,6,7,8,8,8
After 12 days: 5,6,5,3,4,5,6,0,0,1,5,6,7,7,7,8,8
After 13 days: 4,5,4,2,3,4,5,6,6,0,4,5,6,6,6,7,7,8,8
After 14 days: 3,4,3,1,2,3,4,5,5,6,3,4,5,5,5,6,6,7,7,8
After 15 days: 2,3,2,0,1,2,3,4,4,5,2,3,4,4,4,5,5,6,6,7
After 16 days: 1,2,1,6,0,1,2,3,3,4,1,2,3,3,3,4,4,5,5,6,8
After 17 days: 0,1,0,5,6,0,1,2,2,3,0,1,2,2,2,3,3,4,4,5,7,8
After 18 days: 6,0,6,4,5,6,0,1,1,2,6,0,1,1,1,2,2,3,3,4,6,7,8,8,8,8

--- Part Two ---
Suppose the lanternfish live forever and have unlimited food and space. Would they take over the entire ocean?
After 256 days in the example above, there would be a total of 26984457539 lanternfish!
How many lanternfish would there be after 256 days?
*/
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle6(arrayData,256);
      });
}


function getTestData(){
    return "3,4,3,1,2";
}

function getNumber(dic){
    let sum = 0;
    dic.forEach(e => {
        sum += e;        
    });
    return sum;
}

function tick(dic){
    let news = dic[0];
    dic[0] = dic[1];
    dic[1] = dic[2];
    dic[2] = dic[3];
    dic[3] = dic[4];
    dic[4] = dic[5];
    dic[5] = dic[6];
    dic[6] = dic[7] + news;
    dic[7] = dic[8];
    dic[8] = news;
    
}

function puzzle6(inputData,nGenerations){
    let dic = [0,0,0,0,0,0,0,0,0];

    inputData.forEach(d => {
        dic[d]++;        
    });

    for(let generation = 0; generation<nGenerations; generation++){
        console.log("Generation "+ generation);
        //console.log(dic);
        tick(dic);
    }
    console.log("SOLUTION");
    console.log("Generation " + nGenerations);
    console.log(getNumber(dic));
}


function readRawData(rawData){
    let allFishes=[];
    let tempSegmentArray = rawData.split(",");
    tempSegmentArray.forEach(n => {        
        allFishes.push(parseInt(n));              
    });
    return allFishes;
}

//puzzle6(readRawData(getTestData()),256);
getData("day06_input.txt");



