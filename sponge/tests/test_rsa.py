import hashlib

from crypt_util import generate_rsa_keypair, sign_message, verify_message, verify_hash


def test_should_generate_key_pair():
    private, public = generate_rsa_keypair()
    assert len(private.decode('utf-8')) > 0
    assert len(public.decode('utf-8')) > 0


def test_should_sign_and_verify_message():
    # generate key-pair first
    private, public = generate_rsa_keypair()
    message = b'Hello World!'
    # sign
    signature = sign_message(private, message)
    # verify
    verified = verify_message(public, message, signature)
    assert verified


def test_should_match_hash():
    message = b'Hello World!'
    # create a hash using hashlib
    h = hashlib.sha256(message).hexdigest().encode()
    assert verify_hash(h, message)  # uses non-hashlib library
