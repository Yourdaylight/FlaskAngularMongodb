import json
import time
import utils
import traceback
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from views import employee


# Set up database connection
database = utils.client[utils.DATABASE_NAME]
employees_collection = database[utils.EMPLOYEE_COLLECTION]

# Create Flask application
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config.from_object(utils)
app.config['JSON_AS_ASCII'] = False
app.config["SECRET_KEY"] = 'fewfewfefverwgfreqgergr'
app.register_blueprint(employee)


@app.route('/api/employee/login', methods=['POST'])
def employee_login():
    data = request.get_json(force=True)
    employee_id = data.get('employee_id')
    employee_password = data.get('password')

    # Simplified error handling
    try:
        employee = employees_collection.find_one({"employee_id": employee_id, "password": employee_password})
        if employee:
            token = str(uuid.uuid4())
            response = {"code": 200, "message": "Login successful.", "data": {"token": token}}
        else:
            response = {"code": 401, "message": "Invalid credentials"}
    except Exception as e:
        response = {"code": 500, "message": f"Error: {str(e)}"}

    return jsonify(response)


@app.route('/api/employee/register', methods=['POST'])
def employee_registration():
    employee_data = request.json
    if not employee_data:
        return json.dumps({"code": 400, "message": "No data provided"}), 400

    username = employee_data.get('username')
    employee_password = employee_data.get('password')
    # 根据username生成employee_id
    employee_id = username + "_" + str(int(time.time()))
    if employees_collection.find_one({"username": username}):
        return jsonify({"code": 400, "message": "Employee already exists."})

    try:
        employees_collection.insert_one({
            "employee_id": employee_id,
            "password": employee_password,
            "username": username
        })
        return jsonify({"code": 200, "message": "Registration successful."})
    except Exception:
        traceback.print_exc()
        return jsonify({"code": 500, "message": "Internal server error"})


if __name__ == '__main__':
    try:
        if not utils.get_db():
            utils.read_dataset()
        app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        print(f"Error starting the application: {e}")
        traceback.print_exc()
