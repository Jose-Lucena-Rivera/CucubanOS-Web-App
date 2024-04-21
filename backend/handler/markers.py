from flask import Flask, request, jsonify

app = Flask(__name__)

buoy_coordinates = []

@app.route('/add_buoy', methods=['POST'])
def add_buoy():
    data = request.json
    lat = data.get('lat')
    lng = data.get('lng')
    
    if lat and lng:
        buoy_coordinates.append({'lat': lat, 'lng': lng})
        
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True)
