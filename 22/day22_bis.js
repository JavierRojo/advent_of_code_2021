/*
--- Part Two ---
Now that the initialization procedure is complete, you can reboot the reactor.
Starting with all cubes off, run all of the reboot steps for all cubes in the reactor.
Consider the following reboot steps:

on x=-5..47,y=-31..22,z=-19..33
on x=-44..5,y=-27..21,z=-14..35
on x=-49..-1,y=-11..42,z=-10..38
on x=-20..34,y=-40..6,z=-44..1
off x=26..39,y=40..50,z=-2..11
on x=-41..5,y=-41..6,z=-36..8
off x=-43..-33,y=-45..-28,z=7..25
on x=-33..15,y=-32..19,z=-34..11
off x=35..47,y=-46..-34,z=-11..5
on x=-14..36,y=-6..44,z=-16..29
on x=-57795..-6158,y=29564..72030,z=20435..90618
on x=36731..105352,y=-21140..28532,z=16094..90401
on x=30999..107136,y=-53464..15513,z=8553..71215
on x=13528..83982,y=-99403..-27377,z=-24141..23996
on x=-72682..-12347,y=18159..111354,z=7391..80950
on x=-1060..80757,y=-65301..-20884,z=-103788..-16709
on x=-83015..-9461,y=-72160..-8347,z=-81239..-26856
on x=-52752..22273,y=-49450..9096,z=54442..119054
on x=-29982..40483,y=-108474..-28371,z=-24328..38471
on x=-4958..62750,y=40422..118853,z=-7672..65583
on x=55694..108686,y=-43367..46958,z=-26781..48729
on x=-98497..-18186,y=-63569..3412,z=1232..88485
on x=-726..56291,y=-62629..13224,z=18033..85226
on x=-110886..-34664,y=-81338..-8658,z=8914..63723
on x=-55829..24974,y=-16897..54165,z=-121762..-28058
on x=-65152..-11147,y=22489..91432,z=-58782..1780
on x=-120100..-32970,y=-46592..27473,z=-11695..61039
on x=-18631..37533,y=-124565..-50804,z=-35667..28308
on x=-57817..18248,y=49321..117703,z=5745..55881
on x=14781..98692,y=-1341..70827,z=15753..70151
on x=-34419..55919,y=-19626..40991,z=39015..114138
on x=-60785..11593,y=-56135..2999,z=-95368..-26915
on x=-32178..58085,y=17647..101866,z=-91405..-8878
on x=-53655..12091,y=50097..105568,z=-75335..-4862
on x=-111166..-40997,y=-71714..2688,z=5609..50954
on x=-16602..70118,y=-98693..-44401,z=5197..76897
on x=16383..101554,y=4615..83635,z=-44907..18747
off x=-95822..-15171,y=-19987..48940,z=10804..104439
on x=-89813..-14614,y=16069..88491,z=-3297..45228
on x=41075..99376,y=-20427..49978,z=-52012..13762
on x=-21330..50085,y=-17944..62733,z=-112280..-30197
on x=-16478..35915,y=36008..118594,z=-7885..47086
off x=-98156..-27851,y=-49952..43171,z=-99005..-8456
off x=2032..69770,y=-71013..4824,z=7471..94418
on x=43670..120875,y=-42068..12382,z=-24787..38892
off x=37514..111226,y=-45862..25743,z=-16714..54663
off x=25699..97951,y=-30668..59918,z=-15349..69697
off x=-44271..17935,y=-9516..60759,z=49131..112598
on x=-61695..-5813,y=40978..94975,z=8655..80240
off x=-101086..-9439,y=-7088..67543,z=33935..83858
off x=18020..114017,y=-48931..32606,z=21474..89843
off x=-77139..10506,y=-89994..-18797,z=-80..59318
off x=8476..79288,y=-75520..11602,z=-96624..-24783
on x=-47488..-1262,y=24338..100707,z=16292..72967
off x=-84341..13987,y=2429..92914,z=-90671..-1318
off x=-37810..49457,y=-71013..-7894,z=-105357..-13188
off x=-27365..46395,y=31009..98017,z=15428..76570
off x=-70369..-16548,y=22648..78696,z=-1892..86821
on x=-53470..21291,y=-120233..-33476,z=-44150..38147
off x=-93533..-4276,y=-16170..68771,z=-104985..-24507
After running the above reboot steps, 2758514936282235 cubes are on. (Just for fun, 474140 of those are also in the initialization procedure region.)

Starting again with all cubes off, execute all reboot steps. Afterward, considering all cubes, how many cubes are on?

*/
const { Console } = require('console');
var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle22(arrayData);
      });
}

