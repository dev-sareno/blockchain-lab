from typing import List

from pydantic.fields import Field
from pydantic.main import BaseModel


class Transaction(BaseModel):
    timestamp: int = Field(...)
    payload: str = Field(...)
    hash: str = Field(...)
    signature: str = Field(...)
    public_key: str = Field(...)


class Block(BaseModel):
    previous_hash: str = Field(...)
    nonce: int = Field(...)
    timestamp: int = Field(...)
    transactions: List[Transaction]
    merkle_root: str = Field(...)
    miner_address: str = Field(...)
