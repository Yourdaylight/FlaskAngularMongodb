import time, json, bson
import datetime
import traceback
from bson import ObjectId
from defines import client, DATABASE_NAME, DATA_COLLECTION,EMPLOYEE_COLLECTION
from flask import Blueprint, request, jsonify, Response

employee = Blueprint('employee', __name__)
employee_collection = client[DATABASE_NAME][EMPLOYEE_COLLECTION]
data_collection = client[DATABASE_NAME][DATA_COLLECTION]


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, bson.ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


@employee.route('/api/employee/list', methods=['POST', 'GET'])
def employee_list():
    content = {}
    try:
        # Retrieve pagination parameters
        params = request.json or {}
        page, size = params.get("page", 1), params.get("size", 10)

        # Construct query filters
        fuzzy_search_fields = "EmployeeName"
        exact_match_fields = ["Department", "JobLevel", "MaritalStatus", "Age"]

        filters = {}
        if "EmployeeName" in params:
            filters[fuzzy_search_fields] = {"$regex": params[fuzzy_search_fields], "$options": "i"}

        for field in exact_match_fields:
            if field in params:
                filters[field] = params[field]

        # Query the employee collection
        employees_query = data_collection.find(filters)
        employees = list(employees_query.skip((page - 1) * size).limit(size).sort("update_time", -1))
        total_employees = data_collection.count_documents(filters)

        content.update({"code": 200, "total": total_employees, "data": employees, "msg": "SUCCESS"})
    except Exception as e:
        content = {"code": 500, "msg": f"Error: {e}"}

    return Response(JSONEncoder().encode(content), mimetype='application/json')


@employee.route('/api/employee/add', methods=['POST', 'GET'])
def new_employee():
    try:
        employee_data = request.json
        # 检查EmployeeName是否存在，存在则在EmployeeName后面加上时间戳
        if data_collection.find_one({"EmployeeName": employee_data["EmployeeName"]}):
            employee_data["EmployeeName"] = employee_data["EmployeeName"] + "_" + str(int(time.time()))

        int_fields = ["Age", "DistanceFromHome", "Education", "JobLevel", "MonthlyIncome", "NumCompaniesWorked"]
        for field in int_fields:
            if field in employee_data and isinstance(employee_data[field], str):
                try:
                    employee_data[field] = int(employee_data[field])
                except ValueError:
                    return jsonify({"code": 500, "msg": f"Field: [{field}] must be an integer"}), 400

        # 获取数据库中employeeId最大值
        max_employee_id = data_collection.find_one(sort=[("EmployeeID", -1)])["EmployeeID"]
        employee_data["EmployeeID"] = max_employee_id + 1
        # 添加时间戳
        employee_data["date_added"] = datetime.datetime.now().strftime("%Y-%m-%d")
        employee_data["update_time"] = time.time()

        # 插入数据
        data_collection.insert_one(employee_data)
        res = {
            "code": 200,
            "msg": "SUCCESS",
            "employee_id": employee_data["EmployeeID"],
        }
        return jsonify(res)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"code": 500, "msg": str(e)})


@employee.route('/api/employee/delete', methods=['POST', 'GET'])
def del_employee():
    try:
        employee_id = request.json.get("EmployeeID")
        _id = request.json.get("_id")
        if not employee_id:
            raise ValueError("Employee ID is not provided")

        # 使用或运算符，如果_id存在则使用_id，否则使用EmployeeID
        deletion_result = data_collection.delete_one(
            {
                "$or": [
                    {"EmployeeID": employee_id},
                    {"_id": ObjectId(_id)}
                ]
            }
        )
        if deletion_result.deleted_count == 0:
            raise ValueError("No employee found with the provided ID")
        return jsonify({"code": 200, "msg": "Employee successfully deleted"})
    except Exception as e:
        return jsonify({"code": 500, "msg": f"Error occurred: {e}"}), 500


@employee.route('/api/employee/update', methods=['POST', 'GET'])
def update_employee():
    try:
        update_data = request.get_json()
        employee_id = update_data.get("EmployeeID")
        update_data["update_time"] = time.time()
        if not employee_id:
            raise ValueError("Missing employee ID")

        data_collection.update_one(
            {"EmployeeID": employee_id},
            {"$set": update_data}
        )
        return jsonify({"code": 200, "msg": "Employee information updated successfully"})
    except Exception as e:
        return jsonify({"code": 500, "msg": f"Update failed: {e}"}), 500
