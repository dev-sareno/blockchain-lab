import json
import os
import uuid
from datetime import datetime
from typing import List
import hashlib

from data_structure import Block, Transaction


miner_address: str = os.getenv('SPONGE_MINER_ADDRESS', str(uuid.uuid4()))
mining_difficulty: str = '0000'


class Blockchain:
    def __init__(self):
        first_block = self.mine_block('0' * 64, [])
        self.chain = [first_block]
        self.transactions = []
        self.network = []

    @staticmethod
    def is_chain_valid(chain: List[Block]):
        for block in chain:
            blk_copy = Block(
                previous_hash=block.previous_hash,
                nonce=block.nonce,
                timestamp=block.timestamp,
                transactions=block.transactions,
            )
            blk_json: str = blk_copy.json(exclude_none=True)
            blk_hash: str = hashlib.sha256(blk_json.encode()).hexdigest()
            if blk_hash != block.hash:
                return False
        return True

    @staticmethod
    def mine_block(previous_hash: str, transactions: List[Transaction]):
        nonce: int = 1
        print('mining block...')
        while True:
            block = Block(
                previous_hash=previous_hash,
                nonce=nonce,
                timestamp=int(datetime.utcnow().timestamp()),
                transactions=transactions,
            )
            blk_json: str = block.json(exclude_none=True)
            blk_hash: str = hashlib.sha256(blk_json.encode()).hexdigest()
            if blk_hash[:4] == mining_difficulty:
                block.miner_address = miner_address
                block.hash = blk_hash
                print(f'new block has been mined; hash={blk_hash}')
                return block
            nonce += 1

    def add_transaction(self, txn: Transaction):
        # TODO: validate transaction
        self.transactions.append(txn)

    def get_chain(self):
        return {
            'length': len(self.chain),
            'chain': [x.dict() for x in self.chain]
        }

    def get_transactions(self):
        return {
            'length': len(self.transactions),
            'transactions': [x.dict() for x in self.transactions]
        }

    def get_latest_block(self):
        return self.chain[-1]

    def connect(self, node_address: str):
        # get requestee's IP:Port address
        # send the network details
        network_data = json.dumps(self.network)
        self.network.append(node_address)  # add to network
        return network_data
