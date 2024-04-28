from flask import Flask, jsonify, request, send_from_directory, render_template
from flask_cors import CORS, cross_origin
import os
from mqtt import *
# from dotenv import load_dotenv
from handler.users import *
from handler.buoys import *
from handler.messages import *

# Create the application instance
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://boyaslacatalana.azurewebsites.net"}})


# load_dotenv()

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

for key, value in os.environ.items():
    print(f"{key}: {value}")
    

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

@app.route("/update-marker-ids", methods=["POST"])
def update_marker_ids():
    try:
        # Extract marker IDs from the request data
        marker_ids = request.json.get("markerIds")
        # Filter out duplicates
        unique_marker_ids = list(set(marker_ids))
        print("Unique marker IDs:", unique_marker_ids)

        # Process the unique marker IDs (e.g., store them in a database)
        # Your code to handle the marker IDs goes here

        # Optionally, return a success response
        return jsonify({"message": "Marker IDs received successfully"}), 200
    except Exception as e:
        # Return an error response if something goes wrong
        return jsonify({"error": str(e)}), 500


@app.route('/deploy', methods=['POST'])
def deploy():
    print("Deploy function called")
    data = request.json
    
    # Define the desired order of keys
    ordered_keys = ['selectedColorNum', 'selectedPatternNum', 'brightnessLevel', 'selectedFrequencyNum']

    # Create a new dictionary with keys in the desired order
    ordered_data = {key: data.get(key) for key in ordered_keys}

    # Process the received data
    selectedColorNum = ordered_data.get('selectedColorNum')
    selectedPatternNum = ordered_data.get('selectedPatternNum')
    brightnessLevel = ordered_data.get('brightnessLevel')
    selectedFrequencyNum = ordered_data.get('selectedFrequencyNum')

    # Here you can process the received data further

    # Return the processed data
    response_data = {
        'selectedColorNum': selectedColorNum,
        'selectedPatternNum': selectedPatternNum,
        'brightnessLevel': brightnessLevel,
        'selectedFrequencyNum': selectedFrequencyNum,
    }

    return jsonify(response_data), 200
    


if __name__ == '__main__':
    if debugging:
        #connect_mqtt()
        app.run(debug=True)
    else:
        app.run(host='0.0.0.0', port = port)
        