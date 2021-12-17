/*
--- Part Two ---
On the other hand, it might be wise to try a different strategy: let the giant squid win.

You aren't sure how many bingo boards a giant squid could play at once, so rather than
waste time counting its arms, the safe thing to do is to figure out which board
will win last and choose that one. That way, no matter which boards it picks, it will win for sure.

In the above example, the second board is the last to win, which happens
after 13 is eventually called and its middle column is completely marked.
If you were to keep playing until this point, the second board would have 
a sum of unmarked numbers equal to 148 for a final score of 148 * 13 = 1924.

Figure out which board will win last. Once it wins, what would its final score be?
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
    let chosenBoard = null;
    let nBoards =boards.length;
    do {
        round++;
        console.log("-----")
        console.log(round);
        let tNums = numbers.slice(0,round);
        console.log(tNums);
        let badBoards = 0;
        boards.forEach(board => {
            let isWinner = checkWinnerBoard(board,tNums);
            if(!isWinner){
                console.log(board);
                badBoards++;
                chosenBoard = board;
            }
        });
        if(badBoards == 1)finished = true;        
    } while (!finished);
    round++;
    console.log("SOLUTION");    
    console.log(calculatePoints(chosenBoard,numbers.slice(0,round)));
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
    console.log(lastNumber);
    console.log(sum);
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

//puzzle4(readRawData(getTestData()));
getData("day04_input.txt");



