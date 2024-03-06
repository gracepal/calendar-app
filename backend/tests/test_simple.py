import pdb #noqa
import pytest
from httpx import AsyncClient
from tests.common import TestData
from fastapi import status
from tests.common import Utils
from models import StatusEnum
import random

new_item_id = None

@pytest.mark.anyio
async def test_get_empty_items(clean_db, async_client: AsyncClient):
    '''Empty items'''
    response = await async_client.get("/items")
    expected = {"count": 0, "items": []}

    assert response.status_code == status.HTTP_200_OK
    assert expected.items() <= response.json().items()

@pytest.mark.anyio
async def test_get_nonempty_items(db_with_data_small, async_client: AsyncClient):
    '''Non empty items'''
    response = await async_client.get("/items")
    data = response.json()
    assert data["count"] == len(TestData.test_items_small)
    assert [item['item'] for item in data['items']] == [item.item for item in TestData.test_items_small]

@pytest.mark.anyio
async def test_create_item_default(clean_db, async_client: AsyncClient):
    '''Create new item with defaults'''
    new_item_text = "New item"
    today_datestr = Utils.get_datestr()
    default_target_datestr = today_datestr
    default_status = StatusEnum.ACTIVE
    post_response = await async_client.post("/items/create", json={"item": new_item_text})

    assert post_response.status_code == status.HTTP_201_CREATED
    post_data = post_response.json()
    assert post_data["message"] == "Item created successfully."
    assert post_data["count"] == 1
    new_item_id = post_data['id']

    get_response = await async_client.get(f"/items/{new_item_id}")
    get_data = get_response.json()['item']
    assert get_data["item"] == new_item_text
    assert get_data["status"] == default_status
    assert get_data['target_on'] == default_target_datestr

@pytest.mark.anyio
async def test_update_item(clean_db, async_client: AsyncClient):
    '''Update item description and target date'''
    item_text = 'Item description'
    tomorrow = Utils.get_datestr(days=1)
    post_response = await async_client.post("/items/create", json={"item": item_text})
    assert post_response.status_code == status.HTTP_201_CREATED
    item_id = post_response.json()['id']

    put_response = await async_client.put(
        f"/items/update/{item_id}",
        json={"item": f"{item_text} UPDATED", "target_on": tomorrow})
    assert put_response.status_code == status.HTTP_200_OK
    put_data = put_response.json()
    assert put_data['message'] == "Item updated successfully."

    get_response = await async_client.get(f"/items/{item_id}")
    assert get_response.status_code == status.HTTP_200_OK
    get_data = get_response.json()['item']
    assert get_data['item'] == f"{item_text} UPDATED"
    assert get_data['target_on'] == tomorrow

@pytest.mark.anyio
async def test_update_item_invalid_id(clean_db, async_client: AsyncClient):
    '''Attempt to update non-existing item'''
    invalid_id = 'doesnotexist1234'
    put_response = await async_client.put(
        f"/items/update/{invalid_id}",
        json={"item": "This does not exist"})

    assert put_response.status_code == status.HTTP_404_NOT_FOUND
    assert put_response.json()['detail']['message'] == \
        f"Item with id '{invalid_id}' does not exist."

@pytest.mark.anyio
async def test_delete_item_using_id(db_with_data_small, async_client: AsyncClient):
    '''Delete item using id'''
    get_response = await async_client.get('/items')
    assert get_response.status_code == status.HTTP_200_OK
    get_data = get_response.json()
    num_items = get_data['count']
    assert num_items > 0

    item_to_remove = random.choice(get_data['items'])
    delete_response = await async_client.delete(f'/items/delete/{item_to_remove["id"]}')
    assert delete_response.status_code == status.HTTP_200_OK
    delete_data = delete_response.json()
    assert delete_data['message'] == 'Item was removed successfully.'
    assert delete_data['count'] == num_items - 1


@pytest.mark.anyio
async def test_delete_item_invalid_id(db_with_data_small, async_client: AsyncClient):
    '''Delete item using id'''
    invalid_id = 'invalid1234'
    delete_response = await async_client.delete(f'/items/delete/{invalid_id}')
    assert delete_response.status_code == status.HTTP_404_NOT_FOUND
    assert delete_response.json()['detail']['message'] == \
        f"Item with id '{invalid_id}' does not exist."
