import hashlib
import json
from threading import Thread

from flask import Flask, request
from Crypto.PublicKey import RSA

from blockchain import Blockchain
from crypt_util import verify_message
from data_structure import Transaction

blockchain = Blockchain()


def thread_transaction_picker():
    while True:
        pass


Thread(target=thread_transaction_picker, daemon=True).start()

app = Flask(__name__)


@app.route('/', methods=['GET'])
def hello():
    return 'Hello World!'


@app.route('/transaction', methods=['POST'])
def post_transaction():
    body = request.get_json()
    txn = Transaction(**json.loads(body))
    # validate txn hash
    # validate txn signature
    data = {
        'timestamp': txn.timestamp,
        'payload': txn.payload
    }
    assert verify_message(
        txn.public_key.encode(),
        json.dumps(data).encode(),
        txn.signature.encode()
    )
    return 'Ok', 200


# $ flask run --host=0.0.0.0 --port=5001 --reload
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)
