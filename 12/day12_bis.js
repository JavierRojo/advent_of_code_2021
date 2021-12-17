/*
--- Part Two ---
After reviewing the available paths, you realize you might have time to visit a single small cave twice. Specifically, big caves can be visited any number of times, a single small cave can be visited at most twice, and the remaining small caves can be visited at most once. However, the caves named start and end can only be visited exactly once each: once you leave the start cave, you may not return to it, and once you reach the end cave, the path must end immediately.

Now, the 36 possible paths through the first example above are:

start,A,b,A,b,A,c,A,end
start,A,b,A,b,A,end
start,A,b,A,b,end
start,A,b,A,c,A,b,A,end
start,A,b,A,c,A,b,end
start,A,b,A,c,A,c,A,end
start,A,b,A,c,A,end
start,A,b,A,end
start,A,b,d,b,A,c,A,end
start,A,b,d,b,A,end
start,A,b,d,b,end
start,A,b,end
start,A,c,A,b,A,b,A,end
start,A,c,A,b,A,b,end
start,A,c,A,b,A,c,A,end
start,A,c,A,b,A,end
start,A,c,A,b,d,b,A,end
start,A,c,A,b,d,b,end
start,A,c,A,b,end
start,A,c,A,c,A,b,A,end
start,A,c,A,c,A,b,end
start,A,c,A,c,A,end
start,A,c,A,end
start,A,end
start,b,A,b,A,c,A,end
start,b,A,b,A,end
start,b,A,b,end
start,b,A,c,A,b,A,end
start,b,A,c,A,b,end
start,b,A,c,A,c,A,end
start,b,A,c,A,end
start,b,A,end
start,b,d,b,A,c,A,end
start,b,d,b,A,end
start,b,d,b,end
start,b,end
The slightly larger example above now has 103 paths through it, and the even larger example now has 3509 paths through it.

Given these new rules, how many paths through this cave system are there?
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
    let paths = [];
    let candidates = [];
    let evaluated = [];
    CaveNode.ResetAll();
    candidates.push([CaveNode.GetNodeByID("start")]);

    counter = 0;
    do{
        let promisingPath = candidates[candidates.length-1]; //last one
        CaveNode.ResetAll();     
        let visitedTwice = MarkVisited(promisingPath);
        let lastNode = promisingPath[promisingPath.length-1];
        let unVisitedNs = lastNode.GetUnvisitedNeighbours(!visitedTwice);
        evaluated.push(candidates.pop());
        if (unVisitedNs.length == 0){
            // INVALID PATH! TAKE THIS OUT OF THE CANDIDATES
            //evaluated.push(candidates.pop());
        }else{
            
            // WE HAVE UNVISITED NODES! ADD THEM TO THE OPTIONS
            unVisitedNs.forEach(n => {
                if(isCapital(n.id) || promisingPath.filter(x => x==n).length <2){
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
                }else{
                    console.log(""+ n.id+" was not added to candidates");
                }
            });
        }
        counter++;
        if(counter %100 == 0)console.log("step: "+counter);

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

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

function MarkVisited(path){
    let visitedTwice = false;
    path.forEach(n => {
        n.SetVisited();  
        if(getAllIndexes(path,n).length == 2 && !isCapital(n.id)){
            visitedTwice = true;
        }  
    });
    return visitedTwice;
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
    static visitedTwice = false;
    
    constructor(c_id=""){
        this.id=c_id;
        this.visited = false;
        this.connections = [];
        CaveNode.allNodes.push(this)
    }

    SetVisited(){
        if(this.visited){
            this.visitedTwice = true;
        }
        this.visited = true;
    }

    GetVisitedNeighbours(){
        let neighbours = [];
        for(let n = 0; n< this.connections.length; n++){
            let cn =CaveNode.GetNodeByID(this.connections[n]);
            if(cn.visited)neighbours.push(cn);
        }
        return neighbours;
    }
    GetUnvisitedNeighbours(canVisitTwice = false){
        let neighbours = [];
        for(let n = 0; n< this.connections.length; n++){
            let cn =CaveNode.GetNodeByID(this.connections[n]);
            if(isCapital(cn.id)){
                neighbours.push(cn);
            }
            else{
                if(!cn.visited){
                    neighbours.push(cn);
                }
                else if(canVisitTwice){
                    //console.log("visitedTwice");
                    if(cn.id !== "start" && cn.id !== "end"){
                        //console.log("adding weird small cave");
                        neighbours.push(cn);
                        this.visitedTwice = true;
                    }
                }
            }
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
        this.visitedTwice = false;
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