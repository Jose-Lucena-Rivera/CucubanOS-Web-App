from flask import jsonify, request
from dao.buoys import *
from dao.chirspack_things import *
from config.APIs import *
import re
import random
import string
from dotenv import load_dotenv

# load_dotenv()

debugging = False#os.getenv('DEBUGGING') if not None else os.environ.get('DEBUGGING')

class BuoyHandler():

    # functions used for testing. Generated a random DevEUI and AppKey
    def generate_random_eui(self):
        """Generates a random EUI string (replace with specific EUI format if needed)"""
        """Generates a random 16-character hex string"""
        hex_digits = string.hexdigits
        random_string = ''.join(random.choice(hex_digits) for _ in range(16))
        return random_string

    def generate_random_app_key(self):
        """Generates a random EUI string (replace with specific EUI format if needed)"""
        """Generates a random 32-character hex string"""
        hex_digits = string.hexdigits
        random_string = ''.join(random.choice(hex_digits) for _ in range(32))
        print(len(random_string))
        return random_string

# creates a buoy. adds it to the database and to chirpstack
    def create_buoy(self):

        # get data from request
        data = request.get_json()
        print("Received buoy data:", data)
        name = data.get('name')
        description = data.get('description')

        eui = data.get('eui')
        app_key = data.get('appKey')

     
        # check if required fields are present and correctly formatted
        if not name:
            return jsonify({"error": "Name is required to create new buoy."}), 400
        if len(name) > 20:
            return jsonify({"error": "Name is too long. Must be 20 characters or less."}), 400
        if not eui:
            return jsonify({"error": "EUI is required to create new buoy."}), 400
        if not re.match(r'^[0-9a-fA-F]{16}$', eui):
            return jsonify({"error": "EUI must be a 16-character hex string."}), 400
        if not re.match(r'^[0-9a-fA-F]{32}$', app_key):
            return jsonify({"error": "App key must be a 32-character hex string."}), 400
        
        # convert EUI and app key to lowercase
        eui = eui.lower()
        app_key = app_key.lower()
        name = name.lower()

        # check if buoy with EUI or name already exists
        buoy = BuoyDAO()
        if buoy.get_buoy_by_eui(eui) is not None:
            buoy.close_connection()
            return jsonify({"error": "Buoy with this eui already exists."}), 400
        
        if buoy.get_buoy_by_name(name) is not None:
            buoy.close_connection()
            return jsonify({"error": "Buoy with this name already exists."}), 400
        
        
        # add buoy to chirpstack 
        add_chirp_device = ChirpstackThing()
        resp = add_chirp_device.add_device(eui, name, description)
        if resp is None:
            return jsonify({"error": "Buoy was not created"}), 400
       
        
        # add buoy to local database
        created = buoy.create_buoy(name, eui)
        if created is None:
            return jsonify({"error": "Buoy was not saved to database, but yes in Chirpstack."}), 400

        
        # add keys to device
        add_key_to_device = ChirpstackThing()
        resp1 = add_key_to_device.add_device_keys(eui, app_key)
        if resp1 is None:
            return jsonify({"error": "Keys were not added to device"}), 400

        # add device to multicast group
        # add_to_multi = ChirpstackThing()
        # resp2 = add_to_multi.add_device_to_multicast_group(eui) 
        # if resp2 is None:
        #     return jsonify({"error": "Device was not added to multicast group"}), 400 

        # # Successful creation of buoy
        # return jsonify({"message": f"Buoy with name and EUI {created} has been created and added to multicast group" }), 201
        
        # # Successful creation of buoy
        # return jsonify({"message": f"Buoy with name and EUI {created} has been created" }), 201

    #returns all buoys
    def get_buoys(self):
        buoy = BuoyDAO()
        buoys = buoy.get_all_buoys()
        return jsonify(buoys),200
    
    def get_buoy(self):
        
        # get data from request
        data = request.get_json()
        eui = data.get('eui')
        name = data.get('name')
        if (not eui) and (not name):
            return jsonify({"error": "EUI or buoy name is required to get buoy."}), 400

        # create instance of BuoyDAO
        buoy = BuoyDAO()
        eui = eui.lower()
        name = name.lower()

        # check if buoy exists. If eui was not provided, look for it by name (This is kinda redundant...)
        if not eui:
            eui = buoy.get_buoy_by_name(name)
            if not eui:
                buoy.close_connection()
                return jsonify({"error": "Buoy with this name does not exist."}), 400
        # if name was not provided, look for it by eui
        else:
            name = buoy.get_buoy_by_eui(eui)
            if not name:
                buoy.close_connection()
                return jsonify({"error": "Buoy with this EUI does not exist."}), 400

        # call function to get all information from buoy. uses the eui to get all information
        buoy_info=buoy.get_all_from_buoy(eui)
        return jsonify(buoy_info), 200
    
    #deletes a buoy from the database and from chirpstack
    def delete_buoy(self, bname):
        eui = None
        name = bname

        #checks that the needed data is present
        if (not eui) and (not name):
            return jsonify({"error": "EUI or buoy name is required to delete buoy."}), 400

        buoy = BuoyDAO()

        #checks if the buoy exists
        if not eui:
            name = name.lower() 
            eui = buoy.get_buoy_by_name(name)
            if not eui:
                buoy.close_connection()
                return jsonify({"error": f"Buoy with name {bname} does not exist."}), 400
        else:
            eui = eui.lower()
            name = buoy.get_buoy_by_eui(eui)
            if not name:
                buoy.close_connection()
                return jsonify({"error": "Buoy with this EUI does not exist."}), 400
            

        
        # DELETE IN CHIRPSTACK API 
        delete_chirp_buoy = ChirpstackThing()
        resp = delete_chirp_buoy.delete_device(eui)

        #delete buoy from database
        deleted = buoy.delete_buoy(eui, name)

        # checks if the buoy was deleted
        if deleted:
            return jsonify({"message": f"Buoy {name} with EUI {eui} has been deleted."}), 200
        else:
            return jsonify({"error": "Buoy was not deleted."}), 400
        


    #updates buoy data. Only used in testing
    def update_buoy(self, eui = None, updated_location = None, updated_bcolor = None, updated_battery = None, updated_frequency = None, updated_name = None, buoy_id = 0):
        data = request.get_json()
        eui = data.get('eui') if eui is None else eui
        name = data.get('name')

        ############################# Separar esto pa otra ruta (o sea, una ruta pa que el usuario actualice y otra
        ############################# para lo que recibamos de Chirpstack API) 
        updated_location = data.get('updated_location') if updated_location is None else updated_location
        updated_bcolor = data.get('updated_bcolor') if updated_bcolor is None else updated_bcolor
        updated_battery = data.get('updated_battery') if updated_battery is None else updated_battery
        updated_frequency = data.get('updated_frequency') if updated_frequency is None else updated_frequency
        #####################################


        updated_name = data.get('updated_name')
        updated_description = data.get('updated_description')
        updated_eui = data.get('updated_eui')  ##
        ## maybe also updated_eui = data.get('updated_eui') if we want to allow changing EUIs

        if (not eui) and (not name):
            return jsonify({"error": "EUI or buoy name is required to update buoy."}), 400

        buoy = BuoyDAO()
        ##test 
        if not eui: 
            eui = buoy.get_buoy_by_name(name)
            eui = eui.lower() 
            if not eui:
                buoy.close_connection()
                return jsonify({"error": "Buoy with this name does not exist."}), 400
        else:
            name = buoy.get_buoy_by_eui(eui)
            name = name.lower()
            if not name:
                buoy.close_connection()
                return jsonify({"error": "Buoy with this EUI does not exist."}), 400


        updates = []
        params = []
        if updated_name:
            updates.append("bName = %s")
            params.append(updated_name)
        if updated_eui:
            updates.append("bEUI = %s")
            params.append(updated_eui)

        ################################################# ruta de updates de chirpstack
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
        if buoy_id != 0:
            updates.append("id = %s")
            params.append(buoy_id)
        ################################################
        
        if not updates and not updated_description:
            buoy.close_connection()
            return jsonify({"error": "No updates provided."}), 400
        


        params.append(eui)

        updated = buoy.update_buoy(updates, params)
        if updated:
            return jsonify({"message": f"Buoy {name} with EUI {eui} has been updated."}, updated), 200
        else:
            return jsonify({"error": "Buoy was not updated."}), 400
        

    # gets the ids sent from the front end and stores them in the database
    def update_marker_ids(self):
        try:
            # Extract marker IDs and DevEUIs from the request data
            marker_ids_devEUIs = request.get_json()
            print("Data Recieved:", marker_ids_devEUIs)
            # Check if request data is None or empty
            if marker_ids_devEUIs is None:
                return jsonify({"error": "No JSON data received"}), 400

            # Check if 'markers' key exists and it's a list
            markers_list = marker_ids_devEUIs.get("markers")
            if not isinstance(markers_list, list):
                return jsonify({"error": "Invalid 'markers' format or missing 'markers' key"}), 400
            
            # message = ChirpstackThing()
            buoys = BuoyDAO()
            buoys = buoys.count_buoys()

            # Process the received marker IDs and DevEUIs
            for marker in markers_list:
                marker_id = marker.get("markerId")
                devEUI = marker.get("devEUI")

                if marker_id is None or devEUI is None:
                    return jsonify({"error": "Missing 'markerId' or 'devEUI' in marker data"}), 400
                # Your code to handle the marker ID and DevEUI goes here
                print("Marker ID:", marker_id)
                print("DevEUI:", devEUI)

                self.update_buoy(eui = devEUI, buoy_id = marker_id)
                
            # return a success response
            return jsonify({"message": "Marker IDs received successfully"}), 200

        except ValueError as ve:
            # JSON decoding error
            return jsonify({"error": "Invalid JSON data in the request: " + str(ve)}), 400

        except Exception as e:
            # Return an error response if something goes wrong
            return jsonify({"error": "An unexpected error occurred: " + str(e)}), 500

        