function readRawData(rawData){
    rawData = rawData.replace(/(\r\n|\n|\r)/gm, "\n");
    let stringInstructions = rawData.split("\n");
    let instructions = []
    stringInstructions.forEach(s =>{
        let instruction = [];
        let onPlusNumbers = s.split(" "); // on  +  x=-41..9,y=-7..43,z=-33..15
        instruction.push(onPlusNumbers[0]);
        let ranges = onPlusNumbers[1].split(","); // x=-41..9   +   y=-7..43  +  z=-33..15
        ranges.forEach(range =>{
          let nums = ((range.split("="))[1]).split("..");
          instruction.push( [ parseInt(nums[0]) , parseInt(nums[1]) ] );
        });
        instructions.push(instruction);    
    });
    return instructions;
}

function notInRange(m,M, min, max){
  return m>max || M<min;
}

function filterData(data, limit){
  console.log("filtering by " + limit);
  for(let i = 0; i< data.length; i++){
    let ins = data[i];
    if(
      notInRange(ins[1][0], ins[1][1],-limit,limit) ||
      notInRange(ins[2][0], ins[2][1],-limit,limit) || 
      notInRange(ins[3][0], ins[3][1],-limit,limit)
      ){
        // Completely out of boundaries
        data.splice(i, 1);
        i--;
      }
    // Once the extreme case is discarded, we can adjust to remain on the [-limit, limit] range

    if(ins[1][0] < -limit) ins[1][0] = -limit;
    if(ins[1][1] >  limit) ins[1][1] = limit;    
    if(ins[2][0] < -limit) ins[2][0] = -limit;
    if(ins[2][1] >  limit) ins[2][1] = limit;    
    if(ins[3][0] < -limit) ins[3][0] = -limit;
    if(ins[3][1] >  limit) ins[3][1] = limit;    
  }
}

function compareVector3(pos1, pos2){
  return (pos1[0]==pos2[0] && pos1[1]==pos2[1] && pos1[2]==pos2[2]);
}

function checkPointInPoints(p, points){
  for(let i = 0; i< points.length; i++){
    if(compareVector3(p, points[i])){
      return i;
    }
  }
  return false;
}

function getVolume(range){
  console.log(range);
  return (Math.abs(range[0][1] - range[0][0])+1) * (Math.abs(range[1][1] - range[1][0])+1) * (Math.abs(range[2][1] - range[2][0])+1)
}

function overlappedAxis(r1, r2){
  if(r2[0]> r1[0]){
    return (r2[0]<= r1[1]) 
  } else{
    return (r1[0]<= r2[1]) 
  }
}

function isInsideAxis(r1, r2){
  // Is r1 inside r2? Single dimension
  return r1[0]>=r2[0] && r1[1]<=r2[1];
}

function isInside(r1, r2){
  // Is r1 inside r2?
  let isXinside = r1[0][0]>=r2[0][0] && r1[0][1]<=r2[0][1];
  let isYinside = r1[1][0]>=r2[1][0] && r1[1][1]<=r2[1][1];
  let isZinside = r1[2][0]>=r2[2][0] && r1[2][1]<=r2[2][1];
  return isXinside && isYinside && isZinside;
}

function regionFromInstruction(ins){
  return [ins[1], ins[2], ins[3]]
}

function limitRange(r, x, y, z){
  let range = [...r];
  range[0][0] = Math.max(range[0][0],x[0])
  range[0][1] = Math.min(range[0][1],x[1])
  
  range[1][0] = Math.max(range[1][0],y[0])
  range[1][1] = Math.min(range[1][1],y[1])
  
  range[2][0] = Math.max(range[2][0],z[0])
  range[2][1] = Math.min(range[2][1],z[1])
  return range;
}

