from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

@app.route('/deploy', methods=['POST'])
def deploy():
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
    '''
      # Create the JSON data
    json_data = {
        'selectedColorNum': selectedColorNum,
        'selectedPatternNum': selectedPatternNum,
        'brightnessLevel': brightnessLevel,
        'selectedFrequencyNum': selectedFrequencyNum,
    }

      # Define the path to save the JSON file
    file_path = 'output.json'

    # Save the JSON data to a file
    with open(file_path, 'w') as file:
        json.dump(json_data, file)

    # Return the file for download
    return send_file(file_path, as_attachment=True, download_name='output.json') 
'''

    #comment this to download JSON
    return jsonify(response_data), 200

if __name__ == '__main__':
    app.run(debug=True)
