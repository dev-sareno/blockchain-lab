from typing import List, Optional

from pydantic.fields import Field
from pydantic.main import BaseModel


class Transaction(BaseModel):
    # payload
    timestamp: int = Field(...)
    txn_from: str = Field(...)
    txn_to: str = Field(...)
    amount: float = Field(...)
    metadata: Optional[str] = Field(default=None)
    # header
    hash: Optional[str] = Field(default=None)
    block_signature: str = Field(...)
    public_key: str = Field(...)


class Block(BaseModel):
    # payload
    timestamp: int = Field(...)
    previous_hash: str = Field(...)
    nonce: int = Field(...)
    transactions: List[Transaction]
    # header
    miner_address: Optional[float] = Field(default=None)
    hash: Optional[str] = Field(default=None)
