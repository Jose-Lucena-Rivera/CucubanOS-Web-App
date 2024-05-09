from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS, cross_origin
import os
from mqtt import *
from dotenv import load_dotenv
from handler.users import *
from handler.buoys import *
from handler.messages import *
import jwt
from handler.users import UserHandler
from hashlib import sha256
# from dao.users import UsersDAO



secret_key = os.environ.get('SECRET_KEY')
# Create the application instance
app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "https://boyaslacatalana.azurewebsites.net"}})
CORS(app, resources={r"/*": {"origins": "*"}})

user_handler = UserHandler()
#user_dao = UsersDAO()

load_dotenv()

port = int(os.environ.get("PORT", 5000))


@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response

# for key, value in os.environ.items():
#     print(f"{key}: {value}")
    

@app.route("/add-user", methods=["POST"])
@app.route("/add-user/", methods=["POST"])
def add_user():
    user = UserHandler()
    return user.create_user()
    # return create_user()

@app.route("/remove-user/", methods=["DELETE"])
@app.route("/remove-user", methods=["DELETE"])
def remove_user():
    user = UserHandler()
    return user.delete_user()

@app.route("/update-user", methods=["PUT"])
@app.route("/update-user/", methods=["PUT"])
def update_user():
    user = UserHandler()
    return user.update_user()

@app.route("/get-user", methods=["GET"])
@app.route("/get-user/", methods=["GET"])
def get_user():
    user = UserHandler()
    return user.get_user()

@app.route("/get-all-users", methods=["GET"])
@app.route("/get-all-users/", methods=["GET"])
def get_all_users():
    user = UserHandler()
    return user.get_all_users()

@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    # user = UserHandler()
    # return user.forgot_password()
    if request.method == "POST":
        # Get the email from the POST request body
        data = request.json
        email = data.get("email")
        print("Received email:", email)
        
        # Here you can implement the logic to send an email to the user to reset their password
        
        # Return a JSON response to indicate that the request was successful
        return jsonify({"message": "An email has been sent to reset your password"})

    # Handle other HTTP methods if needed
    return jsonify({"error": "Method not allowed"}), 405  # Return a 405 Method Not Allowed error for other methods

@app.route("/reset-password", methods=["POST"])
@app.route("/reset-password/", methods=["POST"])
def reset_password():
    pass
    

@app.route("/add-buoy", methods=["POST"])
@app.route("/add-buoy/", methods=["POST"])
def add_buoy():
    buoy = BuoyHandler()
    return buoy.create_buoy()
    
@app.route("/get-one-buoy", methods=["GET"])
@app.route("/get-one-buoy/", methods=["GET"])
def get_one_buoy():
    buoy = BuoyHandler()
    return buoy.get_buoy()

@app.route("/get-buoys/", methods=["GET"])
@app.route("/get-buoys", methods=["GET"])
def get_buoys():
    buoy = BuoyHandler()
    return buoy.get_buoys()


@app.route("/delete-buoy/<string:bname>", methods=["DELETE"])
@app.route("/delete-buoy/<string:bname>/", methods=["DELETE"])
def delete_buoy(bname):
    buoy = BuoyHandler()
    return buoy.delete_buoy(bname)


@app.route("/update-buoy/", methods=["PUT"])
@app.route("/update-buoy", methods=["PUT"])
def update_buoy():
    buoy = BuoyHandler()
    return buoy.update_buoy()


@app.route("/chirpstack-updates", methods=["POST"])
@app.route("/chirpstack-updates/", methods=["POST"])
def chirpstack_updates():
    update = MessageHandler()
    return update.chirpstack_updates()


@app.route("/send-all-buoys-data/", methods=["POST"])
@app.route("/send-all-buoys-data", methods=["POST"])
def send_buoy_data():
    message = MessageHandler()
    return message.multicast()
    
@app.route("/send-one-buoy-data/", methods=["POST"])
@app.route("/send-one-buoy-data", methods=["POST"])
def send_one_buoy_data():
    message = MessageHandler()
    return message.send_one_buoy_data()

