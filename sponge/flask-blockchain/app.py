import base64
import json
from threading import Thread

from flask import Flask, request
from flask_cors import CORS

from blockchain import Blockchain
from crypt_util import verify_message, sign_message, verify_hash
from data_structure import Transaction

blockchain = Blockchain()


def thread_transaction_picker():
    while True:
        pass


Thread(target=thread_transaction_picker, daemon=True).start()

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def hello():
    return 'Hello World!'


@app.route('/transaction', methods=['POST'])
def post_transaction():
    body = request.get_json()
    txn = Transaction(**body)
    data = {
        'timestamp': txn.timestamp,
        'payload': txn.payload
    }
    # validate txn hash
    assert verify_hash(txn.hash.encode(), json.dumps(data).encode())
    # validate txn signature
    public_key = base64.b64decode(txn.public_key.encode('utf-8'))
    signature = base64.b64decode(txn.signature.encode('utf-8'))
    msg = json.dumps(data).encode()
    assert verify_message(public_key, msg, signature)
    return 'Ok', 200


# CA Server
@app.route('/ca/sign', methods=['POST'])
def post_ca_sign():
    body = request.get_json()
    assert 'message' in [*body]
    with open('keypair/private.pem', 'r') as f:
        k = f.read().encode()
    signature = sign_message(k, body['message'].encode())
    with open('keypair/public.pem', 'rb') as f:
        pub = f.read()
    response = {
        'signature': base64.b64encode(signature).decode('utf-8'),
        'publicKey': base64.b64encode(pub).decode('utf-8'),
    }
    return response, 200


# $ flask run --host=0.0.0.0 --port=5001 --reload
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)
