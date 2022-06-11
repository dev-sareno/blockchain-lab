import { Buffer } from 'buffer';

export const hexStringToUintArray = (hexString: string): Uint8Array => {
  const array = Uint8Array.from(Buffer.from(hexString, 'hex'));
  return array;
};

export const uintArrayToHexString = (value: Uint8Array): string => {
  const hex = Buffer.from(value).toString('hex');
  return hex;
};
