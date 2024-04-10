import requests
import os
from dotenv import load_dotenv


def generate_password(len):
    load_dotenv()
    API_key= os.getenv('PASSWORD_GENERATOR_API_KEY')
    URL="https://api.api-ninjas.com/v1/passwordgenerator?length={}&exclude_special_chars=true".format(len)
    
    response = requests.get(URL, headers={'X-Api-Key': API_key})
    
    if response.status_code == requests.codes.ok:
        password = response.json()['random_password']
        return password
        # print(response.text)
    else:
        return "Error"
        # print("Error:", response.status_code, response.text)
