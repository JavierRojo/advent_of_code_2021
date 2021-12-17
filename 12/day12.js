/*
--- Day 12: Passage Pathing ---
With your submarine's subterranean subsystems subsisting suboptimally, 
the only way you're getting out of this cave anytime soon is by finding a path yourself. 
Not just a path - the only way to know if you've found the best path is to find all of them.
Fortunately, the sensors are still mostly working, and so you build a rough map of the remaining caves (your puzzle input). 
For example:

start-A
start-b
A-c
A-b
b-d
A-end
b-end
This is a list of how all of the caves are connected. You start in the cave named start, 
and your destination is the cave named end. An entry like b-d means that 
cave b is connected to cave d - that is, you can move between them.
So, the above cave system looks roughly like this:

    start
    /   \
c--A-----b--d
    \   /
     end

Your goal is to find the number of distinct paths that start at start, end at end, 
and don't visit small caves more than once. There are two types of caves: 
big caves (written in uppercase, like A) and small caves (written in lowercase, like b). 
It would be a waste of time to visit any small cave more than once, but big caves are large enough 
that it might be worth visiting them multiple times. So, all paths you find should 
visit small caves at most once, and can visit big caves any number of times.
Given these rules, there are 10 paths through this example cave system:

start,A,b,A,c,A,end
start,A,b,A,end
start,A,b,end
start,A,c,A,b,A,end
start,A,c,A,b,end
start,A,c,A,end
start,A,end
start,b,A,c,A,end
start,b,A,end
start,b,end

(Each line in the above list corresponds to a single path; the caves visited by 
that path are listed in the order they are visited and separated by commas.)

Note that in this cave system, cave d is never visited by any path: to do so, 
cave b would need to be visited twice (once on the way to cave d and a second 
time when returning from cave d), and since cave b is small, this is not allowed.

Here is a slightly larger example:

dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc


The 19 paths through it are as follows:

start,HN,dc,HN,end
start,HN,dc,HN,kj,HN,end
start,HN,dc,end
start,HN,dc,kj,HN,end
start,HN,end
start,HN,kj,HN,dc,HN,end
start,HN,kj,HN,dc,end
start,HN,kj,HN,end
start,HN,kj,dc,HN,end
start,HN,kj,dc,end
start,dc,HN,end
start,dc,HN,kj,HN,end
start,dc,end
start,dc,kj,HN,end
start,kj,HN,dc,HN,end
start,kj,HN,dc,end
start,kj,HN,end
start,kj,dc,HN,end
start,kj,dc,end


Finally, this even larger example has 226 paths through it:

fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW

How many paths through this cave system are there that visit small caves at most once?
*/
var fs = require('fs');


function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle12(arrayData);
      });
}

function readRawData(rawData){
    let allRows=[];
    let tempSegmentArray = rawData.split("\n");

    tempSegmentArray.forEach(row => {
        let stringrow = row.split("-");
        allRows.push(stringrow);
    });
    return allRows;
}


function getBasicTestData(){
    return ""+
    "start-A"+"\n"+
    "start-b"+"\n"+
    "A-c"+"\n"+
    "A-b"+"\n"+
    "b-d"+"\n"+
    "A-end"+"\n"+
    "b-end"
}

function getTestData(){
    return ""+
    "fs-end"+"\n"+
    "he-DX"+"\n"+
    "fs-he"+"\n"+
    "start-DX"+"\n"+
    "pj-DX"+"\n"+
    "end-zg"+"\n"+
    "zg-sl"+"\n"+
    "zg-pj"+"\n"+
    "pj-he"+"\n"+
    "RW-he"+"\n"+
    "fs-DX"+"\n"+
    "pj-RW"+"\n"+
    "zg-RW"+"\n"+
    "start-pj"+"\n"+
    "he-WI"+"\n"+
    "zg-he"+"\n"+
    "pj-fs"+"\n"+
    "start-RW"
}

function isCapital(str){
    return str.toUpperCase() === str && str.toLowerCase() !== str
}

function puzzle12(inputData){
    CaveNode.DestroyAll();
    CreateCave(inputData);
    let paths = GetPaths();
    console.log("SOLUTION");
    console.log(paths.length)
    /*paths.forEach(p => {
        PrintPath(p);        
    });*/
}

