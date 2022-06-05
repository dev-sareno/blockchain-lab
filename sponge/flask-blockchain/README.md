# Sponge Blockchain 🧱⛓

## Requirements
1. Python 3.8.10
1. Elliptic Curve Digital Signature Algorithm (ECDSA)
1. Secp256k1 curve

### Private Key
TODO:

### Public Key
TODO:

### Address
TODO:

## References
1. [https://pypi.org/project/ecdsa/](https://pypi.org/project/ecdsa/)

## Scratch
```py
import hashlib
from ecdsa import SigningKey, SECP256k1, VerifyingKey
# b'\x1f\x9d\xce^J\xeb\n\xab\x7f%\xbb\xe8]\xfdG\x1c\xfc\xf6\xd1\x1a\x04\xd0\xdd\'q\xa5\xe0{\x88c\\\x18)\x87t\x10\xf6W"}\xc3\xdc3t\x97\xe3\xe4\x92'
import base58
base58.b58decode

def main():
    # pub = '04807f9469f86a45561f8cd70cea3b36f04602a95d5c855f74cbcd4ff5d7f6a5212aaa2e011f28c5c9a0a32013adee741400a3f064d43bda3f2f74cdc8f72ff617'
    # # # sk = SigningKey.generate(curve=NIST384p)
    # # vk = bytes.fromhex(pub)
    # vk = VerifyingKey.from_string(bytes.fromhex(pub), curve=SECP256k1)
    # signature = bytes.fromhex('9710d70ca5c73c0ca21688782d158d1c3892eef68063a4df83405c80f009192c5e90337b28bbeef1d13868d2033c0c005771da3b18cbbf87eb9c2d7fb3cc1093')
    # assert vk.verify(signature, b"{\"timestamp\":1654393113537,\"data\":\"a\"}", hashfunc=hashlib.sha256)
    # print('verified')

    sk = SigningKey.generate() # uses NIST192p
    vk = sk.verifying_key
    signature = sk.sign(b"message")
    assert vk.verify(signature, b"message")


if __name__ == "__main__":
    main()
```