from config.dbconfig import pg_config
import psycopg2
from flask import current_app
import os
from dotenv import load_dotenv

class UsersDAO():
    def __init__(self):
       
        load_dotenv()
        self.conn = psycopg2.connect(os.getenv('DATABASE_URL'))


    def create_user(self, userid, email, uName, isAdmin = False):
        cursor = self.conn.cursor()
        created = None
        try:
            query = "INSERT INTO users (id, email, uname, isadmin) VALUES (%s, %s, %s, %s) RETURNING id, uname;"
            cursor.execute(query, (userid, email, uName, isAdmin))
            created = cursor.fetchone()
            print (created)
            self.conn.commit()
            
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            self.conn.close()
        return created
    
    def get_user_by_email(self, email):
        cursor = self.conn.cursor()

        query = "select * from users where email = %s;"
        cursor.execute(query, (email,))
        exists = cursor.fetchone()
        cursor.close()
        # self.conn.close()
        return exists is not None