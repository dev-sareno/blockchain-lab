import os
import socket
from data_structure import Block, Transaction


miner_address: str = os.getenv('SPONGE_MINER_ADDRESS', socket.gethostname())
mining_difficulty: str = '000'


class Blockchain:
    def __init__(self):
        self.transactions = []

    def add_transaction(self, txn: Transaction):
        self.transactions.append(txn)
