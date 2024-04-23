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
        
        
        
        payload = bytes.fromhex(payload)     #### aqui supuestamente el payload ya esta en formato the hex (o bytes). La cuestion es que tengo que ver lo que jose me manda pa procesarlo bien

        # payload = hex(int(payload, 16))
        # payload = bytes.fromhex(payload[2:]) # remove the 0x from the hex string
        # print (payload)
        ################# idk what to do with the data
        # payload=bytes([0x01, 0x02, 0x03])

        message = ChirpstackThing()
        resp = message.send_multicast_queue(payload)

        if resp is None:
            return jsonify({"error": "Error sending message to buoys."}), 400
        
        return jsonify({"message": f"Message {payload} sent to buoys."}), 200
    

    def send_one_buoy_data(self):
        data=request.get_json()
        eui = data.get('eui')
        name = data.get('name')
        payload = data.get('payload')   ### still not sure como me van a mandar el payload
        color = data.get("selectedColorNum")        #: 1, 
        pattern= data.get("selectedPatternNum")     #: 2, 
        brightness=data.get("brightnessLevel")      #: 4, 
        frequency=data.get("selectedFrequencyNum")  #: 4

        if (not eui) and (not name):
            return jsonify({"error": "EUI or buoy name is required to update buoy."}), 400
        
        if not payload and not debugging: ################################################################## FOR DEBUGGING
            return jsonify({"error": "Payload is required to send message to buoy."}), 400
        if not (len(payload)%2==0):
            return jsonify({"error": "Payload must be a hex string (or bytes)."}), 400
       
       
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
        if request.method == 'POST':
            # print(request.get_json())

            return jsonify({"message": "Chirpstack updates received.", "json":request.get_json()}), 200
        