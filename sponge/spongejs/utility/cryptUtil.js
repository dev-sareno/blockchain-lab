const secp256k1 = require('secp256k1');
const { hexStringToUintArray, uintArrayToHexString } = require("../utility/byteUtil.js");
const CryptoJS = require('crypto-js');

const stringToWordArray = (data) => {
    return CryptoJS.enc.Utf8.parse(data);
};

const hexStringToWordArray = (hexString) => {
    return CryptoJS.enc.Hex.parse(hexString);
};

const wordArrayToUint8Array = (data) => {
    const hex = data.toString(CryptoJS.enc.Hex);
    const uint8Array = Uint8Array.from(Buffer.from(hex, 'hex'));
    return uint8Array;
};

const getHash = (data) => {
    return CryptoJS.SHA256(data).toString();
};

const getPublicKey = (privateKeyHex) => {
    const privateKeyUint8Array = hexStringToUintArray(privateKeyHex);
    const publicKeyUint8Array = secp256k1.publicKeyCreate(privateKeyUint8Array, false);
    const publicKeyHex = uintArrayToHexString(publicKeyUint8Array);
    return publicKeyHex;
};

const signData = (privateKeyHex, data) => {
    const privateKeyUint8Array = hexStringToUintArray(privateKeyHex);
    const dataHashHex = getHash(data);
    const dataHashUint8Array = hexStringToUintArray(dataHashHex);
    const signature = secp256k1.ecdsaSign(privateKeyUint8Array, dataHashUint8Array);
    const signatureHex = uintArrayToHexString(signature.signature);
    return signatureHex;
};

const verifySignature = (
    signatureHex,
    messageHex,
    publicKeyHex
) => {
    const signatureUint8Array = hexStringToUintArray(signatureHex);
    const messageHexUint8Array = hexStringToUintArray(messageHex);
    const publicKeyHexUint8Array = hexStringToUintArray(publicKeyHex);
    return secp256k1.ecdsaVerify(signatureUint8Array, messageHexUint8Array, publicKeyHexUint8Array);
};

module.exports = {
    stringToWordArray,
    hexStringToWordArray,
    wordArrayToUint8Array,
    getHash,
    getPublicKey,
    signData,
    verifySignature,
}