const { Buffer } = require('buffer');

const hexStringToUintArray = (hexString) => {
  const array = Uint8Array.from(Buffer.from(hexString, 'hex'));
  return array;
};

const uintArrayToHexString = (value) => {
  const hex = Buffer.from(value).toString('hex');
  return hex;
};

module.exports = {
  hexStringToUintArray,
  uintArrayToHexString
}