const crypto = require("crypto");

const key = (settings.PHONE_CERT_KEY || "phone_cerT_token").toString("base64");
function cryptNumber(number) {
  return crypto
    .pbkdf2Sync(formatPhone(number), key, 100000, 64, "sha512")
    .toString("base64");
}
function formatPhone(phone) {
  let PhoneNumber = phone.replace(/[^0-9]/g, "");
  if (PhoneNumber.length !== 11) {
    return throwError("전화번호 형식에 맞지 않습니다.");
  }
  PhoneNumber = `+82${PhoneNumber.slice(1)}`;
  return PhoneNumber;
}
function generateToken(number) {
  const cryptedNumber = cryptNumber(number);
  const payload = {
    number: cryptedNumber,
  };
  const chiper = crypto.createCipher("aes-256-gcm", key);
  let data = chiper.update(JSON.stringify(payload), "utf8", "base64");
  data += chiper.final("base64");

  return data;
}
function verifyToken(token, number) {
  const cryptedNumber = cryptNumber(number);
  const dechiper = crypto.createDecipher("aes-256-gcm", key);
  let data = dechiper.update(token, "base64", "utf8");
  data = JSON.parse(data);

  if (data.number !== cryptedNumber) {
    return false;
  }
  return true;
}

exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
