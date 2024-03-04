import pdb #noqa
import datetime
import random

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from faker import Faker

from models import Item, StatusEnum


app = FastAPI()

fake = Faker()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5501"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get('/')
async def root():
    return { "message": "Hello World of Calendars!" }

items = [
    Item(item='Plant water babies', target_on='03/21/2024'),
    Item(item='Bake a cake', status=StatusEnum.CANCELLED),
    # Item(item='Boxing class', target_on='04/01/2024'),
    # Item(item='Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, minus. Fuga nesciunt modi provident est, aperiam, incidunt maiores itaque, asperiores pariatur voluptatibus repellat delectus quam adipisci perspiciatis nisi tenetur ex.'),
]


test_items = []
for _ in range(0):
    test_state = random.choice([StatusEnum.ACTIVE, StatusEnum.CANCELLED, StatusEnum.COMPLETED, StatusEnum.INACTIVE])
    start_date = datetime.datetime(2024, 2, 1)
    end_date = datetime.datetime(2024, 4, 30)
    random_date = start_date + datetime.timedelta(days=random.randint(0, (end_date - start_date).days))
    target_on = random_date.strftime("%m/%d/%Y")
    test_items.append(Item(item=fake.sentence(), target_on=target_on, status=test_state))

print('here are the test items', test_items)
items.extend(test_items)


@app.get("/items")
async def get_items():
    '''Get all items'''
    return { "items": items, "count": len(items) }


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
    mm, dd, yyyy = int(mmddyyyy[:2]), int(mmddyyyy[2:4]), int(mmddyyyy[2:])
    relevant_items = []
    for item in items:
        if item.target_due.year >= yyyy and (item.target_due.month > mm  or item.target_due == mm and item.target_due.date >= dd):
            relevant_items.append(item)
    return {"message": f"Total {len(relevant_items)} items found", "data": relevant_items}


@app.post("/items/create")
async def create_item(item_obj: Item):
    '''Create new item with a unique id which is not to be reused'''
    new_item = item_obj
    items.append(item_obj)
    return {"message": f"Created item successfully {new_item}. Total count is now {len(items)}"}


@app.put("/items/update/{item_id}")
async def update_item(item_id: str, item_dict: dict):
    '''Update item using its id'''
    for item in items:
        if item.id == item_id:
            item.update_values(item_dict)
            return {'item': item}
    return {"message": f"No item with id {item_id} found"}

@app.delete("/items/delete/{item_id}")
async def delete_item(item_id: str):
    '''Delete item using its id'''
    for item in items:
        if item.id == item_id:
            removed_item = item
            items.remove(item)
            return {"message": f"Success removed {removed_item.id}: {removed_item}"}
    return {"message": f"No item with id {item_id} found"}


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