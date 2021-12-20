/*
--- Part Two ---
Now that you have the structure of your transmission decoded, you can calculate the value of the expression it represents.

Literal values (type ID 4) represent a single number as described above. The remaining type IDs are more interesting:

Packets with type ID 0 are sum packets - their value is the sum of the values of their sub-packets. 
If they only have a single sub-packet, their value is the value of the sub-packet.

Packets with type ID 1 are product packets - their value is the result of multiplying together the values of their sub-packets. 
                                             If they only have a single sub-packet, their value is the value of the sub-packet.
Packets with type ID 2 are minimum packets - their value is the minimum of the values of their sub-packets.
Packets with type ID 3 are maximum packets - their value is the maximum of the values of their sub-packets.
Packets with type ID 5 are greater than packets - their value is 1 if the value of the first sub-packet is 
                                                  greater than the value of the second sub-packet; otherwise, 
                                                  their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 6 are less than packets - their value is 1 if the value of the first sub-packet is less than the value of the second sub-packet; 
                                               otherwise, their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 7 are equal to packets - their value is 1 if the value of the first sub-packet is equal to the value of the second sub-packet; 
                                              otherwise, their value is 0. These packets always have exactly two sub-packets.


Using these rules, you can now work out the value of the outermost packet in your BITS transmission.
For example:
C200B40A82 finds the sum of 1 and 2, resulting in the value 3.
04005AC33890 finds the product of 6 and 9, resulting in the value 54.
880086C3E88112 finds the minimum of 7, 8, and 9, resulting in the value 7.
CE00C43D881120 finds the maximum of 7, 8, and 9, resulting in the value 9.
D8005AC2A8F0 produces 1, because 5 is less than 15.
F600BC2D8F produces 0, because 5 is not greater than 15.
9C005AC2F8F0 produces 0, because 5 is not equal to 15.
9C0141080250320F1802104A08 produces 1, because 1 + 3 = 2 * 2.
What do you get if you evaluate the expression represented by your hexadecimal-encoded BITS transmission?
*/

var fs = require('fs');

function getData(filename){
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        let arrayData = readRawData(data);
        puzzle16(arrayData);
      });
}

function readRawData(rawData){
    return rawData;
}

function hexToBinary(str){
    let bin = [];
    for(let i = 0; i< str.length; i++){
        let bits = (parseInt(str[i], 16).toString(2)).padStart(4, '0');
        for(let j = 0; j< bits.length; j++){
            bin.push(parseInt(bits[j]));
        }        
    }
    return bin;
}

function removeHead(bitArray,n){
    bitArray.splice(0,n);
    return bitArray;
}

function getNumberFromBits(bits){
   let sum = 0;
   for(let n = 0 ; n<bits.length ; n++){
       sum += (parseInt(bits[bits.length-n-1]) * (2**n));
   }
   return sum;
}

function getNFirstValues(data, n, remove = false, convert  = true){
    let ret = [];
    for (let i = 0; i<n; i++) ret.push(data[i]);
    if(convert) ret = getNumberFromBits(ret);
    if(remove) removeHead(data,n);
    return ret;
}

function decodeBits(data){
    let version = getNFirstValues(data, 3, true); // doesn't matter for this second part
    let typeID = getNFirstValues(data, 3, true);
    let values = [];
    let value = 0;

    if(typeID == 4){ // VALUE
        let bytes = [];
        let ngroups = Math.floor(data.length/5); // ERROR
        while(data[0] == 1){
            for(let j = 1 ; j<5; j++){
                bytes.push(data[j]);
            }
            removeHead(data,5);
        };
        // Last chunk where data[0] == 0
        for(let j = 1 ; j<5; j++){
            bytes.push(data[j]);
        }
        removeHead(data,5);

        //console.log(getNumberFromBits(bytes));
        value = getNumberFromBits(bytes);
    }
    else{ // OPERATOR
        
        let lengthTypeID = getNFirstValues(data, 1, true);
        if(lengthTypeID == 0){
            // the next 15 bits are a number that represents the total length in bits
            let totalLength = getNFirstValues(data, 15, true);
            let initialLength = data.length;
            do{
                values.push(decodeBits(data));
            }while(initialLength - data.length < totalLength)
        } else{
            // the next 11 bits are a number that represents the number of sub-packets immediately contained
            let totalNumber = getNFirstValues(data, 11, true);
            for(let i = 0; i< totalNumber; i++){
                values.push(decodeBits(data));
            }
        }

        if(typeID == 0){ //SUM
            value = 0;
            for( let i = 0; i< values.length; i++){
                value += values[i];
            }
        }
        if(typeID == 1){ //PRODUCT
            value = 1;
            for( let i = 0; i< values.length; i++){
                value *= values[i];
            }
            
        }
        if(typeID == 2){ //MIN
            value = Infinity;
            for( let i = 0; i< values.length; i++){
                value = Math.min(value,values[i]);
            }           
        }
        if(typeID == 3){ //MAX
            value = -Infinity;
            for( let i = 0; i< values.length; i++){
                value = Math.max(value,values[i]);
            }            
        }
        if(typeID == 5){ //GREATER THAN
            value = (values[0] > values[1])? 1 : 0;            
        }
        if(typeID == 6){ //LESS THAN
            value = (values[0] < values[1])? 1 : 0;            
        }
        if(typeID == 7){ //EQUAL TO
            value = (values[0] == values[1])? 1 : 0;            
        }
    }
    return value;
}

function puzzle16(inputData){  
    let binaryData = hexToBinary(inputData);
    console.log(inputData);
    //console.log(""+binaryData.join(""));
    let value = decodeBits(binaryData);  


    console.log("SOLUTION");
    console.log(value);
}

//puzzle16("C200B40A82")
//puzzle16("04005AC33890")
//puzzle16("880086C3E88112")
//puzzle16("CE00C43D881120")
//puzzle16("D8005AC2A8F0")
//puzzle16("F600BC2D8F")
//puzzle16("9C005AC2F8F0")
//puzzle16("9C0141080250320F1802104A08")
getData("day16_input.txt");
