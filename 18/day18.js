/*
--- Day 18: Snailfish ---
You descend into the ocean trench and encounter some snailfish. They say they saw the sleigh keys! 
They'll even tell you which direction the keys went if you help one of the smaller snailfish with his math homework.

Snailfish numbers aren't like regular numbers. Instead, every snailfish number is a pair - 
an ordered list of two elements. Each element of the pair can be either a regular number or another pair.

Pairs are written as [x,y], where x and y are the elements within the pair. Here are some example snailfish numbers, one snailfish number per line:

[1,2]
[[1,2],3]
[9,[8,7]]
[[1,9],[8,5]]
[[[[1,2],[3,4]],[[5,6],[7,8]]],9]
[[[9,[3,8]],[[0,9],6]],[[[3,7],[4,9]],3]]
[[[[1,3],[5,3]],[[1,3],[8,7]]],[[[4,9],[6,9]],[[8,2],[7,3]]]]
This snailfish homework is about addition. To add two snailfish numbers, form a pair from the left and right parameters of the addition operator. For example, [1,2] + [[3,4],5] becomes [[1,2],[[3,4],5]].

There's only one problem: snailfish numbers must always be reduced, and the process of adding two snailfish numbers can result in snailfish numbers that need to be reduced.

To reduce a snailfish number, you must repeatedly do the first action in this list that applies to the snailfish number:

If any pair is nested inside four pairs, the leftmost such pair explodes.
If any regular number is 10 or greater, the leftmost such regular number splits.
Once no action in the above list applies, the snailfish number is reduced.

During reduction, at most one action applies, after which the process returns to the top of the list of actions. For example, if split produces a pair that meets the explode criteria, that pair explodes before other splits occur.

To explode a pair, the pair's left value is added to the first regular number to the left of the exploding pair (if any), and the pair's right value is added to the first regular number to the right of the exploding pair (if any). Exploding pairs will always consist of two regular numbers. Then, the entire exploding pair is replaced with the regular number 0.

Here are some examples of a single explode action:

[[[[[9,8],1],2],3],4] becomes [[[[0,9],2],3],4] (the 9 has no regular number to its left, so it is not added to any regular number).
[7,[6,[5,[4,[3,2]]]]] becomes [7,[6,[5,[7,0]]]] (the 2 has no regular number to its right, and so it is not added to any regular number).
[[6,[5,[4,[3,2]]]],1] becomes [[6,[5,[7,0]]],3].
[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]] becomes [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]] (the pair [3,2] is unaffected because the pair [7,3] is further to the left; [3,2] would explode on the next action).
[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]] becomes [[3,[2,[8,0]]],[9,[5,[7,0]]]].
To split a regular number, replace it with a pair; the left element of the pair should be the regular number divided by two and rounded down, while the right element of the pair should be the regular number divided by two and rounded up. For example, 10 becomes [5,5], 11 becomes [5,6], 12 becomes [6,6], and so on.

Here is the process of finding the reduced result of [[[[4,3],4],4],[7,[[8,4],9]]] + [1,1]:

after addition: [[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]
after explode:  [[[[0,7],4],[7,[[8,4],9]]],[1,1]]
after explode:  [[[[0,7],4],[15,[0,13]]],[1,1]]
after split:    [[[[0,7],4],[[7,8],[0,13]]],[1,1]]
after split:    [[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]
after explode:  [[[[0,7],4],[[7,8],[6,0]]],[8,1]]
Once no reduce actions apply, the snailfish number that remains is the actual result of the addition operation: [[[[0,7],4],[[7,8],[6,0]]],[8,1]].

The homework assignment involves adding up a list of snailfish numbers (your puzzle input). The snailfish numbers are each listed on a separate line. Add the first snailfish number and the second, then add that result and the third, then add that result and the fourth, and so on until all numbers in the list have been used once.

For example, the final sum of this list is [[[[1,1],[2,2]],[3,3]],[4,4]]:

[1,1]
[2,2]
[3,3]
[4,4]
The final sum of this list is [[[[3,0],[5,3]],[4,4]],[5,5]]:

[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
The final sum of this list is [[[[5,0],[7,4]],[5,5]],[6,6]]:

[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
[6,6]
Here's a slightly larger example:

[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]
The final sum [[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]] is found after adding up the above snailfish numbers:

  [[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
+ [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
= [[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]

  [[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]
+ [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
= [[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]

  [[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]
+ [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
= [[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]

  [[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]
+ [7,[5,[[3,8],[1,4]]]]
= [[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]

  [[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]
+ [[2,[2,2]],[8,[8,1]]]
= [[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]

  [[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]
+ [2,9]
= [[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]

  [[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]
+ [1,[[[9,3],9],[[9,0],[0,7]]]]
= [[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]

  [[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]
+ [[[5,[7,4]],7],1]
= [[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]

  [[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]
+ [[[[4,2],2],6],[8,7]]
= [[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]

To check whether it's the right answer, the snailfish teacher only checks the 
magnitude of the final sum. The magnitude of a pair is 3 times the magnitude of 
its left element plus 2 times the magnitude of its right element. 
The magnitude of a regular number is just that number.

For example, the magnitude of [9,1] is 3*9 + 2*1 = 29; 
the magnitude of [1,9] is 3*1 + 2*9 = 21. 
Magnitude calculations are recursive: 
the magnitude of [[9,1],[1,9]] is 3*29 + 2*21 = 129.

Here are a few more magnitude examples:

[[1,2],[[3,4],5]] becomes 143.
[[[[0,7],4],[[7,8],[6,0]]],[8,1]] becomes 1384.
[[[[1,1],[2,2]],[3,3]],[4,4]] becomes 445.
[[[[3,0],[5,3]],[4,4]],[5,5]] becomes 791.
[[[[5,0],[7,4]],[5,5]],[6,6]] becomes 1137.
[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]] becomes 3488.
So, given this example homework assignment:

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
The final sum is:

[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]
The magnitude of this final sum is 4140.

Add up all of the snailfish numbers from the homework assignment in the order they appear. What is the magnitude of the final sum?

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
  let snailFish = [sn1, sn2];
  let tree = createIxPaths(snailFish);
  let exploded = false;
  let splitted = false;
  do{
    //console.log(tree);
    exploded = false;
    splitted = false;

    let ixPath = detectExplosives(tree);
    if(ixPath){
      exploded = true;      
      explode(tree,snailFish,ixPath);
      continue;
    }

    let ix = detectSplittables(tree);
    if (ix != null){
      splitted = true;
      split(tree,snailFish,ix);
      continue;
    }
  }while(exploded || splitted)
  return snailFish;
}

function puzzle18(inputData){
    //console.log(inputData);
    let snailFish = inputData[0];
    //SUM EVERY INPUT DATA ROW. RIGHT NOW, TEST WITH ONLY ONE
    for(let i = 1; i< inputData.length; i++){
      snailFish = add(snailFish, inputData[i]);
      console.log("AFTER STEP "+i+":")
    }
    console.log("SOLUTION");
    console.log(createIxPaths(snailFish));
    console.log(magnitude(snailFish));

}

getData("day18_test.txt");
//getData("day18_input.txt");
