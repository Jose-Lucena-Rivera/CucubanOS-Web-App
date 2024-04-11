from flask import jsonify, request
from dao.buoys import *
from config.APIs import *
import re
import random
import string
from dotenv import load_dotenv

load_dotenv()

debugging = os.getenv('DEBUGGING')

class BuoyHandler():

    def generate_random_eui(self):
        """Generates a random EUI string (replace with specific EUI format if needed)"""
        # Define valid characters for EUI (modify based on your specific EUI format)
        valid_chars = string.ascii_uppercase + string.digits
        # Generate random characters
        random_string = ''.join(random.choice(valid_chars) for _ in range(16))
        # Prepend leading zeros (adjust for desired EUI length)
        return f"00{random_string}"


    def create_buoy(self):

        ########################### Check if user is logged in with valid token
        

        data = request.get_json()
        name = data.get('name')
        # location = data.get('location')
        description = data.get('description')

        if debugging:
            eui = self.generate_random_eui()
        else: 
            eui = data.get('eui')
        
        if not name:
            return jsonify({"error": "Name is required to create new buoy."}), 400
        if not eui:
            return jsonify({"error": "EUI is required to create new buoy."}), 400
        
        # if not description:
        #     return jsonify({"error": "Description is required to create new buoy."}), 400
        
        
        ##################################Call al API de CHIRPSTACK #####################################



        #################################################################################################



        buoy = BuoyDAO()
        if buoy.get_buoy_by_eui(eui) is not None:
            buoy.close_connection()
            return jsonify({"error": "Buoy with this eui already exists."}), 400
        
        if buoy.get_buoy_by_name(name) is not None:
            buoy.close_connection()
            return jsonify({"error": "Buoy with this name already exists."}), 400
        
        created = buoy.create_buoy(name, eui)
        if created is not None:
            return jsonify({"message": f"Buoy with name and EUI {created} has been created" }), 201

            
        else:
            return jsonify({"error": "Buoy was not created."}), 400
        
    def get_buoys(self):

        ########################### Check if user is logged in with valid token


        #######################################################################
        sort_by = request.args.get('sort_by')

        buoy = BuoyDAO()
        
        # buoys.get_all_buoys(sort_by)
        buoys = buoy.get_all_buoys()
        return jsonify({"message":"Las boyas no estan \"sorted by\" nada porque no he hablado con jose sobre eso xdd"},buoys),200
    
    def delete_buoy(self):
        ########################### Check if user is logged in with valid token


        #######################################################################

        data = request.get_json()
        eui = data.get('eui')
        name = data.get('name')
        if (not eui) and (not name):
            return jsonify({"error": "EUI or buoy name is required to delete buoy."}), 400

        buoy = BuoyDAO()

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
            


        ##################### DELETE IN CHIRPSTACK API ########################################
        

        ########################################################################################

        deleted = buoy.delete_buoy(eui, name)
        if deleted:
            return jsonify({"message": f"Buoy {name} with EUI {eui} has been deleted."}), 200
        else:
            return jsonify({"error": "Buoy was not deleted."}), 400