function sliceOnAxis(base, other, axis){
  // < instead of <=
  let vols = [];
  let updatedVol = [...base];

  if(other[axis][0] > base[axis][0]){
    let a = [[...updatedVol[0]], [...updatedVol[1]], [...updatedVol[2]]];
    a[axis] = [ base[axis][0] , other[axis][0]-1 ]
    updatedVol[axis] = [ other[axis][0] , updatedVol[axis][1] ]
    vols.push(a);
  }
  // Same, but above
  if(other[axis][1] < base[axis][1]){
    let b = [deepCopy(updatedVol[0]), deepCopy(updatedVol[1]), deepCopy(updatedVol[2])];
    b[axis] = [ other[axis][1]+1 , base[axis][1] ]
    updatedVol[axis] = [ updatedVol[axis][0] , other[axis][1] ]
    vols.push(b);
  }
  return [vols, updatedVol];
}

function deepCopy(currentArray){
  var newArray = [];
  newArray = JSON.parse(JSON.stringify(currentArray));
  return newArray;
}

function diffRegions(rBase, rOther){
  let generatedRegions = [];
  console.log("diffRegions");
  
  let [x1, y1, z1] = [rBase[0], rBase[1], rBase[2]]
  let [x2, y2, z2] = [rOther[0], rOther[1], rOther[2]]

  //if they are not touching we add rBase directly
  if(
    !overlappedAxis(x1, x2) ||
    !overlappedAxis(y1, y2) || 
    !overlappedAxis(z1, z2)
  ) generatedRegions.push(rBase);
  else{
    let otherOL = limitRange(deepCopy(rOther),x1,y1,z1);
    let info,vols, updatedVol;

    //Slice on X axis:
    info = sliceOnAxis(rBase, otherOL, 0)
    vols = info[0];
    updatedVol = info[1];
    vols.forEach(v=>{
      generatedRegions.push(deepCopy(v));
    });
    
    //Slice on Y axis:
    info = sliceOnAxis(updatedVol, otherOL, 1)
    vols = info[0];
    updatedVol = info[1];
    console.log(updatedVol);
    vols.forEach(v=>{
      generatedRegions.push(deepCopy(v));
    });
    
    //Slice on Z axis:
    info = sliceOnAxis(updatedVol, otherOL, 2)
    vols = info[0];
    updatedVol = info[1];
    vols.forEach(v=>{
      generatedRegions.push(deepCopy(v));
    });

  }
  return generatedRegions;
}


function calculateLightsSingleInstruction(ins, regions){
  console.log(ins);
  let r = regionFromInstruction(ins);
  let newRegions = [];
  if(ins[0] == "on"){
    if(regions.length == 0)newRegions.push(r);
    else{
      for(let i=0; i<regions.length; i++){
        let generatedRegions = diffRegions(regions[i], r);
        console.log("generated regions:")
        console.log(generatedRegions)
        console.log("---")
        generatedRegions.forEach(reg=>{
          newRegions.push(reg);
        })
      }
      newRegions.push(r);
    }
  }
  else{
    console.log("We cannot substract... yet")
  }    
  console.log("new Regions:");
  console.log(newRegions);
  console.log("...")
  return newRegions;
}

function getNumberLights(regions){
  let sum = 0;
  regions.forEach(r=>{
    sum += getVolume(r);
  });
  return sum;
}

function puzzle22(inputData){
    filterData(inputData, 50);
    //console.log(inputData);
    
    let n = 0;
    let occupiedRegions = [];
    for(let i = 0; i< inputData.length; i++){
      console.log("STEP --- STEP --- STEP")
      occupiedRegions = calculateLightsSingleInstruction(inputData[i], occupiedRegions);
      console.log(getNumberLights(occupiedRegions));
    }

    console.log("SOLUTION");
    console.log(getNumberLights(occupiedRegions));
}

getData("day22_smallTest.txt");
//getData("day22_testPart2.txt");
//getData("day22_input.txt");
