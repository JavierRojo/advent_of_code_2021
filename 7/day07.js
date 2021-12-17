/*
--- Day 7: The Treachery of Whales ---
A giant whale has decided your submarine is its next meal, 
and it's much faster than you are. There's nowhere to run!

Suddenly, a swarm of crabs (each in its own tiny submarine - it's too deep for them otherwise) 
zooms in to rescue you! They seem to be preparing to blast a hole in the ocean floor; 
sensors indicate a massive underground cave system just beyond where they're aiming!

The crab submarines all need to be aligned before they'll have enough power to blast a 
large enough hole for your submarine to get through. However, it doesn't look 
like they'll be aligned before the whale catches you! Maybe you can help?

There's one major catch - crab submarines can only move horizontally.

You quickly make a list of the horizontal position of each crab (your puzzle input). 
Crab submarines have limited fuel, so you need to find a way to make all of their 
horizontal positions match while requiring them to spend as little fuel as possible.

For example, consider the following horizontal positions:
16,1,2,0,4,2,7,1,2,14
This means there's a crab with horizontal position 16, a crab with horizontal position 1, and so on.

Each change of 1 step in horizontal position of a single crab costs 1 fuel. 
You could choose any horizontal position to align them all on, 
but the one that costs the least fuel is horizontal position 2:

Move from 16 to 2: 14 fuel
Move from 1 to 2: 1 fuel
Move from 2 to 2: 0 fuel
Move from 0 to 2: 2 fuel
Move from 4 to 2: 2 fuel
Move from 2 to 2: 0 fuel
Move from 7 to 2: 5 fuel
Move from 1 to 2: 1 fuel
Move from 2 to 2: 0 fuel
Move from 14 to 2: 12 fuel

This costs a total of 37 fuel. This is the cheapest possible outcome; more expensive outcomes 
include aligning at position 1 (41 fuel), position 3 (39 fuel), or position 10 (71 fuel).

Determine the horizontal position that the crabs can align to using the least fuel possible. 
How much fuel must they spend to align to that position?
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

function getDistancesToPoint(point, array){
    let distances = [];
    array.forEach(element => {
        distances.push(Math.abs(element-point));        
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



