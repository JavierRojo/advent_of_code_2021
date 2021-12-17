/*
--- Day 10: Syntax Scoring ---
You ask the submarine to determine the best route out of the deep-sea cave, but it only replies:

Syntax error in navigation subsystem on line: all of them
All of them?! The damage is worse than you thought. You bring up a 
copy of the navigation subsystem (your puzzle input).

The navigation subsystem syntax is made of several lines containing chunks. 
There are one or more chunks on each line, and chunks contain zero or more other chunks. 
Adjacent chunks are not separated by any delimiter; if one chunk stops, the next chunk (if any) 
can immediately start. Every chunk must open and close with one of four legal pairs of matching characters:

If a chunk opens with (, it must close with ).
If a chunk opens with [, it must close with ].
If a chunk opens with {, it must close with }.
If a chunk opens with <, it must close with >.
So, () is a legal chunk that contains no other chunks, as is []. 
More complex but valid chunks include ([]), {()()()}, <([{}])>, 
[<>({}){}[([])<>]], and even (((((((((()))))))))).

Some lines are incomplete, but others are corrupted. 
Find and discard the corrupted lines first.

A corrupted line is one where a chunk closes with the wrong character - 
that is, where the characters it opens and closes with do not form one of 
the four legal pairs listed above.

Examples of corrupted chunks include (], {()()()>, (((()))}, and <([]){()}[{}]). 
Such a chunk can appear anywhere within a line, and its presence 
causes the whole line to be considered corrupted.

For example, consider the following navigation subsystem:

[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
Some of the lines aren't corrupted, just incomplete; 
you can ignore these lines for now. The remaining five lines are corrupted:

{([(<{}[<>[]}>{[]{[(<()> - Expected ], but found } instead.
[[<[([]))<([[{}[[()]]] - Expected ], but found ) instead.
[{[{({}]{}}([{[{{{}}([] - Expected ), but found ] instead.
[<(<(<(<{}))><([]([]() - Expected >, but found ) instead.
<{([([[(<>()){}]>(<<{{ - Expected ], but found > instead.
Stop at the first incorrect closing character on each corrupted line.

Did you know that syntax checkers actually have contests to see who 
can get the high score for syntax errors in a file? It's true! 
To calculate the syntax error score for a line, take the first 
illegal character on the line and look it up in the following table:

): 3 points.
]: 57 points.
}: 1197 points.
>: 25137 points.
In the above example, an illegal ) was found twice (2*3 = 6 points), an illegal ] 
was found once (57 points), an illegal } was found once (1197 points), and an illegal > 
was found once (25137 points). So, the total syntax error score 
for this file is 6+57+1197+25137 = 26397 points!

Find the first illegal character in each corrupted line of the navigation subsystem. 
What is the total syntax error score for those errors?
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
    let sum = 0;
    inputData.forEach(row => {
        let ev = evaluateSyntax(row);   
        if(ev !== true){
            sum+=getValue(ev);
        }     
    });
    console.log("SOLUTION");
    console.log(sum);
}


function getValue(c){
    switch(c){
        case ')':return 3;
        case ']':return 57;
        case '}':return 1197;
        case '>':return 25137;
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