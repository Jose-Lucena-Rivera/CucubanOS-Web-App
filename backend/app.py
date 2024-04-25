from flask import Flask, jsonify, request, send_from_directory, render_template
from flask_cors import CORS, cross_origin
import os
from mqtt import *
from dotenv import load_dotenv
from handler.users import *
from handler.buoys import *
from handler.messages import *

# Create the application instance
app = Flask(__name__)
CORS(app)

load_dotenv()
debugging = os.getenv("DEBUGGING") if not None else os.environ.get("DEBUGGING")

port = int(os.environ.get("PORT", 5000))

# Create a URL route in our application for "/"
# @app.route('/')
# def index():
#     return jsonify({"message": "Hello, Personas!"})


@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response


    

@app.route("/publish", methods=["POST"])
def publish():
    # Retrieve message data from user input
    message = request.form["message"]
    publish_message(message)
    # Display confirmation or handle errors
    return jsonify({"message": "Message sent"}, 200)


@app.route("/subscribe", methods=["GET"])
def subscribe():
    # Retrieve message data from user input
    message = subscribe_message()
    # Display confirmation or handle errors
    return jsonify({"message": message},200)

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

@app.route("/forgot-password/", methods=["POST"])
def forgot_password(username):
    
    pass

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
    # https://loraserver.tetaneutral.net/api#!/DeviceQueueService/Enqueue
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

# Route to serve index.html
@app.route('/')
def serve_index():
    return send_from_directory('build', 'index.html')

# Route to serve static files
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('build', path)

if __name__ == '__main__':
    if debugging:
        #connect_mqtt()
        app.run(debug=True)
    else:
        app.run(host='0.0.0.0', port = port)
        # app.run(host='https://boyaslacatalana.azurewebsites.net/chirpstack-updates', port = 80)
    # app.run(host='https://boyaslacatalana.azurewebsites.net/chirpstack-updates')