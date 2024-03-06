import pdb #noqa
from typing import AsyncGenerator, Generator #noqa

import pytest #noqa
from fastapi.testclient import TestClient #noqa
from httpx import AsyncClient #noqa
from main import app, items
from faker import Faker
from tests.common import TestData

from models import Item, StatusEnum

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

@pytest.fixture()
def client() -> Generator:
    yield TestClient(app)

# @pytest.fixture(autouse=True)
@pytest.fixture()
async def clean_db() -> AsyncGenerator:
    items.clear()
    yield

@pytest.fixture()
async def db_with_data_small() -> AsyncGenerator:
    items.clear()
    items.extend(TestData.test_items_small)
    yield

@pytest.fixture()
async def async_client(client) -> AsyncGenerator:
    async with AsyncClient(app=app, base_url=client.base_url) as ac:
        yield ac
