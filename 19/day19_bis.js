/*
--- Part Two ---
Sometimes, it's a good idea to appreciate just how big the ocean is. Using the Manhattan distance, how far apart do the scanners get?
In the above example, scanners 2 (1105,-1205,1229) and 3 (-92,-2380,-20) are the largest Manhattan distance apart. In total, they are 1197 + 1175 + 1249 = 3621 units apart.
What is the largest Manhattan distance between any two scanners?
*/
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle19(arrayData);
      });
}

function readRawData(rawData){
    rawData = rawData.replace(/(\r\n|\n|\r)/gm, "\n");
    let stringScanners = rawData.split("\n\n");
    let rows = []
    stringScanners.forEach(s =>{
        let SDataString = s.split("\n");
        SDataString.shift();
        let sData = [];
        SDataString.forEach(r =>{
          sData.push(JSON.parse("["+r+"]"));
        });
        rows.push(sData);
    });
    return rows;
}

function deepCopy(currentArray){
  var newArray = [];
  newArray = JSON.parse(JSON.stringify(currentArray));
  return newArray;
}

function checkPointInPoints(p, points){
  for(let i = 0; i< points.length; i++){
    if(compareVector3(points[i],p)) return true;
  }
  return false;
}

function substractVector3(pos1, pos2){
  let p =[];
  p.push(pos1[0]-pos2[0]);
  p.push(pos1[1]-pos2[1]);
  p.push(pos1[2]-pos2[2]);
  return p;
}

function addVector3(pos1, pos2){
  let p =[];
  p.push(pos1[0]+pos2[0]);
  p.push(pos1[1]+pos2[1]);
  p.push(pos1[2]+pos2[2]);
  return p;
}

function compareVector3(pos1, pos2){
  return (pos1[0]==pos2[0] && pos1[1]==pos2[1] && pos1[2]==pos2[2]);
}

function rotatePoint(p, rotPermutation, inverse=false){
  // inverse=false makes rotation from base to rotated
  let [x,y,z] = [p[0],p[1],p[2]]
  let p2 = [x,y,z];
  switch(rotPermutation){
    // X FORWARDING ON THE SAME DIRECTION (4 ROTATIONS)
    case 0: p2 = inverse? [x,y,z] : [x,y,z];break; // usually not interested. Default one
    case 1: p2 = inverse? [x,-z,y] : [x,z,-y];break;
    case 2: p2 = inverse? [x,-y,-z] : [x,-y,-z];break;
    case 3: p2 = inverse? [x,z,-y] : [x,-z,y];break;

    // X FORWARDING ON THE ORIGINAL +Y DIRECTION (4 ROTATIONS)
    case 4: p2 = inverse? [-y,x,z] : [y,-x,z];break;
    case 5: p2 = inverse? [z,x,y] : [y,z,x];break;    
    case 6: p2 = inverse? [y,x,-z] : [y,x,-z];break;
    case 7: p2 = inverse? [-z,x,-y] : [y,-z,-x];break;

    // X FORWARDING ON THE ORIGINAL -X DIRECTION (4 ROTATIONS)
    case 8: p2 = inverse? [-x,-y,z] : [-x,-y,z];break;
    case 9: p2 = inverse? [-x,z,y] : [-x,z,y];break;
    case 10: p2 = inverse? [-x,y,-z] : [-x,y,-z];break;    
    case 11: p2 = inverse? [-x,-z,-y] : [-x,-z,-y];break;

    // X FORWARDING ON THE ORIGINAL -Y DIRECTION (4 ROTATIONS)
    case 12: p2 = inverse? [y,-x,z] : [-y,x,z];break;//
    case 13: p2 = inverse? [-z,-x,y] : [-y,z,-x];break;
    case 14: p2 = inverse? [-y,-x,-z] : [-y,-x,-z];break;
    case 15: p2 = inverse? [z,-x,-y] : [-y,-z,x];break;

    // X FORWARDING ON THE ORIGINAL +Z DIRECTION (4 ROTATIONS)
    case 16: p2 = inverse? [-z,y,x] : [z,y,-x];break;
    case 17: p2 = inverse? [-y,-z,x] : [z,-x,-y];break;
    case 18: p2 = inverse? [z,-y,x] : [z,-y,x];break;
    case 19: p2 = inverse? [y,z,x] : [z,x,y];break;

    // X FORWARDING ON THE ORIGINAL -Z DIRECTION (4 ROTATIONS)
    case 20: p2 = inverse? [z,y,-x] : [-z,y,x];break;
    case 21: p2 = inverse? [y,-z,-x] : [-z,x,-y];break;
    case 22: p2 = inverse? [-z,-y,-x] : [-z,-y,-x];break;
    case 23: p2 = inverse? [-y,z,-x] : [-z,-x,y];break;

    default: p2 = [x,y,z];break;
  }
  return p2;
}

