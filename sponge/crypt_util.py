from typing import Tuple

from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256


def generate_rsa_keypair() -> Tuple[bytes, bytes]:
    """
    creates key-pair
    :return: tuple(private, public)
    """
    key = RSA.generate(2048)
    return key.export_key('PEM'), key.public_key().export_key('PEM')


def sign_message(private_key: bytes, msg: bytes) -> bytes:
    """
    signs a message
    :param private_key:
    :param msg:
    :return: signature in bytes
    """
    k = RSA.import_key(private_key)
    cipher = pkcs1_15.new(k)
    # create message's hash
    h = SHA256.new(msg)
    signature = cipher.sign(h)
    return signature


def verify_message(public_key: bytes, msg: bytes, signature: bytes):
    k = RSA.import_key(public_key)
    # create message's hash
    h = SHA256.new(msg)
    try:
        pkcs1_15.new(k).verify(h, signature)
        return True
    except (ValueError, TypeError):
        return False


def verify_hash(h: bytes, msg: bytes):
    h2 = SHA256.new(msg).hexdigest().encode()
    return h2 == h
