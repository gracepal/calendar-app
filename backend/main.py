import pdb #noqa
import datetime
import random

from fastapi import FastAPI, HTTPException, status, Query
from faker import Faker
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from models import Item, StatusEnum


app = FastAPI()

fake = Faker()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, you can specify specific origins if needed
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get('/')
async def root():
    return { "message": "Hello World of Calendars!" }

items = [
    # Item(item='Plant water babies', target_on='03/21/2024'),
    # Item(item='Bake a cake', status=StatusEnum.CANCELLED),
    # # Item(item='Boxing class', target_on='04/01/2024'),
    # Item(item='Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, minus. Fuga nesciunt modi provident est, aperiam, incidunt maiores itaque, asperiores pariatur voluptatibus repellat delectus quam adipisci perspiciatis nisi tenetur ex.'),
]


test_items = []
for _ in range(5):
    test_state = random.choice([StatusEnum.ACTIVE, StatusEnum.CANCELLED, StatusEnum.COMPLETED, StatusEnum.INACTIVE])
    start_date = datetime.datetime(2024, 3, 3)
    end_date = datetime.datetime(2024, 3, 5)
    random_date = start_date + datetime.timedelta(days=random.randint(0, (end_date - start_date).days))
    target_on = random_date.strftime("%m/%d/%Y")
    test_items.append(Item(item=fake.sentence(), target_on=target_on, status=test_state))

for _ in range(10):
    test_state = random.choice([StatusEnum.ACTIVE, StatusEnum.CANCELLED, StatusEnum.COMPLETED, StatusEnum.INACTIVE])
    start_date = datetime.datetime(2024, 3, 5)
    end_date = datetime.datetime(2024, 3, 31)
    random_date = start_date + datetime.timedelta(days=random.randint(0, (end_date - start_date).days))
    target_on = random_date.strftime("%m/%d/%Y")
    test_items.append(Item(item=fake.sentence(), target_on=target_on, status=test_state))
print('here are the test items', test_items)
items.extend(test_items)

@app.get("/items")
async def get_items(sort_by: Optional[str] = None, ascending: Optional[bool] = True):
    '''Get all items'''
    if sort_by is None:
        return { "count": len(items), "items": items }

    if sort_by not in ["created_on", "target_on"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Sort by {sort_by} is not currently supported.')
    if sort_by == "created_on":
        sorted_items = sorted(items, key=lambda x: x.created_on, reverse=not ascending)
    elif sort_by == "target_on":
        sorted_items = sorted(items, key=lambda x: x.target_on, reverse=not ascending)
    return { "count": len(items), "items": sorted_items, "sort_by": sort_by, "ascending": ascending }


@app.get("/items/{item_id}")
async def get_item(item_id: str):
    '''Get specific item using its id'''
    for item in items:
        if item.id == item_id:
            return {'item': item}
    return {"message": f"No item with id {item_id} found"}


@app.get("/items/month/{mmyyyy}")
def get_items_on_month(mmyyyy: str):
    '''Get all items for a specific month'''
    target_dateobj = datetime.datetime.strptime(mmyyyy, '%m%Y')
    relevant_items = []
    for item in items:
        item_dateobj = datetime.datetime.strptime(item.target_on, '%m/%d/%Y')
        if (item_dateobj.month, item_dateobj.year) == (target_dateobj.month, target_dateobj.year):
            relevant_items.append(item)
    return {"message": f"Total {len(relevant_items)} items found", "data": relevant_items}


@app.get("/items/day/{mmddyyyy}")
async def get_items_on_day(mmddyyyy: str):
    '''Get all items for a specific day'''
    target_date = datetime.datetime.strptime(mmddyyyy, '%m%d%Y')
    relevant_items = []
    for item in items:
        item_date = datetime.datetime.strptime(item.target_on, '%m/%d/%Y')
        if target_date == item_date:
            relevant_items.append(item)
    return {"message": f"Total {len(relevant_items)} items found", "data": relevant_items}


@app.post("/items/create", status_code=status.HTTP_201_CREATED)
async def create_item(item_obj: Item):
    '''Create new item with a unique id which is not to be reused'''
    new_item = item_obj
    items.append(new_item)
    return {
        "message": "Item created successfully.",
        "id": new_item.id,
        "count": len(items),
    }


@app.put("/items/update/{item_id}")
async def update_item(item_id: str, item_dict: dict):
    '''Update item using its id'''
    for item in items:
        if item.id == item_id:
            item.update_values(item_dict)
            return {
                "message": "Item updated successfully.",
                "id": item.id,
                'item': item,
                "count": len(items),
            }
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"message": f"Item with id '{item_id}' does not exist."})

