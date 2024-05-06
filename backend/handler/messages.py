from flask import jsonify, request
from dao.buoys import *
from dao.chirspack_things import *
from config.APIs import *
import re
import random
import string
from dotenv import load_dotenv

load_dotenv()

debugging = os.getenv('DEBUGGING') if not None else os.environ.get('DEBUGGING')

class MessageHandler():
    def multicast(self):

        #####################################################Validate user##########################

        data = request.get_json()
        payload = data.get('payload')

        # if debugging:
        #     payload = 0xABCD12345

        if not payload and not debugging: ################################################################## FOR DEBUGGING
            return jsonify({"error": "Payload is required to send message to buoy."}), 400
        if not (len(payload)%2==0):
            return jsonify({"error": "Payload must be a hex string (or bytes)."}), 400
        
        
        
        # payload = bytes.fromhex(payload)     #### aqui supuestamente el payload ya esta en formato the hex (o bytes). La cuestion es que tengo que ver lo que jose me manda pa procesarlo bien
        payload = bytes([1, 2, 3, 4, 5])
        
        

        message = ChirpstackThing()
        resp = message.send_multicast_queue(payload)
        print (resp)

        if resp is None:
            return jsonify({"error": "Error sending message to buoys."}), 400
        
        return jsonify({"message": f"Message {payload} sent to buoys."}), 200
    

    def send_one_buoy_data(self):
        data=request.get_json()
        eui = data.get('eui')
        name = data.get('name')
        # payload = data.get('payload')             #: ## still not sure como me van a mandar el payload
        color = data.get("selectedColorNum")        #: 1, 
        pattern= data.get("selectedPatternNum")     #: 2, 
        brightness=data.get("brightnessLevel")      #: 4, 
        frequency=data.get("selectedFrequencyNum")  #: 4

        payload = data.get("payload")

        if (not eui) and (not name):
            return jsonify({"error": "EUI or buoy name is required to update buoy."}), 400
        
        # if not payload and not debugging: ################################################################## FOR DEBUGGING
        #     return jsonify({"error": "Payload is required to send message to buoy."}), 400
        # if not (len(payload)%2==0):
        #     return jsonify({"error": "Payload must be a hex string (or bytes)."}), 400
       
       
        ## assuming que el payload ya esta en hex
        payload = bytes.fromhex(payload) #######################aquí tengo que ver como me mandan el payload para procesarlo bien
        print(payload)
        

        buoy = BuoyDAO()
        name = name.lower()
        eui= eui.lower()

        if not eui:
            eui = buoy.get_buoy_by_name(name)
            if not eui:
                buoy.close_connection()
                return jsonify({"error": "Buoy with this name does not exist."}), 400
        else:
            name = buoy.get_buoy_by_eui(eui)
            if not name:
                buoy.close_connection()
                return jsonify({"error": "Buoy with this EUI does not exist."}), 400
        buoy.close_connection()




        message = ChirpstackThing()
        resp = message.send_message_to_one_buoy(payload, eui )

        if resp is None:
            return jsonify({"error": "Error sending message to buoys."}), 400
        
        return jsonify({"message": "Message sent to buoys."}), 200
    

    def see_multimessage(self):
        message = ChirpstackThing()
        resp = message.get_multicast_queue()

        if resp is None:
            return jsonify({"error": "Error getting messages from buoys."}), 400
        
        return jsonify({"message": f"Messages: {resp}"}), 200
    

    def chirpstack_updates(self): ################################for processing lo que chirpstack me manda a traves de http
        
            print(request.get_json())

            return jsonify({"message": "Chirpstack updates received.", "json":request.get_json()}), 200
        


    def deploy_buoy(self):
        data = request.json
    
        # Define the desired order of keys
        ordered_keys = ['selectedColorNum', 'selectedPatternNum', 'brightnessLevel', 'selectedFrequencyNum']

        # Create a new dictionary with keys in the desired order
        ordered_data = {key: data.get(key) for key in ordered_keys}

        # Process the received data
        colors = ordered_data.get('selectedColorNum')
        pattern = ordered_data.get('selectedPatternNum')
        brightness = ordered_data.get('brightnessLevel')
        frequency = ordered_data.get('selectedFrequencyNum')

        if type(pattern) != int:
            return jsonify({"message": "Pattern must be an integer"}), 400
        if pattern not in range(0,8):
            return jsonify({"message": "Pattern must be between 0 and 7"}), 400
        
        # if (colors[] not in range(0, 33)):
        #     return jsonify({"error": "Color must be an integer between 0 and 32"}), 400
        if not all(isinstance(color, int) and 0 <= color <= 32 for color in colors):
            return jsonify({"error": "All colors must be integers between 0 and 32"}), 400
        
        if type(brightness) != int or (brightness not in range (0, 6)):
            return jsonify({"error": "Brightness must be an integer between 0 and 5"})
        
        if type(frequency) != int or (frequency not in range (0,6)):
            return jsonify({"error": "Frequency must be an integer between 0 and 5"})

        payload = bytes (colors) + bytes([brightness]) + bytes([frequency]) + bytes([pattern])

        # message = ChirpstackThing()

        # resp = message.send_multicast_queue(payload)
        # print (resp)

        # if resp is None:
        #     return jsonify({"error": "Error sending message to buoys."}), 400
        
        # buoys = BuoyDAO()
        # for i in range(len(colors)):
        #     if not buoys.update_color(i+1, colors[i]):
        #         return jsonify({"error": f"Error updating buoy {i+1} colors."}), 400
        # buoys.close_connection()
        
        return jsonify({"message": f"Message {payload} sent to buoys.", "ordered data":ordered_data}), 200


    def delete_multicast_queue(self):
        message = ChirpstackThing()
        resp = message.flush_multicast_queue()

        if resp is None:
            return jsonify({"error": "Error flushing messages from multicast queue."}), 400
        
        return jsonify({"message": f"Multicast queue flushed: {resp}"}), 200