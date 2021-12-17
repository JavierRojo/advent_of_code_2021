/*
--- Part Two ---
The crabs don't seem interested in your proposed solution. 
Perhaps you misunderstand crab engineering?

As it turns out, crab submarine engines don't burn fuel at a constant rate. 
Instead, each change of 1 step in horizontal position costs 1 more unit of fuel 
than the last: the first step costs 1, the second step costs 2, the third step costs 3, and so on.

As each crab moves, moving further becomes more expensive. 
This changes the best horizontal position to align them all on; in the example above, this becomes 5:

Move from 16 to 5: 66 fuel
Move from 1 to 5: 10 fuel
Move from 2 to 5: 6 fuel
Move from 0 to 5: 15 fuel
Move from 4 to 5: 1 fuel
Move from 2 to 5: 6 fuel
Move from 7 to 5: 3 fuel
Move from 1 to 5: 10 fuel
Move from 2 to 5: 6 fuel
Move from 14 to 5: 45 fuel

This costs a total of 168 fuel. This is the new cheapest possible outcome; 
the old alignment position (2) now costs 206 fuel instead.

Determine the horizontal position that the crabs can align to using the least fuel possible 
so they can make you an escape route! How much fuel must they spend to align to that position?
*/
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle6(arrayData,80);
      });
}

function getTestData(){
    return "16,1,2,0,4,2,7,1,2,14";
}

function getDistance(n1,n2){
    let diff = Math.abs(n1-n2);
    let res = 0;
    for(let i = 1; i <= diff; i++){
        res+=i;
    }
    return res;
}

function getDistancesToPoint(point, array){
    let distances = [];
    array.forEach(element => {
        distances.push(getDistance(element,point));        
    });
    return distances;
}

function addArray(array){
    let sum = 0;
    array.forEach(element => {
        sum+=element;        
    });
    return sum;
}
function getMinMax(array){
    let min = 99999999999999999999999;
    let max = -99999999999999999999999;

    array.forEach(element => {
        min = Math.min(min, element);    
        max = Math.max(max, element);       
    });
    return [min,max];
}

function puzzle6(inputData){
    let size = getMinMax(inputData);
    let solutions = [];
    for(let i=size[0];i<=size[1];i++){
        let dists = getDistancesToPoint(i, inputData);
        solutions.push(addArray(dists));
        console.log("aligned at "+i+": "+ addArray(dists));
    }
    console.log("SOLUTION");
    let minimum = getMinMax(solutions)[0];
    let pos = solutions.findIndex((element) => element == minimum);
    console.log("aligned at "+pos+": "+minimum);
}

function readRawData(rawData){
    let allCrabs=[];
    let tempSegmentArray = rawData.split(",");
    tempSegmentArray.forEach(n => {        
        allCrabs.push(parseInt(n));              
    });
    return allCrabs;
}

//puzzle6(readRawData(getTestData()));
getData("day07_input.txt");



