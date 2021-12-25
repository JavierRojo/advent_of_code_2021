/*
--- Part Two ---
Now that you're warmed up, it's time to play the real game.

A second compartment opens, this time labeled Dirac dice. Out of it falls a single three-sided die.

As you experiment with the die, you feel a little strange. An informational brochure in the compartment explains that this is a quantum die: when you roll it, the universe splits into multiple copies, one copy for each possible outcome of the die. In this case, rolling the die always splits the universe into three copies: one where the outcome of the roll was 1, one where it was 2, and one where it was 3.

The game is played the same as before, although to prevent things from getting too far out of hand, the game now ends when either player's score reaches at least 21.

Using the same starting positions as in the example above, player 1 wins in 444356092776315 universes, while player 2 merely wins in 341960390180808 universes.

Using your given starting positions, determine every possible outcome. Find the player that wins in more universes; in how many universes does that player win?
*/
const { Console } = require('console');
const exp = require('constants');
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

function moduleNoZero (n,mod){
  return (n%mod == 0)? mod : n%mod;
}


function exploreUniverse(playerIx, initialCells, initialPoints){
  // GAME HAS NOT ENDED. WE CONTINUE
  // WE FOCUS ON TURN, SO 3**3 COMBINATIONS = 27
  let wins = [0,0];
  //console.log(initialCells);
  //console.log(initialPoints);
  for(let i = 0; i< combinations.length; i++){
        // FOR EACH NEW UNIVERSE GENERATED DUE TO THIS TURN (HALF ROUND)
        let cells = [...initialCells];
        let points = [...initialPoints];
        let value = combinations[i][0];
        let nUniverses = combinations[i][1];
        //console.log(value);
        cells[playerIx] = moduleNoZero(cells[playerIx]+value, 10);
        points[playerIx] += cells[playerIx];

        if(points[playerIx] >= limitPoints){
          //console.log("adding victory for " + (playerIx+1) +" in "+ value+" -> "+points + " points")
          //console.log("add victory to player "+(playerIx+1)+"-> " + points)
          wins[playerIx]+=nUniverses; // There are n equivalent universes
        }
        else{
          //console.log(""+(playerIx+1) +" not wining->"+points);
          // Call recursively
          //console.log("recursive")
          let winsFuture = exploreUniverse(1-playerIx, cells, points);
          wins[0] += winsFuture[0]*nUniverses;
          wins[1] += winsFuture[1]*nUniverses;
    }
  }
  return wins;
}

const dieValues = [1,2,3];
const combinations = [[3,1],[4,3],[5,6],[6,7],[7,6],[8,3],[9,1]];
const limitPoints = 21;
function puzzle21(inputData){
    //let wins = [0,0];
    let points = [0,0];
    let cells = inputData;

    let wins = exploreUniverse(0, cells, points);

    
    console.log("SOLUTION");
    console.log(wins);
    console.log(Math.max(...wins))
    
}

//getData("day21_test.txt");
getData("day21_input.txt");
