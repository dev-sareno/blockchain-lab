# save this as app.py
from crypt import methods
from flask import Flask, request
import hashlib
import json


class Blockchain:
    # block(
    #   previous_hash,
    #   nonce,
    #   data,
    #   hash,
    # )

    def __init__(self) -> None:
        self.chain = []

        # create the first block
        first_block = self.mine_block(
            '0' * 64,  # genesis block
            'This is the first block'
        )
        self.chain.append(first_block)
    
    def create_new_block(self, previous_hash, nonce, data):
        block = {
            'previous_hash': previous_hash,
            'nonce': nonce,
            'data': data,
            'hash': None
        }
        return block
    
    def get_last_block(self,):
        return self.chain[-1]
    
    def get_hash(self, block):
        return hashlib.sha256(json.dumps(block, sort_keys=True).encode()).hexdigest()
    
    def mine_block(self, previous_hash, data):
        nonce = 1  # to make it simple, let's start at 1
        while True:
            new_block = self.create_new_block(
                previous_hash=previous_hash,
                nonce=nonce,
                data=data,
            )
            proof_of_work = self.get_hash(new_block)
            if proof_of_work[:4] != '0000':
                nonce += 1  # increment by 1
            else:
                new_block['hash'] = proof_of_work
                return new_block
    
    def add_new_block(self, block):
        self.chain.append(block)
    
    def get_chain(self):
        return json.dumps(self.chain, indent=4)
        


blockchain = Blockchain()


app = Flask(__name__)

@app.route("/get-chain", methods=['GET'])
def get_chain():
    return blockchain.get_chain()

@app.route("/mine-block", methods=['POST'])
def min_block():
    data = request.data.decode('utf-8')
    latest_block = blockchain.get_last_block()
    print(latest_block)
    block = blockchain.mine_block(latest_block['hash'], data)
    print(block['hash'])
    blockchain.add_new_block(block)
    return block
