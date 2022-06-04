import { Buffer } from 'buffer';

export const hexStringToUintArray = (hexString: string): Uint8Array => {
  const hex = Uint8Array.from(Buffer.from(hexString, 'hex'));
  return hex;
};

export const uintArrayToHexString = (value: Uint8Array): string => {
  const backToHexString = Buffer.from(value).toString('hex');
  return backToHexString;
};
