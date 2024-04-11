from flask import jsonify, request
from dao.buoys import *
from config.APIs import *
import re
from random import randint
from dotenv import load_dotenv

load_dotenv()

debugging = os.getenv('DEBUGGING')

class ChirpstackThing():
    
    def add_device():
        pass