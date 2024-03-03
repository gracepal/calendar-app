import pdb #noqa
import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import Item, StatusEnum


app = FastAPI()

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
    Item(id=1, item='Plant water babies', target_on='03/21/2024'),
    Item(id=2, item='Bake a cake'),
    Item(id=3, item='Boxing class', target_on='04/01/2024'),
]

@app.get("/items")
async def get_items():
    return { "items": items, "count": len(items) }


@app.get("/items/{item_id}")
async def get_item(item_id: int):
    for item in items:
        if item.id == item_id:
            return {'item': item}
    return {"message": f"No item with id {item_id} found"}


@app.get("/items/month/{mmyyyy}")
def get_items_on_month(mmyyyy: str):
    target_dateobj = datetime.datetime.strptime(mmyyyy, '%m%Y')
    relevant_items = []
    for item in items:
        item_dateobj = datetime.datetime.strptime(item.target_on, '%m/%d/%Y')
        if (item_dateobj.month, item_dateobj.year) == (target_dateobj.month, target_dateobj.year):
            relevant_items.append(item)
    return {"message": f"Total {len(relevant_items)} items found", "data": relevant_items}


@app.get("/items/day/{mmddyyyy}")
async def get_items_on_day(mmddyyyy: str):
    mm, dd, yyyy = int(mmddyyyy[:2]), int(mmddyyyy[2:4]), int(mmddyyyy[2:])
    relevant_items = []
    for item in items:
        if item.target_due.year >= yyyy and (item.target_due.month > mm  or item.target_due == mm and item.target_due.date >= dd):
            relevant_items.append(item)
    return {"message": f"Total {len(relevant_items)} items found", "data": relevant_items}


@app.post("/items/create")
async def create_item(item_obj: Item):
    for item in items:
        if item_obj.id == item.id:
            return {'message': f"New item id {item_obj.id} conflicts with existing item {item}"}
    items.append(item_obj)
    return {"message": f"Added item {item_obj} to {items}"}


@app.put("/items/update/{item_id}")
async def update_item(item_id: int, item_obj: Item):
    if item_id != item_obj.id:
        return {"message": f"Target item id {item_id} does not match the resource {item_obj}"}
    for item in items:
        if item.id == item_id:
            item.item = item_obj.item
            return {'item': items}
    return {"message": f"No item with id {item_id} found"}

@app.delete("/items/delete/{item_id}")
async def delete_item(item_id: int):
    for item in items:
        if item.id == item_id:
            removed_item = item
            items.remove(item)
            return {"message": f"Success removed {removed_item.id}: {removed_item}"}
    return {"message": f"No item with id {item_id} found"}


@app.put("/items/complete/{item_id}")
async def mark_complete(item_id: int):
    for item in items:
        if item.id == item_id:
            if item.status != StatusEnum.ACTIVE:
                return {"message": f"Item must be in {StatusEnum.ACTIVE} state to be marked as {StatusEnum.COMPLETE}, current state is {item.status}"}
            item.status = StatusEnum.COMPLETE
            return {"message": f"Item with id {item_id} successfully marked as complete."}
    return {"message": f"No item with id {item_id} found"}


@app.put("/items/cancelled/{item_id}")
async def mark_cancelled(item_id: int):
    for item in items:
        if item.id == item_id:
            if item.status != StatusEnum.ACTIVE:
                return {"message": f"Item must be in {StatusEnum.ACTIVE} state to be marked as {StatusEnum.CANCELLED}, current state is {item.status}"}
            item.status = StatusEnum.CANCELLED
            item.modified_on = datetime.datetime.now()
            return {"message": f"Item with id {item_id} successfully marked as cancelled."}
    return {"message": f"No item with id {item_id} found"}

@app.put("/items/activate/{item_id}")
async def mark_active(item_id: int):
    for item in items:
        if item.id == item_id:
            return {"message": f"Item with id {item_id} is past due, extend the due date to re-activate."}
        item.status = StatusEnum.ACTIVE
        item.modified_on = datetime.datetime.now()
        return {"message": f"Item with id {item_id} successfully activated"}
    return {"message": f"No item with id {item_id} found"}