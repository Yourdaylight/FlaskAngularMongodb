import json
import traceback
import uuid
from flask import Flask, request
from flask_cors import CORS
from views import employee
import defines

# Set up database connection
database = defines.client[defines.DATABASE_NAME]
employees_collection = database["employee"]

# Create Flask application
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config.from_object(defines)
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

    return json.dumps(response), response['code']


@app.route('/api/employee/register', methods=['POST'])
def employee_registration():
    employee_data = request.json
    if not employee_data:
        return json.dumps({"code": 400, "message": "No data provided"}), 400

    employee_id = employee_data.get('employee_id')
    employee_password = employee_data.get('password')

    if employees_collection.find_one({"employee_id": employee_id}):
        return json.dumps({"code": 409, "message": "Employee ID already exists"}), 409

    try:
        employees_collection.insert_one({"employee_id": employee_id, "password": employee_password})
        return json.dumps({"code": 200, "message": "Registration successful"}), 200
    except Exception:
        traceback.print_exc()
        return json.dumps({"code": 500, "message": "Registration failed"}), 500


if __name__ == '__main__':
    try:
        if not defines.get_db():
            defines.read_dataset()
        app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        print(f"Error starting the application: {e}")
        traceback.print_exc()
