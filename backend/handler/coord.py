from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will allow cross-origin requests, remove it if you don't need it

# Dummy storage for demonstration purposes
buoy_data = []

@app.route('/deploy', methods=['POST'])
def send_coordinates():
    try:
        data = request.json
        lat = data.get('lat')
        lng = data.get('lng')

        # Validate data
        if not lat or not lng:
            return jsonify({"error": "Latitude and Longitude are required"}), 400

        # Store the coordinates
        buoy_data.append({"lat": lat, "lng": lng})

        # Respond with a success message
        return jsonify({"message": "Coordinates received and stored successfully"}), 200

    except Exception as e:
        print(f"Error processing coordinates: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
