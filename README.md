# Calendar App

> Calendar UI Reference: https://the-pals.netlify.app/

## Setup

- Change directory to `backend` (where `main.py` resides), $ `cd backend/`
- Create a virtual environment, $ `python -m venv .venv`
- Activate this environment, $ `source ./venv/bin/activate`
- Install requirements, $ `pip install -r requirements.txt`
- Run the FastAPI server (from within the `backend` directory, $ `uvicorn main:app --reload`
- Try out the routes!

## The Routes

### GET /items

> Example get all items

```
❯ curl --location 'http://127.0.0.1:8000/items/month/032024' \
--header 'Cookie: csrftoken=PfjQEjAKjAnX8O3rT52Om2DnEfuKb7Wl' | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   612  100   612    0     0  58241      0 --:--:-- --:--:-- --:--:-- 61200
{
  "message": "Total 4 items found",
  "data": [
    {
      "id": "1709781732-31074-71753",
      "item": "Positive visit most Mrs.",
      "status": "ACTIVE",
      "created_on": "03/06/2024",
      "target_on": "03/05/2024"
    },
    {
      "id": "1709781732-31074-88065",
      "item": "Reach sister feeling specific firm direction science.",
      "status": "ACTIVE",
      "created_on": "03/06/2024",
      "target_on": "03/05/2024"
    },
    {
      "id": "1709781732-31074-830064",
      "item": "Outside language nice.",
      "status": "CANCELLED",
      "created_on": "03/06/2024",
      "target_on": "03/05/2024"
    },
    {
      "id": "1709781732-31074-568662",
      "item": "Lay now attorney cost.",
      "status": "ACTIVE",
      "created_on": "03/06/2024",
      "target_on": "03/05/2024"
    }
  ]
}
~ ❯ 
```

### GET /items/<item_id>
> Example get an item with its unique ID

```
❯ curl --location 'http://127.0.0.1:8000/items/1709781732-31074-71753' \
--header 'Cookie: csrftoken=PfjQEjAKjAnX8O3rT52Om2DnEfuKb7Wl' | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   143  100   143    0     0  21153      0 --:--:-- --:--:-- --:--:-- 23833
{
  "item": {
    "id": "1709781732-31074-71753",
    "item": "Positive visit most Mrs.",
    "status": "ACTIVE",
    "created_on": "03/06/2024",
    "target_on": "03/05/2024"
  }
}
~ ❯
```

### POST /items/create

> Example create new item with default target and status values

```
# Creates the new resource
❯ curl --location 'http://127.0.0.1:8000/items/create' \
--header 'Content-Type: application/json' \
--header 'Cookie: csrftoken=PfjQEjAKjAnX8O3rT52Om2DnEfuKb7Wl' \
--data '{
    "item": "New item"
}' | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   107  100    81  100    26   8145   2614 --:--:-- --:--:-- --:--:-- 11888
{
  "message": "Item created successfully.",
  "id": "1709781989-31074-362737",
  "count": 6
}

# Reads the created resource
❯ curl --location 'http://127.0.0.1:8000/items/1709781989-31074-362737' \
--header 'Cookie: csrftoken=PfjQEjAKjAnX8O3rT52Om2DnEfuKb7Wl' | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   128  100   128    0     0  16815      0 --:--:-- --:--:-- --:--:-- 18285
{
  "item": {
    "id": "1709781989-31074-362737",
    "item": "New item",
    "status": "ACTIVE",
    "created_on": "03/06/2024",
    "target_on": "03/06/2024"
  }
}
~ ❯
```

### PUT /items/update

> Example update an item using its unique ID

```
❯ curl --location --request PUT 'http://127.0.0.1:8000/items/update/1709781989-31074-362737' \
--header 'Content-Type: application/json' \
--header 'Cookie: csrftoken=PfjQEjAKjAnX8O3rT52Om2DnEfuKb7Wl' \
--data '{
    "target_on": "03/07/2024"
}' | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   241  100   208  100    33  40736   6462 --:--:-- --:--:-- --:--:-- 48200
{
  "message": "Item updated successfully.",
  "id": "1709781989-31074-362737",
  "item": {
    "id": "1709781989-31074-362737",
    "item": "New item",
    "status": "ACTIVE",
    "created_on": "03/06/2024",
    "target_on": "03/07/2024"
  },
  "count": 6
}
~ ❯
```

### DELETE /items/delete/<item_id>

> Example delete an item using its unique ID

```
❯ curl --location --request DELETE 'http://127.0.0.1:8000/items/delete/1709781989-31074-362737' \
--header 'Cookie: csrftoken=PfjQEjAKjAnX8O3rT52Om2DnEfuKb7Wl' | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    54  100    54    0     0   6707      0 --:--:-- --:--:-- --:--:--  7714
{
  "message": "Item was removed successfully.",
  "count": 4
}
~ ❯
```

Happy coding 😎
