import pdb
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
from enum import Enum
import datetime


class StatusEnum(str, Enum):
    ACTIVE = "ACTIVE"       # item is not in the past and was not marked "COMPLETE" or "CANCELLED"
    INACTIVE = "INACTIVE"   # item is in the past without explicit marking as either "COMPLETE" or "CANCELLED"
    COMPLETED = "COMPLETED"   # item is marked as done BEFORE while ACTIVE
    CANCELLED = "CANCELLED" # item is marked as CANCELLED while ACTIVE
    # there is no current status for "DELETED" -> is actually removed/deleted


class Item(BaseModel):

    id: int
    item: str
    status: StatusEnum = StatusEnum.ACTIVE
    created_on: str = None
    target_on: str = None # error parsing date string

    def __init__(self, **data):
        super().__init__(**data)
        if self.created_on is None:
            # self.created_on = datetime.datetime.now()
            dateobj = datetime.datetime.now()
            self.created_on = dateobj.strftime('%m/%d/%Y')

        # Target Due
        if self.target_on is None:
            self.target_on = self.created_on

    def update_values(self, values: dict):
        for key, value in values.items():
            setattr(self, key, value)
        self.modified_on = datetime.datetime.now()

    def update_attributes(self, item: 'Item'):
        # for field, value in item.dict(exclude_unset=True).items():
        for field, value in item.dict(exclude_unset=False).items():
            setattr(self, field, value)
        self.modified_on = datetime.datetime.now()

