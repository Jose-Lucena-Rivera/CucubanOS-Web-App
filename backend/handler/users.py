from flask import jsonify, request
from dao.users import UsersDAO
from config.APIs import *
import re
from random import randint
from dotenv import load_dotenv
import os
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

load_dotenv()

debugging = os.getenv('DEBUGGING') if not None else os.environ.get('DEBUGGING')
pepper = os.getenv('PEPPER') if not None else os.environ.get('PEPPER')
secret_key = os.environ.get('SECRET_KEY')

failed_login_attempts = {}


def validate_password(password):
    password_regex = r"^(?=.*[0-9]).{8,12}$"
    if re.match(password_regex, password):
        return True
    else:
        return False

class UserHandler():
    
    def create_user(self):

        ## Creo que tenemos que check lo del jwt pa saber las credenciales autenticadas y garantizar que solo el admin pueda hacer esta llamada
        ## aqui, antes de todo esto


        data = request.get_json()
        email = data.get('email')
        uName = data.get('name')
        password = data.get('password')

        
        # return jsonify({"message": "all good hasta aqui"}), 200

        if not email:
            return jsonify({"error": "Email is required to create new user."}), 400
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return jsonify({"error": "Invalid email format. Must follow the format user@example.com"}), 400
        if not uName:
            return jsonify({"error": "Name is required to create new user."}), 400
        if len(uName) > 20:
            return jsonify({"error": "Name is too long. Must be 20 characters or less."}), 400
        if not password:
            return jsonify({"error": "Password is required to create new user."}), 400
        if len(password) < 8 :
            return jsonify({"error": "Invalid password. Must be at least 8 characters long."}), 400
        
        usr=UsersDAO()


        if usr.get_user_by_email(email) is not None:
            usr.close_connection()
            return jsonify({"error": "User with this email already exists."}), 400
        

       
        #check aqui. ya no me importa el user id solo quiero saber un bool pa si se creo ()
        # usr = UsersDAO()
        ph = PasswordHasher()
        hashed_password = ph.hash(pepper + password)
        created=usr.create_user(email, uName, hashed_password)
        

        # send email with password
        if created is not None:
            
            #################################sendgrid api
            # el mensaje va a decir que se creo una cuenta a su para ellos en la catalana pr. Se le va a enviar el email que se loggeo y el password randomly generado
            # tambien se le va a decir lo que podra hacer

            return jsonify({"message": f"Success. User with name: {created} was created." }), 201

            ######################################
            
        else:
            return jsonify({"error": "user was not created. An error was encountered during with the db (Change comment, i need wifi first)"}), 400
        

    def delete_user(self):

        ############# Check JWT here to ensure only admin can delete users
        #### Check identity of the user (with the token??)

        ############ Check if email is valid (como en create user)


        data = request.get_json()
        email = data.get('email')

        usr = UsersDAO()
        uname = usr.get_user_by_email(email)

        if uname is None:
            usr.close_connection()
            return jsonify({"error": "User not found"}), 404
        
        # delete from local db

        deleted=usr.delete_user(email)
        if deleted is None:
            return jsonify({"error": "User was not deleted. An error was encountered with the db"}), 400
        else:
            return jsonify({"message": f"User deleted: {deleted}"}), 200
        
        
    def update_user(self):

        ## Check JWT here to ensure only admin (or any logged in user??) can update users
        ## a logged in user may only update their own info, not others

        ##Get email from JWT
        email = None

        data = request.get_json()

        if debugging:
            email = data.get('email')

        updated_email = data.get('updated_email')
        updated_name = data.get('updated_name')

        usr = UsersDAO()
        uname = usr.get_user_by_email(email)
        
        if uname is None:
            usr.close_connection()
            return jsonify({"error": "User not found"}), 404
            
            
        if (updated_email is not None) and (len(updated_email)>0):
            if not re.match(r"[^@]+@[^@]+\.[^@]+", updated_email):
                return jsonify({"error": "Invalid updated email format. Must follow the format user@example.com"}), 400
        elif (updated_name is not None) and (len(updated_name)>0):
            if len(updated_name) > 20:
                return jsonify({"error": "Name is too long. Must be 20 characters or less."}), 400
            

        # update local db
        updated_user = usr.update_user(email, updated_email, updated_name)
        if updated_user is None:
            return jsonify({"error": "User was not updated."}), 400
        else:
            return jsonify({"message": f"User updated: {updated_user}"}), 200
        

    def get_user(self):

        ## Check token to ensure user is logged in and can view their own info

        ##########################################

        data = request.get_json()
        email = data.get('email')
        usr = UsersDAO()
        user = usr.get_user(email)
        usr.close_connection()
        
        if user is None:
            return jsonify({"error": "User not found"}), 404
        else:
            return user
        

    def get_all_users(self):
        
        ## Check token to ensure user is logged in and can view all users or

        ##########################################

        usr = UsersDAO()
        users = usr.get_all_users()
        if users is None:
            return jsonify({"error": "No users found"}), 404
        else:
            return jsonify({"message": f"Users found: "}, users), 200
        

    def verify_password(self):
        try:
            # Get the email and current password from the query parameters
            args = request.args
            email = args.get('email')
            current_password = args.get('currentPassword')

            # Check if email and current password are provided
            if not email or not current_password:
                return jsonify({'message': 'Email and current password are required.', 'success': False}), 400

            
            # Fetch the user from the database using the email
            users_dao = UsersDAO()
            user = users_dao.get_user(email)
            users_dao.close_connection()

            if user is not None:
                password = pepper + current_password
                ph = PasswordHasher()
                
                # Compare the current password with the hashed password stored in the database
                try:
                    ph.verify(user["password"], password)
                    return jsonify({'success': True}), 200
                except VerifyMismatchError as e:
                    return jsonify({'success': False, 'message': 'Incorrect current password'}), 401
            
            else:
                return jsonify({'success': False, 'message': 'User not found'}), 404
        
        except Exception as e:
            return jsonify({'message': str(e), 'success': False}), 500
        
            

    # Helper method to update the password in the database
    def update_password(self):
        data = request.get_json()
        email = data.get('email')
        new_password = data.get('newPassword')
        
        # Check if new_password is not null
        if new_password is None:
            return jsonify({"error": "New password cannot be null"}), 400
        
        # 
        if not validate_password(new_password):
            return jsonify({"error": "Invalid password. Must be at least 8 characters long and contain at least one digit."}), 400
        
        new_password = pepper + new_password
        
        try:
            user_dao = UsersDAO()
            user = user_dao.get_user(email)

            if user is None:
                return jsonify({"error": "User not found"}), 404
            
            ph = PasswordHasher()

            # Check if the new password is the same as the current password
            try:
                ph.verify(user["password"], new_password)
                return jsonify({"error": "New password must be different from the current password"}), 400

            except Exception as e:
                new_password = ph.hash(new_password)
                updated = user_dao.update_password(email, new_password)
            
            # act depending if the password was updated or not
            if updated:
                return jsonify({"message": "Password updated successfully"}), 200
            else:
                return jsonify({"error": "Failed to update password"}), 500
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        


    def login(self):
        try:
             # Define MAX_LOGIN_ATTEMPTS here
            MAX_LOGIN_ATTEMPTS = 10

            # Get the email and password from the request body
            data = request.json
            email = data.get('email')
            password = data.get('password')

            # Check if email and password are provided
            if not email or not password:
                return jsonify({'message': 'Email and password are required.'}), 400

            # Connect to the PostgreSQL database
            user = UsersDAO()
            usr = user.get_user(email)
            user.close_connection()

            if usr is None:
                return jsonify({'message': 'User does not exist'}), 401

            ph = PasswordHasher()
            password = pepper + password

            try:
                v=ph.verify(usr["password"], password) ### the error is here
                print (v)
                
            except Exception as e:
#####
                print(e)
                # Increment failed login attempts counter for this user
                failed_attempts = failed_login_attempts.get(email, 0) + 1
                failed_login_attempts[email] = failed_attempts

                # Log the number of failed login attempts for this user
                print(f"Failed login attempts for {email}: {failed_attempts}")

                # Check if the user has exceeded the maximum attempts
                if failed_attempts >= MAX_LOGIN_ATTEMPTS:
                    return jsonify({'message': 'You have been locked due to failed login attempts. Please try again in 5 minutes.'}), 401
                else:
#####
                    return jsonify({'message': 'Invalid password.'}), 401


            # Reset failed login attempts for this user
            failed_login_attempts.pop(email, None)

            # Generate JWT token
            token = jwt.encode({'email': email}, secret_key, algorithm='HS256')

            print("Generated Token:", token)
            return jsonify({'token': token}), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500