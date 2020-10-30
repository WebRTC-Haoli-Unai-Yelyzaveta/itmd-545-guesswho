
//Returns as many random characters as specified in 'length' parameter
function getRandomChars(length){
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  var lengthAlphabet = alphabet.length;
  var result = "";
  for (var i=0; i< length; i++){
    result+= alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return result;
}

//Returns a room code formed with three strings of random characters of the specified length in 'segments'
// and two separators
function getRoom(...segments){
  //concatenate random chars with "-" separator to create the room
  var room = getRandomChars(segments[0]) + "-" + getRandomChars(segments[1]) + "-" + getRandomChars(segments[2]);
  return room;
}

//export the getRoom function
module.exports = {getRoom};
