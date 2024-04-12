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
        """Generates a random 16-character hex string"""
        hex_digits = string.hexdigits
        random_string = ''.join(random.choice(hex_digits) for _ in range(16))
        return random_string


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
        return jsonify({"message":"Buoys in local database"},buoys),200
    
    def get_buoy(self):
        ########################### Check if user is logged in with valid token


        #######################################################################

        data = request.get_json()
        eui = data.get('eui')
        name = data.get('name')
        if (not eui) and (not name):
            return jsonify({"error": "EUI or buoy name is required to get buoy."}), 400

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

        buoy_info=buoy.get_all_from_buoy(eui)
        return jsonify(buoy_info), 200
    
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
        


    def update_buoy(self):
        ########################### Check if user is logged in with valid token


        #######################################################################
        data = request.get_json()
        eui = data.get('eui')
        name = data.get('name')

        print(data)

        updated_name = data.get('updated_name')
        updated_location = data.get('updated_location')
        updated_bcolor = data.get('updated_bcolor')
        updated_battery = data.get('updated_battery')
        updated_frequency = data.get('updated_frequency')
        updated_description = data.get('updated_description')

        if (not eui) and (not name):
            return jsonify({"error": "EUI or buoy name is required to update buoy."}), 400

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

        updates = []
        params = []
        if updated_name:
            updates.append("bName = %s")
            params.append(updated_name)
        if updated_location:
            updates.append("bLocation = %s")
            params.append(updated_location)
        if updated_bcolor:
            updates.append("bColor = %s")
            params.append(updated_bcolor)
        if updated_battery:
            updates.append("bBattery = %s")
            params.append(updated_battery)
        if updated_frequency:
            updates.append("bFrequency = %s")
            params.append(updated_frequency)
        
        
        if not updates and not updated_description:
            buoy.close_connection()
            return jsonify({"error": "No updates provided."}), 400
        

        #################################### UPDATE IN CHIRPSTACK API ########################################


        ####################################################################################################


        
        params.append(eui)

        updated = buoy.update_buoy(updates, params)
        if updated:
            return jsonify({"message": f"Buoy {name} with EUI {eui} has been updated."}, updated), 200
        else:
            return jsonify({"error": "Buoy was not updated."}), 400