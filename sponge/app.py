import time
from threading import Thread
from flask import Flask, request, jsonify

from blockchain import Blockchain
from data_structure import Transaction

blockchain = Blockchain()


def thread_transaction_picker():
    while True:
        if len(blockchain.transactions) > 0:
            txn = blockchain.transactions.pop()
            blk = blockchain.get_latest_block()
            res = blockchain.mine_block(blk.hash, [txn])
            blockchain.chain.append(res)


Thread(target=thread_transaction_picker, daemon=True).start()

app = Flask(__name__)


@app.route('/hello', methods=['GET'])
def hello():
    return 'Hello World!'


@app.route('/chain', methods=['GET'])
def get_chain():
    return jsonify(blockchain.get_chain()), 200


@app.route("/create-transaction", methods=['POST'])
def create_transaction():
    body = request.get_json()
    # validate transaction
    if body.get('timestamp') is None:
        return 'Bad request', 400
    if body.get('txn_from') is None:
        return 'Bad request', 400
    if body.get('txn_to') is None:
        return 'Bad request', 400
    if body.get('amount') is None:
        return 'Bad request', 400
    if body.get('metadata') is None:
        return 'Bad request', 400
    if body.get('hash') is None:
        return 'Bad request', 400
    if body.get('block_signature') is None:
        return 'Bad request', 400
    if body.get('public_key') is None:
        return 'Bad request', 400

    # TODO: verify transaction

    txn = Transaction(
        timestamp=body['timestamp'],
        txn_from=body['txn_from'],
        txn_to=body['txn_to'],
        amount=body['amount'],
        metadata=body['metadata'],
        hash=body['hash'],
        block_signature=body['block_signature'],
        public_key=body['public_key'],
    )
    blockchain.add_transaction(txn)
    return jsonify(txn.dict()), 200


# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)
