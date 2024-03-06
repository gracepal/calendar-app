import pdb #noqa
from typing import AsyncGenerator, Generator #noqa
import pytest #noqa
from fastapi.testclient import TestClient #noqa
from httpx import AsyncClient #noqa
from main import app, items
from faker import Faker
from models import Item, StatusEnum
import datetime

FORMAT_STR = '%m/%d/%Y'

class Utils:
    @staticmethod
    def get_dateobj(days=0):
        today = datetime.datetime.now().date()
        return today + datetime.timedelta(days=days)

    @staticmethod
    def get_datestr(days=0, format=FORMAT_STR):
        return Utils.get_dateobj(days).strftime(format)



class TestData:
    test_items_small = [
            Item(item='Item without target date'),
            Item(item='Item with target date same day', target_on=Utils.get_datestr(days=0)),
            Item(item='Item with target date next week', target_on=Utils.get_datestr(days=7)),
            Item(item='Item with target date next day', target_on=Utils.get_datestr(days=1)),
            Item(item='Item with target date next month', target_on=Utils.get_datestr(days=30)),
            Item(item='Item without status'),
            Item(item='Item with status INACTIVE', status=StatusEnum.INACTIVE),
            Item(item='Item with status ACTIVE', status=StatusEnum.ACTIVE),
            Item(item='Item with status COMPLETED', status=StatusEnum.COMPLETED),
            Item(item='Item with status CANCELLED', status=StatusEnum.CANCELLED),
            Item(item='Item with target date and status', status=StatusEnum.INACTIVE, target_on=Utils.get_datestr(days=0)),
        ]