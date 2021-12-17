/*
You're already almost 1.5km (almost a mile) below the surface of the ocean, already so deep that you can't see any sunlight. What you can see, however, is a giant squid that has attached itself to the outside of your submarine.

Maybe it wants to play bingo?

Bingo is played on a set of boards each consisting of a 5x5 grid of numbers. Numbers are chosen at random, and the chosen number is marked on all boards on which it appears. (Numbers may not appear on all boards.) If all numbers in any row or any column of a board are marked, that board wins. (Diagonals don't count.)

The submarine has a bingo subsystem to help passengers (currently, you and the giant squid) pass the time. It automatically generates a random order in which to draw numbers and a random set of boards (your puzzle input). For example:

7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
After the first five numbers are drawn (7, 4, 9, 5, and 11), there are no winners, but the boards are marked as follows

After the next six numbers are drawn (17, 23, 2, 0, 14, and 21), there are still no winners:

Finally, 24 is drawn:
14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7

At this point, the third board wins because it has at least one complete row or column of marked numbers (in this case, the entire top row is marked: 14 21 17 24 4).

The score of the winning board can now be calculated. Start by finding the sum of all unmarked numbers on that board; in this case, the sum is 188. Then, multiply that sum by the number that was just called when the board won, 24, to get the final score, 188 * 24 = 4512.

To guarantee victory against the giant squid, figure out which board will win first. What will your final score be if you choose that board?
*/


const { create } = require('domain');
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle4(arrayData);
      });
}

function getTestData(){
    return "7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1\n"+
    "\n"+
    "22 13 17 11  0\n"+
    " 8  2 23  4 24\n"+
    "21  9 14 16  7\n"+
    " 6 10  3 18  5\n"+
    " 1 12 20 15 19\n"+
    "\n"+
    " 3 15  0  2 22\n"+
    " 9 18 13 17  5\n"+
    "19  8  7 25 23\n"+
    "20 11 10 24  4\n"+
    "14 21 16 12  6\n"+
    "\n"+
    "14 21 17 24  4\n"+
    "10 16 15  9 19\n"+
    "18  8 23 26 20\n"+
    "22 11 13  6  5\n"+
    " 2  0 12  3  7"
}


function puzzle4(inputData){   
    numbers = inputData[0];
    boards = inputData[1];
    let round = 0;
    let finished = false;
    let winnerBoard = null;
    do {
        round++;
        let tNums = numbers.slice(0,round);
        boards.forEach(board => {
            let isWinner = checkWinnerBoard(board,tNums);
            if(isWinner){
                finished = true; 
                winnerBoard = board;
            }
        });
        
    } while (!finished);
    console.log("SOLUTION");    
    console.log(calculatePoints(winnerBoard,numbers.slice(0,round)));
}
function calculatePoints(board, numbers){
    let lastNumber = numbers[numbers.length-1];
    let sum =0;
    for(let row = 0; row<5; row++){
        for(let col = 0; col<5; col++){
            if(!numbers.includes(board[row][col])){
                sum+=board[row][col];
            }
        }
    }
    return lastNumber*sum;
}

function checkWinnerBoard(board,numbers){
    let x = [0,0,0,0,0];
    let y = [0,0,0,0,0];
    for(let row = 0; row<5; row++){
        for(let col = 0; col<5; col++){
            if(numbers.includes(board[row][col])){
                x[col]++;
                y[row]++;
            }
        }
    }
    if (x.includes(5) || y.includes(5)){
        return true;
    }
    else return false;
}

function readRawData(rawData){
    let numbers=[];
    let boards=[];
    let tempArray = rawData.split("\n\n");
    numbers = tempArray[0].split(",");
    let finalNumbers = [];
    numbers.forEach(element => {
        finalNumbers.push(parseInt(element));        
    });
    let n = tempArray.length;
    for(let i=1; i<n; i++){
        boards.push(createMatrix(tempArray[i]));
    }
    return [finalNumbers,boards];
}

function createMatrix(text){
    let rows = text.split("\n");
    let numericalRows = [];
    rows.forEach(r => {
        let parts = r.split(" ");
        let numericalParts=[];
        parts.forEach(p => {
            if(p=="" || p==null){

            }else numericalParts.push(parseInt(p));            
        });
        numericalRows.push(numericalParts);
    });
    return numericalRows;
}

puzzle4(readRawData(getTestData()));
getData("day04_input.txt");



