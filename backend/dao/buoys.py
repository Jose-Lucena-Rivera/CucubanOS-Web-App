import psycopg2
from flask import current_app
import os
from dotenv import load_dotenv

database_url = os.environ.get('DATABASE_URL')
class BuoyDAO():
    def __init__(self):
        load_dotenv()
        self.conn = psycopg2.connect(database_url)

    def close_connection(self):
        self.conn.close()

    # when only the eui is given, this function returns the name of the buoy
    def get_buoy_by_eui(self, eui):
        cursor = self.conn.cursor()

        query = "select bName from buoy where bEUI = %s;"
        cursor.execute(query, (eui,))
        bName = cursor.fetchone()[0] if cursor.rowcount > 0 else None
        cursor.close()
        # self.conn.close()
        return bName
    
    # when only the name is given, this function returns the eui of the buoy
    def get_buoy_by_name(self, name):
        cursor = self.conn.cursor()

        query = "select bEUI from buoy where bName = %s;"
        cursor.execute(query, (name,))
        bEUI = cursor.fetchone()[0] if cursor.rowcount > 0 else None
        cursor.close()
        # self.conn.close()
        return bEUI
    
    # selects everything for a specific buoy
    def get_all_from_buoy(self, eui):
        cursor = self.conn.cursor()
        query = "SELECT * FROM buoy WHERE bEUI = %s;"
        cursor.execute(query, (eui,))
        result = cursor.fetchall() if cursor.rowcount > 0 else None
        cursor.close()
        self.conn.close()
        return result
    
    # adds a new buoy to the database
    def create_buoy(self, name, eui):
        cursor = self.conn.cursor()
        created = None
        try:
            query = "INSERT INTO buoy (bName, bEUI) VALUES (%s, %s) RETURNING bName, bEUI;"
            cursor.execute(query, (name, eui))
            created = cursor.fetchone()
            self.conn.commit()
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            self.conn.close()
        return created
    
    #selects everything from the buoys table
    def get_all_buoys(self):
        cursor = self.conn.cursor()
        query = "SELECT * FROM buoy;"
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        self.conn.close()
        return result
    
    # deletes a specific buoy from the database
    def delete_buoy(self, eui, name):
        cursor = self.conn.cursor()
        deleted = None
        try:
            query = "DELETE FROM buoy WHERE bEUI = %s AND bName = %s RETURNING bName, bEUI;"
            cursor.execute(query, (eui, name))
            deleted = cursor.fetchone()
            self.conn.commit()
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            self.conn.close()
        return deleted
    
    # updates buoy information in the database
    def update_buoy(self, updates, params):
        cursor = self.conn.cursor()
        updated = None
        try:
            query = "UPDATE buoy SET " + ", ".join(updates) + " WHERE bEUI = %s RETURNING *;"
            cursor.execute(query, params)
            updated = cursor.fetchone()
            self.conn.commit()
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            self.conn.close()
        return updated

    # counts the buoys in the database. not used.     
    def count_buoys(self):
        cursor = self.conn.cursor()
        query = "SELECT COUNT(*) FROM buoy;"
        cursor.execute(query)
        count = cursor.fetchone()[0]
        cursor.close()
        self.conn.close()
        return count
    
    # updates the frequency of a buoy in the database
    def set_frequency(self, f):
        cursor = self.conn.cursor()
        try:
            query = "UPDATE buoy SET frequency = %s;"
            cursor.execute(query, (f,))
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print(e)
        finally:
            cursor.close()
            self.conn.close()

    # updates the color of a buoy in the database
    def update_color(self, id, color, frequency):
        cursor = self.conn.cursor()
        try:
            query = "UPDATE buoy SET bcolor = %s, bfrequency = %s WHERE id = %s RETURNING bEUI;"
            cursor.execute(query, (color,frequency, id))
            devEUI = cursor.fetchone()[0]
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print(e)
        finally:
            cursor.close()
            return devEUI
        
    # updates the battery level of a buoy in the database
    def update_batterylevel(self, devEUI, battery):
        cursor = self.conn.cursor()
        try:
            query = "UPDATE buoy SET bbattery = %s WHERE beui = %s;"
            cursor.execute(query, (battery, devEUI))
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print(e)
        finally:
            cursor.close()
            self.conn.close()
            return True
        

    # updates the location of a buoy in the database
    def update_location(self, devEUI, location):
        cursor = self.conn.cursor()
        try:
            query = "UPDATE buoy SET blocation = %s WHERE beui = %s;"
            cursor.execute(query, (location, devEUI))
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print(e)
            return False
        finally:
            cursor.close()
            self.conn.close()
        
        return True