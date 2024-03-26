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

@app.route("/users", methods=["GET"])
def test():
    pass


if __name__ == '__main__':
    connect_mqtt()
    app.run(debug=True)

# if __name__ == '__main__':
#     app.run(host='', port = port)