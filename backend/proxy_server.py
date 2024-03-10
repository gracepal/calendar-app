from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Define the target URL of your FastAPI server
TARGET_URL = 'http://localhost:3000'  # Update with your FastAPI server URL

@app.route('/items/month/<path:path>', methods=['GET'])
def proxy(path):
    url = f'{TARGET_URL}/{path}'
    headers = {key: value for (key, value) in request.headers if key != 'Host'}
    response = requests.request(
        method=request.method,
        url=url,
        headers=headers,
        data=request.get_data(),
        cookies=request.cookies,
        allow_redirects=False
    )
    response_headers = [(name, value) for (name, value) in response.raw.headers.items()]
    return jsonify(response.json()), response.status_code, response_headers

if __name__ == '__main__':
    app.run(host='localhost', port=3000)
