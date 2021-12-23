/*



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

function puzzle19(inputData){
    console.log(inputData);
    console.log("SOLUTION");

}

getData("day19_test.txt");
//getData("day19_input.txt");