@app.delete("/items/delete/{item_id}")
async def delete_item(item_id: str):
    '''Delete item using its id'''
    for item in items:
        if item.id == item_id:
            items.remove(item)
            return {
                "message": "Item was removed successfully.",
                "count": len(items)
            }
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"message": f"Item with id '{item_id}' does not exist."})


@app.delete("/items/delete/day/{mmddyyyy}")
async def delete_items_for_date(mmddyyyy: str):
    '''Delete items with target due on a specific date mmddyyyy'''
    target_date = datetime.datetime.strptime(mmddyyyy, '%m%d%Y')

    deleted_items = []
    for i in range(len(items)-1, -1, -1):
        item_date = datetime.datetime.strptime(items[i].target_on, '%m/%d/%Y')
        if item_date == target_date:
            item_to_delete = items[i]
            deleted_items.append(item_to_delete)
            items.remove(items[i])
    display_date = target_date.strftime('%m/%d/%Y')
    return {"message": f"Total {len(deleted_items)} items deleted successfully from target date {display_date}", "count": len(items)}


@app.delete("/items/delete/month/{mmyyyy}")
async def delete_items_for_month(mmyyyy: str):
    '''Delete items with target due for a specific month mmyyyy'''
    target_date = datetime.datetime.strptime(mmyyyy, '%m%Y')
    items_to_delete = []
    for item in items:
        item_date = datetime.datetime.strptime(item.target_on, '%m/%d/%Y')
        if (item_date.month, item_date.year) == (target_date.month, target_date.year):
            items_to_delete.append(item)

    deleted_items = []
    for item in items_to_delete:
        deleted_items.append(item)
        items.remove(item)
    display_date = target_date.strftime('%B %Y')
    return {"message": f"Total {len(deleted_items)} deleted with target date on {display_date}"}

@app.delete("/items/delete-all")
async def delete_items_all_time(confirm: bool = Query(..., description="Confirm intent to delete all items")):
    if not confirm:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You must confirm that you wish to delete all items")
    total_count = len(items)
    items.clear()
    return {"message": f"Total {total_count} items deleted successfully."}


@app.put("/items/complete/{item_id}")
async def mark_complete(item_id: str):
    for item in items:
        if item.id == item_id:
            if item.status != StatusEnum.ACTIVE:
                return {"message": f"Item must be in {StatusEnum.ACTIVE} state to be marked as {StatusEnum.COMPLETED}, current state is {item.status}"}
            item.status = StatusEnum.COMPLETED
            return {"message": f"Item with id {item_id} successfully marked as complete."}
    return {"message": f"No item with id {item_id} found"}


@app.put("/items/cancel/{item_id}")
async def mark_cancelled(item_id: str):
    '''Mark specific item as cancelled - needs to be in ACTIVE state'''
    for item in items:
        if item.id == item_id:
            if item.status != StatusEnum.ACTIVE:
                return {"message": f"Item must be in {StatusEnum.ACTIVE} state to be marked as {StatusEnum.CANCELLED}, current state is {item.status}"}
            item.status = StatusEnum.CANCELLED
            return {"message": f"Item with id {item_id} successfully marked as cancelled."}
    return {"message": f"No item with id {item_id} found"}

@app.put("/items/activate/{item_id}")
async def mark_active(item_id: str):
    '''Mark specific item as ACTIVE again - should not be already target state
        and should not be in the past
    '''
    for item in items:
        if item.id == item_id:
            # TODO: handle past reactivate
            # return {"message": f"Item with id {item_id} is past due, extend the due date to re-activate."}
            item.status = StatusEnum.ACTIVE
            return {"message": f"Item with id {item_id} successfully activated"}
    return {"message": f"No item with id {item_id} found"}