function GetPaths(){
    /*
    start,A,b,A,c,A,end
    start,A,b,A,end
    start,A,b,end
    start,A,c,A,b,A,end
    start,A,c,A,b,end
    start,A,c,A,end
    start,A,end
    start,b,A,c,A,end
    start,b,A,end
    start,b,end
    */
    let paths = [];
    let candidates = [];
    let evaluated = [];
    CaveNode.ResetAll();
    candidates.push([CaveNode.GetNodeByID("start")]);


    do{
        let promisingPath = candidates[candidates.length-1]; //last one
        CaveNode.ResetAll();     
        MarkVisited(promisingPath);
        let lastNode = promisingPath[promisingPath.length-1];
        let unVisitedNs = lastNode.GetUnvisitedNeighbours();   
        evaluated.push(candidates.pop());
        if (unVisitedNs.length == 0){
            // INVALID PATH! TAKE THIS OUT OF THE CANDIDATES
            //evaluated.push(candidates.pop());
        }else{
            // WE HAVE UNVISITED NODES! ADD THEM TO THE OPTIONS
            unVisitedNs.forEach(n => {
                n.SetVisited();
                let p = promisingPath.slice()
                p.push(n);
                if(n.id == "end"){
                    paths.push(p);
                    evaluated.push(p);
                }
                else{
                    candidates.push(p);   
                }
            });
        }
        //printStep(candidates,evaluated,paths);
        //pausecomp(1000);
    }while(candidates.length>0);

    return paths;
}

function printStep(candidates, evaluated, solutions){
        console.log("");
        console.log("EVALUATED:");
        evaluated.forEach(p => {
            PrintPath(p);        
        });
        
        console.log("");
        console.log("CANDIDATES:");
        candidates.forEach(p => {
            PrintPath(p);        
        });

        console.log("");
        console.log("SOLUTIONS:")
        solutions.forEach(p => {
            PrintPath(p);        
        });

        console.log("");
        console.log("STEP CHANGE //__//__//")
        console.log("");

}

function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

function MarkVisited(path){
    path.forEach(n => {
        n.SetVisited();    
    });
}

function ComparePaths(p1,p2){
    if(p1.length != p2.length) return false;
    for(let i=0;i<p1.length;i++){
        if (p1[i] != p2[i])return false;
    }
    return true;
}

function PrintPath(p){
    let s = "";
    p.forEach(n => {
        s += n.id+","        
    });
    if(s.length>0)s.slice(s.length-1);
    console.log(s);
}

function CreateCave(inputData){
    for(let row = 0; row < inputData.length; row ++){
        let char1 = inputData[row][0];
        let char2 = inputData[row][1];

        if(!CaveNode.Includes(char1)) new CaveNode(char1);
        CaveNode.GetNodeByID(char1).connections.push(char2);
        
        if(!CaveNode.Includes(char2)) new CaveNode(char2);
        CaveNode.GetNodeByID(char2).connections.push(char1);
    }
}


class CaveNode{
    static allNodes = []
    constructor(c_id=""){
        this.id=c_id;
        this.visited = false;
        this.connections = [];
        CaveNode.allNodes.push(this)
    }

    SetVisited(){
        if(!isCapital(this.id)){
            this.visited = true;
        }

    }

    GetVisitedNeighbours(){
        let neighbours = [];
        for(let n = 0; n< this.connections.length; n++){
            let cn =CaveNode.GetNodeByID(this.connections[n]);
            if(cn.visited)neighbours.push(cn);
        }
        return neighbours;
    }
    GetUnvisitedNeighbours(){
        let neighbours = [];
        for(let n = 0; n< this.connections.length; n++){
            let cn =CaveNode.GetNodeByID(this.connections[n]);
            if(!cn.visited || isCapital(cn.id))neighbours.push(cn);
        }
        return neighbours;
    }

    GetNeighbours(){
        let neighbours = [];
        for(let n = 0; n< this.connections.length; n++){
            neighbours.push(CaveNode.GetNodeByID(this.connections[n]));
        }
        return neighbours;
    }

    static DestroyAll(){
        this.allNodes = [];
    }

    Reset(){
        this.visited = false;
    }

    static ResetAll(){
        for(let i = 0; i< CaveNode.allNodes.length; i++){
            CaveNode.allNodes[i].Reset();
        }
    }

    static PrintAllNodes(){
        console.log(CaveNode.allNodes);
    }
    static Includes(id_compare){
        for(let i = 0; i< CaveNode.allNodes.length; i++){
            if(CaveNode.allNodes[i].id == id_compare){
                return true;
            }
        }
        return false;
    }

    static GetNodeByID(id_compare){
        for(let i = 0; i< CaveNode.allNodes.length; i++){
            if(CaveNode.allNodes[i].id == id_compare){
                return CaveNode.allNodes[i];
            }
        }
        return null;
    }
}





//puzzle12(readRawData(getBasicTestData()));
//puzzle12(readRawData(getTestData()));
getData("day12_input.txt");