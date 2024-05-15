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


# route for adding a user. Not implemented on the front end
@app.route("/add-user", methods=["POST"])
@app.route("/add-user/", methods=["POST"])
def add_user():
    user = UserHandler()
    return user.create_user()

# route for removing a user. Not implemented on the front end
@app.route("/remove-user/", methods=["DELETE"])
@app.route("/remove-user", methods=["DELETE"])
def remove_user():
    user = UserHandler()
    return user.delete_user()

# route for updating a user. Not implemented on the front end
@app.route("/update-user", methods=["PUT"])
@app.route("/update-user/", methods=["PUT"])
def update_user():
    user = UserHandler()
    return user.update_user()

# route for getting a user. Not implemented on the front end
@app.route("/get-user", methods=["GET"])
@app.route("/get-user/", methods=["GET"])
def get_user():
    user = UserHandler()
    return user.get_user()

# route for getting all users. Not implemented on the front end
@app.route("/get-all-users", methods=["GET"])
@app.route("/get-all-users/", methods=["GET"])
def get_all_users():
    user = UserHandler()
    return user.get_all_users()

# a route for the forgot password in the front end. Sends an email to the user to reset their password if they exist
@app.route("/forgot-password/", methods=["POST"])
@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    user = UserHandler()
    return user.forgot_password()
    

# a route for checking the forgotten password token. To check if the forgot password link is valid
@app.route("/check-forgotten-password-token", methods=["GET"])
@app.route("/check-forgotten-password-token/", methods=["GET"])
def check_forgotten_password_token():
    user = UserHandler()
    return user.check_forgotten_password_token()


# a route for resetting the password. (after the link has been verified)
@app.route("/reset-password", methods=["POST"])
@app.route("/reset-password/", methods=["POST"])
def reset_password():
    return user_handler.update_password()
    
    
# adds a buoy to the database and to chirpstack 
@app.route("/add-buoy", methods=["POST"])
@app.route("/add-buoy/", methods=["POST"])
def add_buoy():
    buoy = BuoyHandler()
    return buoy.create_buoy()
    
# gets a buoy from the database. Not implemented on the front end
@app.route("/get-one-buoy", methods=["GET"])
@app.route("/get-one-buoy/", methods=["GET"])
def get_one_buoy():
    buoy = BuoyHandler()
    return buoy.get_buoy()

# gets all buoys from the database. 
@app.route("/get-buoys/", methods=["GET"])
@app.route("/get-buoys", methods=["GET"])
def get_buoys():
    buoy = BuoyHandler()
    return buoy.get_buoys()

# deletes a buoy from the database and from chirpstack
@app.route("/delete-buoy/<string:bname>", methods=["DELETE"])
@app.route("/delete-buoy/<string:bname>/", methods=["DELETE"])
def delete_buoy(bname):
    buoy = BuoyHandler()
    return buoy.delete_buoy(bname)

# updates a buoy in the database and in chirpstack. Not used in the front end. 
@app.route("/update-buoy/", methods=["PUT"])
@app.route("/update-buoy", methods=["PUT"])
def update_buoy():
    buoy = BuoyHandler()
    return buoy.update_buoy()

# where chirpstack posts updates. depending on the update type, the data is processed or ignored
@app.route("/chirpstack-updates", methods=["POST"])
@app.route("/chirpstack-updates/", methods=["POST"])
def chirpstack_updates():
    update = MessageHandler()
    return update.chirpstack_updates()

# For multicast. Multicast is not being used right now, so this is not implemented on the front end
@app.route("/send-all-buoys-data/", methods=["POST"])
@app.route("/send-all-buoys-data", methods=["POST"])
def send_buoy_data():
    message = MessageHandler()
    return message.multicast()
    
# For sending data to one buoy. Not implemented on the front end, but is used for testing
@app.route("/send-one-buoy-data/", methods=["POST"])
@app.route("/send-one-buoy-data", methods=["POST"])
def send_one_buoy_data():
    message = MessageHandler()
    return message.send_one_buoy_data()

# to get the mulicast queue. Not implemented since multicast is not being used
@app.route("/see-multimessage", methods=["GET"])
def see_multimessage():
    message = MessageHandler()
    return message.see_multimessage()

# to delete the multicast queue. Not implemented since multicast is not being used
@app.route("/delete-multicast-queue", methods=["DELETE"])
def delete_multicast():
    message = MessageHandler()
    return message.delete_multicast_queue()


# Route to serve index.html. For azure deployment
@app.route('/')
def serve_index():
    return send_from_directory('build', 'index.html')

# Route to serve static files. 
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('build', path)

# the front end assigns an id to each buoy. This route updates the buoy's id in the database. 
@app.route("/update-marker-ids", methods=["POST"])
def update_marker_ids():
    buoy = BuoyHandler()
    return buoy.update_marker_ids()
    
# sends a message to all buoys (one by one) when the deploy button is clicked in the front end
@app.route('/deploy', methods=['POST'])
def deploy():
    message = MessageHandler()
    return message.deploy_buoy()


# verifies if the provided password is the correct password
@app.route("/verify-password", methods=["GET"])
def verify_password():
    return user_handler.verify_password()

# updates the password for the current user. checks that the new password is not the same as the old password
@app.route("/update-password", methods=["PUT"])
def update_password():
    return user_handler.update_password()

    
failed_login_attempts = {}


# checks that the user is introducing the correct password. If the user fails to introduce the correct password 10 times, the user is locked out for 5 minutes
@app.route('/login', methods=['POST'])
def login():
    user = UserHandler()
    return user.login()



if __name__ == '__main__':
    if debugging:
        #connect_mqtt()
        app.run(debug=True)
    else:
        app.run(host='0.0.0.0', port = port)
        