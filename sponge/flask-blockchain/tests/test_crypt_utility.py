import hashlib

from crypt_util import generate_keypair, sign_message, verify_message, verify_hash, generate_address


def test_should_generate_correct_key_pair():
    private, public = generate_keypair('do not eat poop')
    assert private == '4d3dacf3627c1fb2431ebc9ede906142e41781323640e68a4807c63a81aa5c9a'
    assert public == '047657acefc0f0358efcfda3a0d2cf6d8212a5a1693c7213e1c3ca5035f4d4f5781041b8d18f0c967a1a31cefbaf52508a4e0f6c40f5d04d6482f17a73e50ca5f6'


def test_should_generate_correct_address():
    public = '047657acefc0f0358efcfda3a0d2cf6d8212a5a1693c7213e1c3ca5035f4d4f5781041b8d18f0c967a1a31cefbaf52508a4e0f6c40f5d04d6482f17a73e50ca5f6'
    address = generate_address(public)
    assert address == 'spNg21EN4hs5NUprKGGo4Pyeocf9dG225kovCykGextGsSJn9NkKBXoHNTqYk18vshRb9ivD8dEfgaruNNW96UHQmFg7'


def test_should_sign_and_verify_message():
    # generate key-pair first
    private, public = generate_keypair('do not eat poop')
    message = 'Hello World!'
    # sign
    signature = sign_message(private, message)
    # signature is unique everytime it is generated unlike hashing so we can'r assert the signature with static value
    # verify
    verified = verify_message(public, signature, message)
    assert verified


def test_should_match_hash():
    message = b'Hello World!'
    # create a hash using hashlib
    h = hashlib.sha256(message).hexdigest().encode()
    assert verify_hash(h, message)  # uses non-hashlib library
