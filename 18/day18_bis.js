/*
--- Part Two ---
You notice a second question on the back of the homework assignment:
What is the largest magnitude you can get from adding only two of the snailfish numbers?
Note that snailfish addition is not commutative - that is, x + y and y + x can produce different results.
Again considering the last example homework assignment above:

[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
The largest magnitude of the sum of any two snailfish numbers in this list is 3993. 
This is the magnitude of [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]] + [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]], 
which reduces to [[[[7,8],[6,6]],[[6,0],[7,7]]],[[[7,8],[8,8]],[[7,9],[0,6]]]].

What is the largest magnitude of any sum of two different snailfish numbers from the homework assignment?
*/
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle18(arrayData);
      });
}

function readRawData(rawData){
    rawData = rawData.replace(/(\r\n|\n|\r)/gm, "\n");
    let stringRows = rawData.split("\n");
    let rows = []
    stringRows.forEach(r =>{
        rows.push(JSON.parse(r));
    });
    return rows;
}

function magnitude(arr){ // WORKS!
      let mx = typeof arr[0] == "number"? arr[0] : magnitude(arr[0]);
      let my = typeof arr[1] == "number"? arr[1] : magnitude(arr[1]);
      return 3 * mx + 2 * my;
}

function getDepth(array, level = 0) { // WORKS!
  let levels = [...array].map((item) => {
      if (typeof item == "number")return level;
      else return getDepth(item, level + 1);
    });
    return Math.max(...levels);  
}

function splitNumber(N){ // WORKS!
  return [Math.floor(N/2), Math.floor((N/2)+0.75)];
}

// CRUCIAL FOR FINDING NEXT() AND LAST() ELEMENTS
function createIxPaths(element, path = [], allPaths = []) {
  //console.log(element);
  if (typeof element == "number") {
    allPaths.push([path, element]); // We store the series of index that bring us to the stored element
  } else {
    createIxPaths(element[0], path.concat(0), allPaths);
    createIxPaths(element[1], path.concat(1), allPaths);
  }
  return allPaths;
};




function compArr(a1, a2){
  return (JSON.stringify(a1)==JSON.stringify(a2))
}

function explode(tree, arr, ixPath){ // WORKS!
  // ixPath represents the common path for both parts of the pair
  let pair = [null,null];
  let pairIx = [null,null];
  for(let i=0; i<tree.length; i++){
    let path = tree[i][0];
    path = [...path];
    let n = path.pop();
    if(compArr(ixPath,path)){
      // MATCH!!
      pair[n] = tree[i];//[i][1]?
      pairIx[n] = i;
    }
  }
  
  let hasLeftElement = pairIx[0]>0;
  let hasRightElement = pairIx[1]<(tree.length-1);

  if(hasLeftElement){
    let leftPath = tree[pairIx[0]-1][0]
    tree[pairIx[0]-1][1] += pair[0][1]
    let e;
    if(leftPath.length == 1)
      arr[leftPath[0]] += pair[0][1];
    if(leftPath.length == 2)
      (arr[leftPath[0]])[leftPath[1]] += pair[0][1];
    if(leftPath.length == 3)
      (arr[leftPath[0]][leftPath[1]])[leftPath[2]] += pair[0][1];
    if(leftPath.length == 4)
      (arr[leftPath[0]][leftPath[1]][leftPath[2]])[leftPath[3]] += pair[0][1];
  }

  if(hasRightElement){
    let rightPath = tree[pairIx[1]+1][0]
    tree[pairIx[1]+1][1] += pair[1][1]
    if(rightPath.length == 1)
      arr[rightPath[0]] += pair[1][1];
    if(rightPath.length == 2)
      (arr[rightPath[0]])[rightPath[1]] += pair[1][1];
    if(rightPath.length == 3)
      (arr[rightPath[0]][rightPath[1]])[rightPath[2]] += pair[1][1];
    if(rightPath.length == 4){
      (arr[rightPath[0]][rightPath[1]][rightPath[2]])[rightPath[3]] += pair[1][1];
    }
  }

  // DELETE BASED ON IXPATH
  if(ixPath.length == 1)
    arr[ixPath[0]] = 0;
  if(ixPath.length == 2)
    arr[ixPath[0]][ixPath[1]] = 0;
  if(ixPath.length == 3)
    arr[ixPath[0]][ixPath[1]][ixPath[2]] = 0;
  if(ixPath.length == 4){
    (arr[ixPath[0]][ixPath[1]][ixPath[2]])[ixPath[3]] = 0;
  }

  tree.splice(pairIx[0],2);
  tree.splice(pairIx[0], 0, [ixPath,0]);
}

function detectExplosives(tree){ // WORKS!
  for(let i = 0; i< tree.length; i++){
    if(tree[i][0].length > 4){
      // MATCH
      let ixPath = tree[i][0]
      ixPath = [...ixPath];
      ixPath.pop();
      return ixPath;
    }
  }
  return false;
}

function split(tree, arr, ix){
  let path = tree[ix][0];
  let newSnail = splitNumber(tree[ix][1]);
  let p = [...path]
  let p1 = [...p]; p1.push(0);
  let p2 = [...p]; p2.push(1);
  tree.splice(ix, 1, [p1, newSnail[0]]);
  tree.splice(ix+1, 0, [p2, newSnail[1]]);

  //

    if(p.length == 1)
      arr[p[0]] = newSnail;
    if(p.length == 2)
      (arr[p[0]])[p[1]] = newSnail;
    if(p.length == 3)
      (arr[p[0]][p[1]])[p[2]] = newSnail;
    if(p.length == 4)
      (arr[p[0]][p[1]][p[2]])[p[3]] = newSnail;
}

function detectSplittables(tree){
  for(let i = 0; i< tree.length; i++){
    if(tree[i][1] >= 10)
      // MATCH
      return i;
    }
    return null;
}

function add(sn1, sn2){
  let snailFish = [[...sn1], [...sn2]];
  let tree = createIxPaths(snailFish);
  let exploded = false;
  let splitted = false;
  do{
    //console.log(tree);
    exploded = false;
    splitted = false;
    let ixPath = detectExplosives(tree);
    let ix = detectSplittables(tree);
    // MAYBE THE ORDER MATTERS!!

    if(ixPath){
      exploded = true;      
      explode(tree,snailFish,ixPath);
      continue;
    }

    if (ix != null){
      splitted = true;
      split(tree,snailFish,ix);
      continue;
    }
  }while(exploded || splitted)
  return snailFish;
}

function deepCopy(currentArray){
  var newArray = [];
  newArray = JSON.parse(JSON.stringify(currentArray));
  return newArray;
}

function puzzle18(inputData){
    let maxMagnitude = 0;

    for(let i = 0; i< inputData.length; i++){
      for(let j = 0; j< inputData.length; j++){       
        if(i == j) continue;
        let a = deepCopy(inputData[i])
        let b = deepCopy(inputData[j])
        let snailFish = add(a, b);
        let m = magnitude(snailFish);
        if(m>maxMagnitude){
          maxMagnitude = m;
          //console.log(createIxPaths(snailFish))
        }
      }
    }  
    console.log("SOLUTION");
    console.log(maxMagnitude);
}

//getData("day18_test.txt");
getData("day18_input.txt");
