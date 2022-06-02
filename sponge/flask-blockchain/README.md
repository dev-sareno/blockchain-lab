# Sponge Blockchain 🧱⛓

## Requirements
- Python 3.8.10

## Facts
* Uses RSA for Key-Pair

## RSA
1. https://wizardforcel.gitbooks.io/practical-cryptography-for-developers-book/content/digital-signatures/rsa-sign-verify-examples.html
2. https://pycryptodome.readthedocs.io/en/latest/src/signature/pkcs1_v1_5.html
3. https://pycryptodome.readthedocs.io/en/latest/src/public_key/rsa.html

## Address Format

### Private Key
A base58 representation of any 256-bit number
#### Format
`base58.encode(hash.sha256(pass_phrase).hexdigest())`

### Public Key
Elliptic Curve Cryptography (ECC). Curve used is `curve.secp256k1`.
#### Format
`"spNg" + base58.encode(hex(point.x).replace('0x', '') + hex(point.y).replace('0x', ''))`

#### Generating address
```
point = ecdsa.generate_public_key(my_private_key, curve='secp256k1')
public_key_formatted = hex(point.x).replace('0x', '') + hex(point.y).replace('0x', '')
public_key_hash = hash.sha256(public_key_formatted)
address = "spNg" + base58.encode(public_key_hash)
```

## ECDSA
1. https://pypi.org/project/fastecdsa/
