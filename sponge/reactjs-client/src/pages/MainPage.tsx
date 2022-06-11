import React, { useEffect, useState } from "react";
import { postTransaction } from "../api";
import CryptoJS from "crypto-js";
import secp256k1 from 'secp256k1';
import { hexStringToUintArray, uintArrayToHexString } from "../utility/byte.util";

const privateKeys: string[] = [
  CryptoJS.SHA256('poop').toString(),
  CryptoJS.SHA256('fart').toString(),
];

const MainPage = () => {
  const [timestamp, setTimestamp] = useState<number>(new Date().getTime());
  const [message, setMessage] = useState<string>('');
  const [hash, setHash] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>(privateKeys[0]);
  const [publicKey, setPublicKey] = useState<string>('');
  const [transaction, setTransaction] = useState<string>('');

  useEffect(() => {
    const privateBytes = hexStringToUintArray(privateKey);
    const pubKeyBytes = secp256k1.publicKeyCreate(privateBytes, false);
    const pubKeyHex = uintArrayToHexString(pubKeyBytes)
    setPublicKey(pubKeyHex);

    if (message) {
      const payload = JSON.stringify({
        timestamp: timestamp,
        data: message
      });
      console.log({payload});

      // calculate signature
      const payloadHash = CryptoJS.SHA256(payload).toString();
      console.log({payloadHash});
      const payloadHashBytes = hexStringToUintArray(payloadHash);
      const signerKey = hexStringToUintArray(privateKey);
      const signatureObj = secp256k1.ecdsaSign(payloadHashBytes, signerKey);
      const signatureHex = uintArrayToHexString(signatureObj.signature);
      setSignature(signatureHex);

      
      const msg = 'ab';
      const msgBytes = hexStringToUintArray(msg);
      console.log({msgBytes});
      
      // const msgSig = secp256k1.ecdsaSign(payloadHashBytes, signerKey);

      const txn = {
        payload: payload,
        "header": {
          hash: payloadHash,
          signature: signatureHex,
          publicKey: pubKeyHex
        }
      };
      setTransaction(JSON.stringify(txn));
      setHash(payloadHash);
    } else {
      setHash('');
      setSignature('');
      setTransaction('');
    }
  }, [privateKey, message, timestamp]);

  const onMessageChangedHandler = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    setMessage(value);
  };

  const onPrivateKeySelectedHandler = (e: React.FormEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    setPrivateKey(value);
  };

  const onSubmitClickedHandler = async () => {
    const res = await postTransaction(JSON.parse(transaction));
    console.log({res})
  };

  const onRefreshTimestampClickedHandler = () => {
    setTimestamp(new Date().getTime());
  };

  return (
    <div className={'flex flex-col'}>

      <table>
        <tbody>

        <tr>
          <td>Private key:</td>
          <td>
            <select onChange={onPrivateKeySelectedHandler}>
              {privateKeys.map((v, i) => (
                <option value={v} key={i}>{v}</option>
              ))}
            </select>
          </td>
        </tr>

        <tr>
          <td>Public key:</td>
          <td>
            <textarea value={publicKey} disabled />
          </td>
        </tr>

        <tr>
          <td>Timestamp:</td>
          <td>
            <input type={"text"} value={timestamp.toString()} disabled />
            <span> </span>
            <button onClick={onRefreshTimestampClickedHandler}>Refresh</button>
          </td>
        </tr>

        <tr>
          <td>Message:</td>
          <td>
            <textarea value={message} onChange={onMessageChangedHandler} />
          </td>
        </tr>

        <tr>
          <td>Hash:</td>
          <td>
            <textarea value={hash} disabled />
          </td>
        </tr>

        <tr>
          <td>Signature:</td>
          <td>
            <textarea value={signature} disabled />
          </td>
        </tr>

        <tr>
          <td>Transaction:</td>
          <td>
            <textarea style={{minHeight: '250px'}} value={transaction} disabled />
          </td>
        </tr>

        <tr>
          <td>
            <div>
              <button onClick={onSubmitClickedHandler}>Submit</button>
            </div>
          </td>
        </tr>

        </tbody>
      </table>

    </div>
  )
};

export default MainPage;