@app.route("/see-multimessage", methods=["GET"])
def see_multimessage():
    message = MessageHandler()
    return message.see_multimessage()

@app.route("/delete-multicast-queue", methods=["DELETE"])
def delete_multicast():
    message = MessageHandler()
    return message.delete_multicast_queue()


# Route to serve index.html
@app.route('/')
def serve_index():
    return send_from_directory('build', 'index.html')

# Route to serve static files
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('build', path)


@app.route("/update-marker-ids", methods=["POST"])
def update_marker_ids():
    buoy = BuoyHandler()
    return buoy.update_marker_ids()
    try:
        # Extract marker IDs and DevEUIs from the request data
        marker_ids_devEUIs = request.get_json()
        print("Data Recieved:", marker_ids_devEUIs)
        # Check if request data is None or empty
        if marker_ids_devEUIs is None:
            return jsonify({"error": "No JSON data received"}), 400

        # Check if 'markers' key exists and it's a list
        markers_list = marker_ids_devEUIs.get("markers")
        if not isinstance(markers_list, list):
            return jsonify({"error": "Invalid 'markers' format or missing 'markers' key"}), 400
        
        # Process the received marker IDs and DevEUIs
        for marker in markers_list:
            marker_id = marker.get("markerId")
            devEUI = marker.get("devEUI")
            if marker_id is None or devEUI is None:
                return jsonify({"error": "Missing 'markerId' or 'devEUI' in marker data"}), 400
            # Your code to handle the marker ID and DevEUI goes here
            print("Marker ID:", marker_id)
            print("DevEUI:", devEUI)
            
            # Example: Store marker ID and DevEUI in a database

        # Optionally, return a success response
        return jsonify({"message": "Marker IDs received successfully"}), 200

    except ValueError as ve:
        # JSON decoding error
        return jsonify({"error": "Invalid JSON data in the request: " + str(ve)}), 400

    except Exception as e:
        # Return an error response if something goes wrong
        return jsonify({"error": "An unexpected error occurred: " + str(e)}), 500

@app.route('/deploy', methods=['POST'])
def deploy():
    message = MessageHandler()
    return message.deploy_buoy()


@app.route("/verify-password", methods=["GET"])
def verify_password():
    return user_handler.verify_password()


@app.route("/update-password", methods=["PUT"])
def update_password():
    return user_handler.update_password()

    
failed_login_attempts = {}



@app.route('/login', methods=['POST'])
def login():
    user = UserHandler()
    return user.login()


    try:
        # Define MAX_LOGIN_ATTEMPTS here
        MAX_LOGIN_ATTEMPTS = 10
        
        # Get the email and password from the request body
        data = request.json
        email = data.get('email')
        password = data.get('password')

        # Check if email and password are provided
        if not email or not password:
            return jsonify({'message': 'Email and password are required.'}), 400

        # Connect to the PostgreSQL database
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()

        # Execute a SQL query to authenticate the user
        cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()

        if user:
            # Reset failed login attempts for this user
            failed_login_attempts.pop(email, None)

            # Generate JWT token
            token = jwt.encode({'email': email}, secret_key, algorithm='HS256')

            print("Generated Token:", token)
            return jsonify({'token': token}), 200
        else:
            # Increment failed login attempts counter for this user
            failed_attempts = failed_login_attempts.get(email, 0) + 1
            failed_login_attempts[email] = failed_attempts

            # Log the number of failed login attempts for this user
            print(f"Failed login attempts for {email}: {failed_attempts}")

            # Check if the user has exceeded the maximum attempts
            if failed_attempts >= MAX_LOGIN_ATTEMPTS:
                return jsonify({'message': 'You have been locked due to failed login attempts. Please try again in 5 minutes.'}), 401
            else:
                return jsonify({'message': 'Invalid email or password.'}), 401
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        # Close the database connection
        cursor.close()
        conn.close()

if __name__ == '__main__':
    if debugging:
        #connect_mqtt()
        app.run(debug=True)
    else:
        app.run(host='0.0.0.0', port = port)
        