function rotateAllPoints(points, rotPermutation){
  let ps = [];
  for(let i = 0; i< points.length; i++){
    ps.push(rotatePoint(points[i],rotPermutation));
  }
  return ps;
}

function translateAllPoints(points, offset){
  let ps = [];
  for(let i = 0; i< points.length; i++){
    ps.push(addVector3(points[i],offset));
  }
  return ps;
}

function checkTranslation(points1, points2, n=12){
  // returns offset necessary so p1 + offset becomes p2
  let nPointsInCommon = 0;
  let offset = [0,0,0]; 

  // We set a potential common base point for each of the points
  for(let base = 0; base < points1.length; base++){
    for(let correspondence = 0; correspondence < points2.length; correspondence++){
      offset = substractVector3(points2[correspondence], points1[base]);
      nPointsInCommon = 0;
      //Now we check
      for(let i = 0; i< points1.length; i++){
        if(checkPointInPoints(addVector3(points1[i],offset), points2)){
          nPointsInCommon++;
          if(nPointsInCommon >= n)return offset;
        }
      }
    }
  }
  return false;
}

function addIfNew(point, array){
  if(!checkPointInPoints(point,array)){
    array.push(point)
  }
}

function nCorrespondenceIn(a1, a2){
  let sum = 0;
  for(let i =0; i< a1.length; i++)
    if(checkPointInPoints(a1[i],a2))sum++;
  return sum;
}

function puzzle19(inputData){
    //console.log(inputData);
    // WE TAKE SCANNER 0 AS REFERENCE OF TRUTH
    allBeacons = deepCopy(inputData[0]);
    allScanners = {}
    allScanners[0] = [[0,0,0],0]//each element will have {ix: [offset, rotPerm]}
    let foundAny = false;

    do{
      foundAny = false;
      for(let scanner = 1; scanner <inputData.length; scanner++){
        if(allScanners[scanner])continue; // This scanner was already successfully checked
        for(let r = 1; r<24; r++){
          let rotatedPoints = rotateAllPoints(inputData[scanner],r);
          let offset = checkTranslation(rotatedPoints, allBeacons, 12);      
          if(offset){
            console.log("match! for scanner: " + scanner)
            foundAny = true;
            allScanners[scanner] = [offset,r];
            for(let i=0; i< rotatedPoints.length; i++){
              let p = addVector3(rotatedPoints[i], offset);
              addIfNew(p, allBeacons);
            }
            break; // If we already found a match we can skip the rest of rotations
          }
        }
      }
    }while((Object.keys(allScanners).length < inputData.length) && foundAny)

    //let p1 = [[0,2,0],[4,1,0], [3,3,0]];
    //let p2 = [[-1,-1,0], [-5,0,0], [-2,1,0]];
    //let s = checkTranslation(p1, p2, n=3);
    console.log("SOLUTION");
    console.log(allScanners);
    //console.log(allBeacons);
    console.log(allBeacons.length);

}

//getData("day19_rotationTest.txt");
//getData("day19_test.txt");
getData("day19_input.txt");
