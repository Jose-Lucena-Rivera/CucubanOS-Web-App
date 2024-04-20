from flask import Flask, request, jsonify
import jwt
import datetime
import os
import logging
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
#local http://127.0.0.1:5000
CORS(app, resources={r"/*": {"origins": "*"}})


load_dotenv()

app.secret_key = os.environ.get('SECRET_KEY')

USERS = {
    'jose.lucena2@upr.edu': 'password123'
}

def generate_token(email):
    payload = {
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=0, minutes=30),
        'iat': datetime.datetime.now(datetime.timezone.utc),
        'sub': email
    }
    token = jwt.encode(payload, app.secret_key, algorithm='HS256')
    return token

@app.route('/', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if email in USERS and USERS[email] == password:
        token = generate_token(email)
        return jsonify({"success": True, "message": "Successfully authenticated", "token": token}), 200
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/dashboard', methods=['GET'])
def protected_dashboard():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({"success": False, "message": "Token is missing"}), 401

    try:
        payload = jwt.decode(token, app.secret_key, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return jsonify({"success": False, "message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"success": False, "message": "Invalid token"}), 401
    except Exception as e:
        app.logger.error(f"Error decoding token: {e}")
        return jsonify({"success": False, "message": "An error occurred"}), 500

    return "Welcome to the Dashboard!"

if __name__ == '__main__':
    app.run(debug=True)
