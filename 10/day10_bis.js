/*
--- Part Two ---
Now, discard the corrupted lines. The remaining lines are incomplete.

Incomplete lines don't have any incorrect characters - instead, they're missing some closing characters at the end of the line. To repair the navigation subsystem, you just need to figure out the sequence of closing characters that complete all open chunks in the line.

You can only use closing characters (), ], }, or >), and you must add them in the correct order so that only legal pairs are formed and all chunks end up closed.

In the example above, there are five incomplete lines:

[({(<(())[]>[[{[]{<()<>> - Complete by adding }}]])})].
[(()[<>])]({[<{<<[]>>( - Complete by adding )}>]}).
(((({<>}<{<{<>}{[]{[]{} - Complete by adding }}>}>)))).
{<[[]]>}<{[{[{[]{()[[[] - Complete by adding ]]}}]}]}>.
<{([{{}}[<[[[<>{}]]]>[]] - Complete by adding ])}>.
Did you know that autocomplete tools also have contests? It's true! The score is 
determined by considering the completion string character-by-character. 
Start with a total score of 0. Then, for each character, 
multiply the total score by 5 and then increase the total score by the point value given for the character in the following table:

): 1 point.
]: 2 points.
}: 3 points.
>: 4 points.
So, the last completion string above - ])}> - would be scored as follows:

Start with a total score of 0.
Multiply the total score by 5 to get 0, then add the value of ] (2) to get a new total score of 2.
Multiply the total score by 5 to get 10, then add the value of ) (1) to get a new total score of 11.
Multiply the total score by 5 to get 55, then add the value of } (3) to get a new total score of 58.
Multiply the total score by 5 to get 290, then add the value of > (4) to get a new total score of 294.
The five lines' completion strings have total scores as follows:

}}]])})] - 288957 total points.
)}>]}) - 5566 total points.
}}>}>)))) - 1480781 total points.
]]}}]}]}> - 995444 total points.
])}> - 294 total points.


Autocomplete tools are an odd bunch: the winner is found by sorting 
all of the scores and then taking the middle score. (There will always be an odd number of scores to consider.) 
In this example, the middle score is 288957 because there are the same number of scores smaller and larger than it.
Find the completion string for each incomplete line, score the completion strings, and sort the scores. What is the middle score?
*/
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle10(arrayData);
      });
}

function readRawData(rawData){
    let allRows=[];
    let tempSegmentArray = rawData.split("\n");
    tempSegmentArray.forEach(row => {
        allRows.push(row.split(""));
    });
    return allRows;
}

function getTestData(){
    return ""+
    "[({(<(())[]>[[{[]{<()<>>"+"\n"+
    "[(()[<>])]({[<{<<[]>>("+"\n"+
    "{([(<{}[<>[]}>{[]{[(<()>"+"\n"+
    "(((({<>}<{<{<>}{[]{[]{}"+"\n"+
    "[[<[([]))<([[{}[[()]]]"+"\n"+
    "[{[{({}]{}}([{[{{{}}([]"+"\n"+
    "{<[[]]>}<{[{[{[]{()[[[]"+"\n"+
    "[<(<(<(<{}))><([]([]()"+"\n"+
    "<{([([[(<>()){}]>(<<{{"+"\n"+
    "<{([{{}}[<[[[<>{}]]]>[]]"
}

// --- //

function puzzle10(inputData){
    let fArray = filterData(inputData);
    let results = [];

    fArray.forEach(row => {
        let openersLeft = getOpeners(row);
        let closersLeft = getClosers(openersLeft);
        let value = getValues(closersLeft);
        results.push(value);        
    });

    results.sort(function(a, b) {
        return b-a;
      });
    
    console.log("SOLUTION");
    console.log(results[Math.floor(results.length * 0.5)]);
}

function getValues(closers){
    let v = 0;
    closers.forEach(c => {
        v *= 5;
        v += getValue(c);        
    });
    return v;
}

function getClosers(openers){
    let c = [];
    for(let i= openers.length-1; i>=0; i--){
        c.push(getCloser(openers[i]));
    }
    return c;
}

function filterData(inputData){
    let r = [];
    inputData.forEach(row => {
        let ev = evaluateSyntax(row);   
        if(ev == true){
            r.push(row);
        }     
    });
    return r;
}

function getValue(c){
    switch(c){
        case ')':return 1;
        case ']':return 2;
        case '}':return 3;
        case '>':return 4;
        default: return 0;
    }
}


function isOpener(c){
    if(c == '[' || c == '(' || c == '{' || c == '<' ) return true;
    else return false;
}

function getCloser(c){
    switch(c){
        case '[':return ']';
        case '(':return ')';
        case '<':return '>';
        case '{':return '}';
    }
}

function getOpeners(row){
    let opened=[];
    for(let i = 0; i<row.length; i++){
        if(isOpener(row[i])){
            opened.push(row[i]);
            continue;
        }
        else{
            if(row[i] == getCloser(opened[opened.length-1])){
                opened.pop();
                continue;
            }
        }        
    }

    return opened;
}

function evaluateSyntax(row){
    let opened=[];
    for(let i = 0; i<row.length; i++){
        if(isOpener(row[i])){
            opened.push(row[i]);
            continue;
        }
        else if(opened.length == 0){
            // It is closing where it shouldn't
            console.log("Closing "+row[i] + " when expected an opening");
            return row[i];
        }
        else{
            if(row[i] == getCloser(opened[opened.length-1])){
                opened.pop();
                continue;
            }
            else{ // SYNTAX ERROR!!
                console.log(row.join("")+" - "+ getCloser(opened[opened.length-1]) +" Expected, but found " + row[i] + " instead");
                return row[i];
            }
        }        
    }
    return true;
}

//puzzle10(readRawData(getTestData()));
getData("day10_input.txt");