import hashlib
from datetime import datetime
from typing import Tuple

from ecdsa import SigningKey, SECP256k1, VerifyingKey
import base58


def generate_keypair(
        pass_phrase: str = datetime.utcnow().isoformat()
) -> Tuple[str, str]:
    """
    creates key-pair
    :return: tuple(private, public)
    """
    # generate private
    pass_phrase_hash = hashlib.sha256(pass_phrase.encode('utf-8')).hexdigest()
    sk = SigningKey.from_string(bytes.fromhex(pass_phrase_hash), curve=SECP256k1)
    vk = sk.verifying_key
    return sk.to_string().hex(), '04' + vk.to_string().hex()  # prefix 04 means uncompressed public key


def generate_address(public_key: str) -> str:
    hash = hashlib.sha256(public_key.encode('utf-8')).hexdigest()
    address = 'spNg' + base58.b58encode(hash.encode('utf-8')).decode('utf-8')
    return address


def sign_message(private_key: str, msg: str) -> str:
    """
    signs a message
    :param private_key:
    :param msg:
    :return: signature in bytes
    """
    sk = SigningKey.from_string(bytes.fromhex(private_key), curve=SECP256k1)
    signature = sk.sign(msg.encode('utf-8')).hex()
    return signature


def verify_message(public_key: str, signature: str, msg: str) -> bool:
    print(signature)
    pub = bytes.fromhex(public_key)
    vk = VerifyingKey.from_string(pub, curve=SECP256k1)
    sig = bytes.fromhex(signature)
    return vk.verify(sig, msg.encode('utf-8'))


def verify_hash(h: str, msg: bytes):
    h2 = hashlib.sha256(msg).hexdigest()
    return h2 == h
