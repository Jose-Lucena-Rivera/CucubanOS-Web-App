from argon2 import PasswordHasher
from dotenv import load_dotenv
import os

load_dotenv()
key = os.getenv('SECRET_KEY')

ph = PasswordHasher()

password = input('What is your password?\n')
password = key + password

hash = ph.hash(password)
print (hash)

print(ph.verify(hash, password))

p2 = input('What is your password again?\n')
p2 = key + p2
# print (p2)
try:
    f = ph.verify(hash, p2)
except Exception as e:
    
    f = False

if not f:
    print('imbecile. you are wrong')
else:
    print ('good job bby they!')