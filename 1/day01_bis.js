/*

Considering every single measurement isn't as useful as you expected: there's just too much noise in the data.
Instead, consider sums of a three-measurement sliding window. Again considering the above example:

199  A      
200  A B    
208  A B C  
210    B C D
200  E   C D
207  E F   D
240  E F G  
269    F G H
260      G H
263        H
Start by comparing the first and second three-measurement windows. The measurements in the first window are marked A (199, 200, 208); their sum is 199 + 200 + 208 = 607. The second window is marked B (200, 208, 210); its sum is 618. The sum of measurements in the second window is larger than the sum of the first, so this first comparison increased.

Your goal now is to count the number of times the sum of measurements in this sliding window increases from the previous sum. So, compare A with B, then compare B with C, then C with D, and so on. Stop when there aren't enough measurements left to create a new three-measurement sum.

In the above example, the sum of each three-measurement window is as follows:

A: 607 (N/A - no previous sum)
B: 618 (increased)
C: 618 (no change)
D: 617 (decreased)
E: 647 (increased)
F: 716 (increased)
G: 769 (increased)
H: 792 (increased)
In this example, there are 5 sums that are larger than the previous sum.
Consider sums of a three-measurement sliding window. How many sums are larger than the previous sum?
*/
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = data.split("\n");
        finalData = []
        arrayData.forEach(function (e) {
            finalData.push(parseInt(e));
        });
        puzzle1_bis(finalData);
      });
}

function getTestData(){
    return [199,200,208,210,200,207,240,269,260,263];
}

/*function partialSum(){    
    return [607,618,618,617,647,716,769,792];
}*/

function puzzle1_bis(inputData){
    let sum = [];    
    for(let i=2;i<inputData.length; i++){
        sum.push(inputData[i-2]+inputData[i-1]+inputData[i]);
    }


    return(puzzle1(sum));
}

function puzzle1(inputData){
    let nIncrease = 0;
    if(inputData.length <= 1) return 0;
    for(let i=1;i<inputData.length; i++){
        if(inputData[i]>inputData[i-1])nIncrease++;
    }
    console.log(nIncrease);
}

puzzle1_bis(getTestData());
getData("day01_input.txt");

