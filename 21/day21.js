/*

--- Day 21: Dirac Dice ---
There's not much to do as you slowly descend to the bottom of the ocean. 
The submarine computer challenges you to a nice game of Dirac Dice.
This game consists of a single die, two pawns, and a game board with a circular track containing 
ten spaces marked 1 through 10 clockwise. Each player's starting space is chosen randomly (your puzzle input).

Player 1 goes first. Players take turns moving. On each player's turn, the player rolls the die three times and adds up the results. 
Then, the player moves their pawn that many times forward around the track (that is, moving clockwise 
on spaces in order of increasing value, wrapping back around to 1 after 10). So, if a player is on 
space 7 and they roll 2, 2, and 1, they would move forward 5 times, to spaces 8, 9, 10, 1, and finally stopping on 2.
After each player moves, they increase their score by the value of the space their pawn stopped on. 
Players' scores start at 0. So, if the first player starts on space 7 and rolls a total of 5, 
they would stop on space 2 and add 2 to their score (for a total score of 2). 
The game immediately ends as a win for any player whose score reaches at least 1000.

Since the first game is a practice game, the submarine opens a compartment labeled deterministic 
dice and a 100-sided die falls out. This die always rolls 1 first, then 2, then 3, and so on up to 100, 
after which it starts over at 1 again. Play using this die.

For example, given these starting positions:

Player 1 starting position: 4
Player 2 starting position: 8
This is how the game would go:

Player 1 rolls 1+2+3 and moves to space 10 for a total score of 10.
Player 2 rolls 4+5+6 and moves to space 3 for a total score of 3.
Player 1 rolls 7+8+9 and moves to space 4 for a total score of 14.
Player 2 rolls 10+11+12 and moves to space 6 for a total score of 9.
Player 1 rolls 13+14+15 and moves to space 6 for a total score of 20.
Player 2 rolls 16+17+18 and moves to space 7 for a total score of 16.
Player 1 rolls 19+20+21 and moves to space 6 for a total score of 26.
Player 2 rolls 22+23+24 and moves to space 6 for a total score of 22.
...after many turns...

Player 2 rolls 82+83+84 and moves to space 6 for a total score of 742.
Player 1 rolls 85+86+87 and moves to space 4 for a total score of 990.
Player 2 rolls 88+89+90 and moves to space 3 for a total score of 745.
Player 1 rolls 91+92+93 and moves to space 10 for a final score, 1000.

Since player 1 has at least 1000 points, player 1 wins and the game ends. 
At this point, the losing player had 745 points and the die had been rolled a total of 993 times; 745 * 993 = 739785.

Play a practice game using the deterministic 100-sided die. The moment either player wins, 
what do you get if you multiply the score of the losing player by the number of times the die was rolled during the game?

*/
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle21(arrayData);
      });
}

function readRawData(rawData){
    rawData = rawData.replace(/(\r\n|\n|\r)/gm, "\n");
    let stringPlayers = rawData.split("\n");
    let players = []
    stringPlayers.forEach(s =>{
        let SDataString = s.split(": ");
        players.push(parseInt(SDataString[1]));        
    });
    return players;
}

class Die{
  constructor(v = 0){
    this.value = v;
    this.nRolls = 0;
  }
  roll(){
    let roll = this.nextValue() + this.nextValue() + this.nextValue(); // a + (a+1) + (a+2)
    //console.log(roll);
    return roll;
  }
  nextValue(){
    this.nRolls++;
    this.value = moduleNoZero(this.value+1,100);
    return this.value;
  }
}

function moduleNoZero (n,mod){
  return (n%mod == 0)? mod : n%mod;
}

function puzzle21(inputData){
    let points = [0,0];
    let cells = inputData;    
    let die = new Die(0);

    let roll;
    let module = 10;
    let limitPoints = 1000;

    do{
      // PLAYER 1
      roll = die.roll();
      //console.log(cells[0] + "___"+roll)
      let sumP1 = cells[0]+roll;
      cells[0] = moduleNoZero(sumP1, module);
      points[0] += cells[0];

      if(!(points[0] < limitPoints && points[1] < limitPoints) ) break;
      
      // PLAYER 2
      roll = die.roll();
      let sumP2 = cells[1]+roll;
      cells[1] = moduleNoZero(sumP2, module);
      points[1] += cells[1];
      
    }while(points[0] < limitPoints && points[1] < limitPoints);

    
    console.log("SOLUTION");
    console.log(points);
    console.log(Math.min(...points)*die.nRolls)
}

//getData("day21_test.txt");
getData("day21_input.txt");
