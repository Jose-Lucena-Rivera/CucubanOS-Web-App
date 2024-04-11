# from config.dbconfig import pg_config
import psycopg2
from flask import current_app
import os
from dotenv import load_dotenv

class UsersDAO():
    def __init__(self):
       
        load_dotenv()
        self.conn = psycopg2.connect(os.getenv('DATABASE_URL'))

    def close_connection(self):
        self.conn.close()


    def create_user(self, userid, email, uName, isAdmin = False):
        cursor = self.conn.cursor()
        created = None
        try:
            query = "INSERT INTO users (id, email, uname, isadmin) VALUES (%s, %s, %s, %s) RETURNING id, uname;"
            cursor.execute(query, (userid, email, uName, isAdmin))
            created = cursor.fetchone()
            self.conn.commit()
            
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            self.conn.close()
        return created
    
    def get_user_by_email(self, email):
        cursor = self.conn.cursor()

        query = "select id from users where email = %s;"
        cursor.execute(query, (email,))
        uid = cursor.fetchone()[0] if cursor.rowcount > 0 else None
        print ("user id: ",uid)
        cursor.close()
        # self.conn.close()
        return uid
    
    def delete_user(self, email):
        cursor = self.conn.cursor()
        deleted = None
        try:
            query = "DELETE FROM users WHERE email = %s RETURNING id, uname, email;"
            cursor.execute(query, (email,))
            deleted = cursor.fetchone()
            self.conn.commit()
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            self.conn.close()
        return deleted
    
    def update_user(self, email, updated_email, updated_name):
        cursor = self.conn.cursor()
        updated = None
        updates = []
        params = []

        if (len(updated_email)>0) and (updated_email is not None):
            updates.append("email = %s")
            params.append(updated_email)

        if (updated_name is not None) and (len(updated_name)>0)  :
            updates.append("uname = %s")
            params.append(updated_name)
        
        if not updates:
            cursor.close()
            self.conn.close()
            return None
        
        params.append(email)

        try:
            query = f"UPDATE users SET {', '.join(updates)} WHERE email = %s RETURNING id, uname, email;"
            cursor.execute(query, params)
            updated = cursor.fetchone()
            self.conn.commit()
        
        except Exception as e:
            print(e)

        finally:
            cursor.close()
            self.conn.close()

        return updated
