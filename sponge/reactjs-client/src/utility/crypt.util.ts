import secp256k1 from 'secp256k1';
import { hexStringToUintArray, uintArrayToHexString } from "../utility/byte.util";
import CryptoJS from 'crypto-js';

export type WordArray = CryptoJS.lib.WordArray;

export const stringToWordArray = (data: string): WordArray => {
    return CryptoJS.enc.Utf8.parse(data);
};

export const hexStringToWordArray = (hexString: string): WordArray => {
    return CryptoJS.enc.Hex.parse(hexString);
};

export const wordArrayToUint8Array = (data: WordArray): Uint8Array => {
    const hex = data.toString(CryptoJS.enc.Hex);
    const uint8Array = Uint8Array.from(Buffer.from(hex, 'hex'));
    return uint8Array;
};

export const getHash = (data: string): string => {
    return CryptoJS.SHA256(data).toString();
};

export const getPublicKey = (privateKeyHex: string): string => {
    const privateKeyUint8Array = hexStringToUintArray(privateKeyHex);
    const publicKeyUint8Array = secp256k1.publicKeyCreate(privateKeyUint8Array, false);
    const publicKeyHex = uintArrayToHexString(publicKeyUint8Array);
    return publicKeyHex;
};

export const signData = (privateKeyHex: string, data: string): string => {
    const privateKeyUint8Array = hexStringToUintArray(privateKeyHex);
    const dataHashHex = getHash(data);
    const dataHashUint8Array = hexStringToUintArray(dataHashHex);
    const signature = secp256k1.ecdsaSign(privateKeyUint8Array, dataHashUint8Array);
    const signatureHex = uintArrayToHexString(signature.signature);
    return signatureHex;
};

export const verifySignature = (
    signatureHex: string,
    messageHex: string,
    publicKeyHex: string
): boolean => {
    const signatureUint8Array = hexStringToUintArray(signatureHex);
    const messageHexUint8Array = hexStringToUintArray(messageHex);
    const publicKeyHexUint8Array = hexStringToUintArray(publicKeyHex);
    return secp256k1.ecdsaVerify(signatureUint8Array, messageHexUint8Array, publicKeyHexUint8Array);
};