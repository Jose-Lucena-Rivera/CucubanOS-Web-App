# from config.dbconfig import pg_config
import psycopg2
from flask import current_app
import os
from dotenv import load_dotenv


database_url = os.getenv('DATABASE_URL') if not None else os.environ.get('DATABASE_URL')
class UsersDAO():
    def __init__(self):
       
        load_dotenv()
        self.conn = psycopg2.connect(database_url)

    def close_connection(self):
        self.conn.close()

    


    def create_user(self, email, uName, password):
        cursor = self.conn.cursor()
        created = None
        try:
            query = "INSERT INTO users (email, uname, password) VALUES (%s, %s, %s) RETURNING uname;"
            cursor.execute(query, (email, uName, password))
            created = cursor.fetchone()
            self.conn.commit()
            
        except Exception as e:
            self.conn.rollback()
            print(e)
        finally:
            cursor.close()
            self.conn.close()
        return created
    
    def get_user_by_email(self, email):
        cursor = self.conn.cursor()
        uname = None
        try:
            print("Attempting to fetch user with email:", email)  # Debug print statement
            query = "SELECT uname FROM users WHERE email = %s;"
            cursor.execute(query, (email,))
            if cursor.rowcount > 0:
                uname = cursor.fetchone()[0]
                print("User found with ID:", uname)  # Debug print statement
            else:
                print("No user found with email:", email)  # Debug print statement
        except Exception as e:
            print("Error fetching user by email:", e)
        finally:
            cursor.close()
        return uname
    
    def get_user(self, email):
        cursor = self.conn.cursor()
        query = "SELECT * FROM users WHERE email = %s;"
        cursor.execute(query, (email,))
        result = cursor.fetchone() if cursor.rowcount > 0 else None
        cursor.close()
        # self.conn.close()
    # Ensure that the result is converted to a dictionary with column names as keys
        return dict(zip([column[0] for column in cursor.description], result)) if result else None
    

    def get_all_users(self):
        cursor = self.conn.cursor()
        query = "SELECT * FROM users;"
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        self.conn.close()
        return result

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
            self.conn.rollback()
            print(e)

        finally:
            cursor.close()
            self.conn.close()

        return updated
    
    def get_password(self, email):
        cursor = self.conn.cursor()
        query = "SELECT password FROM users WHERE email = %s;"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        cursor.close()
        self.conn.close()
        return result[0] if result else None
    
    def update_password(self, email, new_password):
        cursor = self.conn.cursor()
        updated = None
        try:
            # Check if new_password is not null
            if new_password is None:
                raise ValueError("New password cannot be null")
            
            query = "UPDATE users SET password = %s WHERE email = %s RETURNING uname, email;"
            cursor.execute(query, (new_password, email))
            updated = cursor.fetchone()
            self.conn.commit()
        except Exception as e:
            print(e)
            self.conn.rollback()  # Roll back the transaction if an error occurs
            return False  # Return False or handle the error in an appropriate way
        finally:
            cursor.close()
            self.conn.close()
        return updated


    def forgotten_password (self, email, hashed_token, expiration):
        cursor = self.conn.cursor()
        try:
            query = "UPDATE users SET forgot_password_hash = %s, hash_expiration_date = %s WHERE email = %s;"
            cursor.execute(query, (hashed_token, expiration, email))
            self.conn.commit()
        except Exception as e:
            print(e)
            self.conn.rollback()  # Roll back the transaction if an error occurs
            return False  # Return False or handle the error in an appropriate way
        finally:
            cursor.close()
            self.conn.close()
        return True