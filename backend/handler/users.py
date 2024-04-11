from flask import jsonify, request
from dao.users import UsersDAO
from config.APIs import *
import re
from random import randint
from dotenv import load_dotenv

load_dotenv()

debugging = os.getenv('DEBUGGING')

class UserHandler():
    
    def create_user(self):

        ## Creo que tenemos que check lo del jwt pa saber las credenciales autenticadas y garantizar que solo el admin pueda hacer esta llamada
        ## aqui, antes de todo esto


        data = request.get_json()
        email = data.get('email')
        uName = data.get('name')

        if data.get('isAdmin'):
            isAdmin = data.get('isAdmin')
        else:
            isAdmin = False
        
        # return jsonify({"message": "all good hasta aqui"}), 200

        if not email:
            return jsonify({"error": "Email is required to create new user."}), 400
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return jsonify({"error": "Invalid email format. Must follow the format user@example.com"}), 400
        if not uName:
            return jsonify({"error": "Name is required to create new user."}), 400
        if len(uName) > 20:
            return jsonify({"error": "Name is too long. Must be 20 characters or less."}), 400
        
        usr=UsersDAO()


        if usr.get_user_by_email(email) is not None:
            usr.close_connection()
            return jsonify({"error": "User with this email already exists."}), 400
        
        # Generate password with the password generator API
        if (debugging):
            password = 'Abc87.1.'
        else:
            password = generate_password(8)

        ###################################    Call al API de AZURE AD B2C #####################################
        
        #recuerda decirle al api que la proxima vez que haga login lo lleve a cambiar su password
        # https://learn.microsoft.com/en-us/graph/api/user-post-users?view=graph-rest-1.0&tabs=python

        # obtained from what the azure api call returns in the json (azure nos da el uid)
        if (debugging): ##########  Debugging offline. Luego, cuando se conecte lo del api de azure se puede dejar lo de debugging y que retorne el user id real
            userid = data.get('uid')
        else:
            userid = ''

        ########################################################################################################

        #check aqui. ya no me importa el user id solo quiero saber un bool pa si se creo ()
        # usr = UsersDAO()
        created=usr.create_user(userid, email, uName, isAdmin)
        

        # send email with password
        if created is not None:
            
            #################################sendgrid api
            # el mensaje va a decir que se creo una cuenta a su para ellos en la catalana pr. Se le va a enviar el email que se loggeo y el password randomly generado
            # tambien se le va a decir lo que podra hacer

            return jsonify({"message": f"Exitooooo. For debugging purposes we are returning the user id and name: {created}" }), 201

            ######################################
            
        else:
            return jsonify({"error": "user was not created. An error was encountered during with the db (Change comment, i need wifi first)"}), 400
        

    def delete_user(self):

        ## Check JWT here to ensure only admin can delete users



        data = request.get_json()
        email = data.get('email')

        usr = UsersDAO()
        uid = usr.get_user_by_email(email)

        if uid is None:
            usr.close_connection()
            return jsonify({"error": "User not found"}), 404
        

        ##########################################Call to azure api to delete user and pass uid or what it needs########

        



        ####################################################################################################################

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
        uid = usr.get_user_by_email(email)
        
        if uid is None:
            usr.close_connection()
            return jsonify({"error": "User not found"}), 404
            
            
        if (updated_email is not None) and (len(updated_email)>0):
            if not re.match(r"[^@]+@[^@]+\.[^@]+", updated_email):
                return jsonify({"error": "Invalid updated email format. Must follow the format user@example.com"}), 400
        elif (updated_name is not None) and (len(updated_name)>0):
            if len(updated_name) > 20:
                return jsonify({"error": "Name is too long. Must be 20 characters or less."}), 400
            

        ########################################### call to azure api to update user and pass uid or what it needs




        ####################################################################################################################

        # update local db
        updated_user = usr.update_user(email, updated_email, updated_name)
        if updated_user is None:
            return jsonify({"error": "User was not updated."}), 400
        else:
            return jsonify({"message": f"User updated: {updated_user}"}), 200