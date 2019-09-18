var fs = require('fs');

var lineDataCheck = [];
var lineData = [];
var isIncludedLineDataCheck = false;
function readLinesAndWriteFileDataCheck(input, output) {
  file = fs.createReadStream(input);
  var remaining = '';

  file.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      extractLineDataCheck(line);
      index = remaining.indexOf('\n');
    }
  });
  file.on('end', function() {
    if (remaining.length > 0) {
      extractLineDataCheck(remaining);
    }
    lineData.push(calcFileDataCheck());
    writeFile(output);
  });
}

function extractLineDataCheck(line) {
  var pos = line.lastIndexOf(",");
  if(pos != -1)// if pos is -1, the line is not data.
    if(isIncludedLineDataCheck){
      lineDataCheck.push(line.substring(pos + 1).trim());
      lineData.push(line);
    }
    else{
      var value = calcLineDataCheck(line);
      lineDataCheck.push(value);
      lineData.push(line.trim() + "," + value);
    }
  else
    lineData.push(line);
}

function calcLineDataCheck(line){
  console.log(`data: ${line}`);
  var ret = 0;
  //calculate Line Check Sum
  for (var i = 0; i < line.length; i++) {
    ret += getCode(line.charAt(i));
  }
  ret = ret & 0xFF;
  // calculate Line Data Check
  ret = circularShiftLeft(ret);
  // bitwise XOR operation with the hexadecimal value 96
  ret = ret ^ 0x96;
  console.log(`ret: ${ret.toString(16)}`);
  return ret.toString(16).padStart(2, '0');
}

function getCode(char){
  switch(char){
    case "1": return  1;
    case "2": return	2;
    case "3": return	3;
    case "4": return	4;
    case "5": return	5;
    case "6": return	6;
    case "7": return	7;
    case "8": return	8;
    case "9": return	9;
    case "A": return	17;
    case "B": return	18;
    case "C": return	19;
    case "D": return	20;
    case "E": return	21;
    case "F": return	22;
    case "G": return	23;
    case "H": return	24;
    case "I": return	25;
    case "J": return	26;
    case "K": return	27;
    case "L": return	28;
    case "M": return	29;
    case "N": return	30;
    case "O": return	31;
    case "P": return	32;
    case "Q": return	33;
    case "R": return	34;
    case "S": return	35;
    case "T": return	36;
    case "U": return	37;
    case "V": return	38;
    case "W": return	39;
    case "X": return	40;
    case "Y": return	41;
    case "Z": return	42;
    case "a": return	49;
    case "b": return	50;
    case "c": return	51;
    case "d": return	52;
    case "e": return	53;
    case "f": return	54;
    case "g": return	55;
    case "h": return	56;
    case "i": return	57;
    case "j": return	58;
    case "k": return	59;
    case "l": return	60;
    case "m": return	61;
    case "n": return	62;
    case "o": return	63;
    case "p": return	64;
    case "q": return	65;
    case "r": return	66;
    case "s": return	67;
    case "t": return	68;
    case "u": return	69;
    case "v": return	70;
    case "w": return	71;
    case "x": return	72;
    case "y": return	73;
    case "z": return	74;
    default:  return  0;
  }
}

function calcFileDataCheck(){
  var ret = 0;
  //calculate File Check Sum
  lineDataCheck.forEach(_data => {
    console.log(`_data: ${_data}`);
    console.log(`parseInt: ${parseInt(_data, 16)}`);
    ret += parseInt(_data, 16);
  });
  //extract lower two 8-bit byte values
  ret = ret & 0xFFFF;
  // three consecutive circular shift left (aka rotate no carry -left) operations on each 8-bit bytes of the value
  var highByte = ret & 0xFF00;
  highByte = highByte >> 8;
  highByte = circularShiftLeft(highByte);
  highByte = circularShiftLeft(highByte);
  highByte = circularShiftLeft(highByte);
  highByte = highByte << 8;

  var lowByte = ret & 0x00FF;
  lowByte = circularShiftLeft(lowByte);
  lowByte = circularShiftLeft(lowByte);
  lowByte = circularShiftLeft(lowByte);

  ret = highByte + lowByte;
  // A bitwise XOR operation with the hexadecimal value 969C
  ret = ret ^ 0x969C;
  return ret.toString(16).padStart(4, '0');
}

function circularShiftLeft(num){
  var ret = 0;
  ret = num << 1;
  ret = ret & 0xFF;
  var highestBit = num & 0x80;
  highestBit = highestBit >> 7;
  ret = ret + highestBit;
  return ret;
}

function writeFile(output){
  var file = fs.createWriteStream(output);
  file.on('error', function(err) { console.log(err) });
  lineData.forEach((line) => { 
    file.write(line + '\n'); 
  });
  file.end();
}

readLinesAndWriteFileDataCheck('test.csv', 'test1.csv');
