from flask import Flask, request, jsonify, make_response
import jwt
import datetime
import os
import logging



app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY')  # Retrieve secret key from environment variables



# Users dictionary for email and password authentication
USERS = {
    'jose.lucena2@upr.edu': 'password123'
}

# Generate JWT token
def generate_token(email):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=30),  # Token expiration time
        'iat': datetime.datetime.utcnow(),  # Token issued at
        'sub': email
    }
    token = jwt.encode(payload, app.secret_key, algorithm='HS256')
    return token.decode('utf-8')

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

    # If token is valid, return the protected resource
    return "Welcome to the Dashboard!"

if __name__ == '__main__':
    app.run(debug=True)
