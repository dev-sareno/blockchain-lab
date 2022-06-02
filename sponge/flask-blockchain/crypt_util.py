import hashlib
from datetime import datetime
from typing import Tuple

from fastecdsa import keys, curve, ecdsa
from fastecdsa.point import Point
import base58


def generate_keypair(
        pass_phrase: str = datetime.utcnow().isoformat()
) -> Tuple[str, str]:
    """
    creates key-pair
    :return: tuple(private, public)
    """
    # generate private
    h = hashlib.sha256(pass_phrase.encode('utf-8')).hexdigest()
    private = base58.b58encode(h.encode('utf-8')).decode('utf-8')
    # generate public
    d = int(base58.b58decode(private), 16)
    p = keys.get_public_key(d, curve=curve.secp256k1)
    public = base58.b58encode(hex(p.x).replace('0x', '') + hex(p.y).replace('0x', '')).decode('utf-8')
    return private, public


def generate_address(public_key: str) -> str:
    h = hashlib.sha256(public_key.encode('utf-8')).hexdigest()
    address = 'spNg' + base58.b58encode(h.encode('utf-8')).decode('utf-8')
    return address


def sign_message(private_key: str, msg: str) -> Tuple[int, int]:
    """
    signs a message
    :param private_key:
    :param msg:
    :return: signature in bytes
    """
    private_hex = base58.b58decode(private_key)
    r, s = ecdsa.sign(msg, int(private_hex, 16), curve=curve.secp256k1)
    return r, s


def verify_message(public_key: str, msg: str, rs: Tuple[int, int]) -> bool:
    pub = base58.b58decode(public_key.replace('spNg', '')).decode('utf-8')
    print(f'pub={pub}')
    xs = int(pub[:64], 16)
    ys = int(pub[64:], 16)
    point = Point(xs, ys, curve=curve.secp256k1)
    valid = ecdsa.verify(rs, msg, point, curve=curve.secp256k1)
    return valid


def verify_hash(h: bytes, msg: bytes):
    h2 = hashlib.sha256(msg).hexdigest().encode()
    return h2 == h
