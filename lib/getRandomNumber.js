function getRandomNumber(digit = 6) {
  let data = "";
  for (let i = 0; i < digit; i++) data += Math.floor(Math.random() * 10);
  return parseInt(data);
}

module.exports = getRandomNumber;
