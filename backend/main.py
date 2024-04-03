from flask import Flask, jsonify, request, render_template
from flask_cors import CORS, cross_origin
import os
from mqtt import *


# Create the application instance
app = Flask(__name__)
CORS(app)

port = int(os.environ.get("PORT", 5000))

# Create a URL route in our application for "/"
@app.route('/')
def index():
    return render_template("index".html)


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

@app.route("/add-user", methods=["GET"])
def add_user():
    pass

@app.route("/remove-user/<string:username>", methods=["DELETE"])
def remove_user(username):
    pass

@app.route("/update-user/<string:username>", methods=["POST"])
def update_user(username):
    pass


@app.route("/forgot-password/<string:username>", methods=["POST"])
def forgot_password(username):
    pass


@app.route("/add-buoy", methods=["POST"])
def add_buoy():
    pass


@app.route("/get-buoys", methods=["GET"])
def get_buoys():
    pass

@app.route("/update-buoy", methods=["POST"])
def update_buoy():
    pass

@app.route("/delete-buoy/<int:buoyID>", methods=["DELETE"])
def delete_buoy(buoyID):
    pass

if __name__ == '__main__':
    connect_mqtt()
    app.run(debug=True)

# if __name__ == '__main__':
#     app.run(host='', port = port)