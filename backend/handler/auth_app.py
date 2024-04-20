from flask import Flask, request, session, jsonify, redirect

app = Flask(__name__)
app.secret_key = 'e83570372eba5162777bd4ff59b8720f4149af1f7937b12e'
app.config['SESSION_COOKIE_NAME'] = 'flask_session'

# Azure AD B2C Configuration
AAD_B2C_TENANT = 'CucubanosAuth.onmicrosoft.com'
AAD_B2C_CLIENT_ID = '3a70932b-93dd-4960-9188-3a2e3a15c9f1'

# Users dictionary for email and password authentication
USERS = {
    'jose.lucena2@upr.edu': 'password123'
}

@app.route('/', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if email in USERS and USERS[email] == password:
        session['authenticated'] = True
        return jsonify({"success": True, "message": "Successfully authenticated"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/dashboard', methods=['POST'])
def protected_dashboard():
    if session.get('authenticated'):
        return "Welcome to the Dashboard!"
    else:
        return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
