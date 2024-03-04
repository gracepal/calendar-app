import pdb
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field, validator
from enum import Enum
import datetime
import uuid
import time
import os
import random

TEST_MODE = True
test_id = 0

def get_unique_id():
    if TEST_MODE:
        global test_id
        test_id += 1
        return f's{test_id}'

    # unique_id = uuid.uuid4()
    process_id = os.getpid()
    timestamp = int(time.time())
    random_num = random.randint(1, 1_000_000)
    unique_id = f'{timestamp}-{process_id}-{random_num}'
    return unique_id

class StatusEnum(str, Enum):
    ACTIVE = "ACTIVE"       # item is not in the past and was not marked "COMPLETE" or "CANCELLED"
    INACTIVE = "INACTIVE"   # item is in the past without explicit marking as either "COMPLETE" or "CANCELLED"
    COMPLETED = "COMPLETED"   # item is marked as done BEFORE while ACTIVE
    CANCELLED = "CANCELLED" # item is marked as CANCELLED while ACTIVE
    # there is no current status for "DELETED" -> is actually removed/deleted


class Item(BaseModel):
    id: str = None
    item: str
    status: StatusEnum = StatusEnum.ACTIVE
    created_on: str = None
    target_on: str = None # error parsing date string

    def __init__(self, **data):
        super().__init__(**data)

        if self.id is None:
            self.id = get_unique_id()

        if self.created_on is None:
            # self.created_on = datetime.datetime.now()
            dateobj = datetime.datetime.now()
            self.created_on = dateobj.strftime('%m/%d/%Y')

        # Target Due
        if self.target_on is None:
            self.target_on = self.created_on

    def update_values(self, values: dict):
        # if 'id' in values and values['id'] != self.id:
        #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot change item ID.")

        if 'created_on' in values and values['created_on'] != self.created_on:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot rewrite history.")

        for key, value in values.items():
            setattr(self, key, value)

    # TODO: TBD Cannot use this, issue with id changing, id error, etc
    # def update_attributes(self, item: 'Item'):
    #     # if item.id != self.id:
    #     #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot change item ID.")

    #     if item.created_on != self.created_on:
    #         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot rewrite history.")

    #     # TODO: revisit exclude_unset
    #     # for field, value in item.dict(exclude_unset=True).items():
    #     for field, value in item.dict(exclude_unset=False).items():
    #         setattr(self, field, value)

