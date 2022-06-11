import CryptoJS from "crypto-js";
import { getHash, getPublicKey, signData, verifySignature } from './utility/crypt.util';

test('should have correct hash', () => {
  const data = 'Hello';
  const hash = getHash(data);
  expect(hash.length).toBe(32 * 2);
  expect(hash).toBe('185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969');
});

test('test should have correct signature', () => {
  const privateKeyHex = getHash('root!');
  console.log({private: privateKeyHex});

  const payload = '';
  const msgHex = getHash(payload);
  console.log({msgHex});

  const publicKeyHex = getPublicKey(privateKeyHex);
  console.log({publicKeyHex});

  const signature = signData(privateKeyHex, payload);
  console.log({signature});
});
