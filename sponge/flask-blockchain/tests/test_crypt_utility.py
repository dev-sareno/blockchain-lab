import hashlib

from crypt_util import generate_keypair, sign_message, verify_message, verify_hash, generate_address


def test_should_generate_correct_key_pair():
    private, public = generate_keypair('do not eat poop')
    assert private == '23khNa24apaujVhWTLWGEETtDCgdXrFCBFsCYx9rg8AhmGYMuE8uSTNCi4vTE' \
                      'VVdGb9fX1Z4F81yuDGV7beb3DRr'
    assert public == '6eh4mkPxACW5agtsywhNaPmFTWUYzPRZGbHVka8pE5V71y7En6ksBRe88aZifBAZdGxm' \
                     'ArD795rj2tv74jger7K796itQcKTy2eJnQQrGq1Njkenogd1QQm6eoyfGoebMqf3dvaFzif' \
                     'pH3nttgs4AiNkzZ9hqJj9gvmAL3fmAKMsX7K'


def test_should_generate_correct_address():
    public = '6eh4mkPxACW5agtsywhNaPmFTWUYzPRZGbHVka8pE5V71y7En6ksBRe88aZifBAZdGxm' \
             'ArD795rj2tv74jger7K796itQcKTy2eJnQQrGq1Njkenogd1QQm6eoyfGoebMqf3dvaFzif' \
             'pH3nttgs4AiNkzZ9hqJj9gvmAL3fmAKMsX7K'
    address = generate_address(public)
    assert address == 'spNg264jXCfovDvuHxRifp3APaa4S6oVyzVMbsB5KHWja7qV9cXAJPE5SvuEY' \
                      'QdE7u2hDrawUKy1ALbfCj7f8GbDUp6q'


def test_should_sign_and_verify_message():
    # generate key-pair first
    private, public = generate_keypair('do not eat poop')
    message = 'Hello World!'
    # sign
    r, s = sign_message(private, message)
    # verify
    verified = verify_message(public, message, (r, s))
    assert verified


def test_should_match_hash():
    message = b'Hello World!'
    # create a hash using hashlib
    h = hashlib.sha256(message).hexdigest().encode()
    assert verify_hash(h, message)  # uses non-hashlib library
