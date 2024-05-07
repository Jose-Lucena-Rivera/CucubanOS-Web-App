# from dotenv import load_dotenv

#  #using SendGrid's Python Library
# # https://github.com/sendgrid/sendgrid-python
# # import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import *
from dotenv import load_dotenv

load_dotenv()

# print (os.environ.get('SENDGRID_API_KEY'))

# # message = Mail(
# #     from_email='natanael.santiago2@upr.edu',
# #     to_emails='santiagonatanael017@gmail.com',
# #     subject='Sending with Twilio SendGrid is Fun',
# #     html_content='<strong>and easy to do anywhere, even with Python</strong>')
# # try:
# #     sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
# #     response = sg.send(message)
# #     print(response.status_code)
# #     print(response.body)
# #     print(response.headers)
# # except Exception as e:
# #     print(e)


# import os
# from sendgrid import SendGridAPIClient

# # # Replace with your actual API key
# # sg = SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))

# # def send_email(to_email, subject, content):
# #     data = {
# #       "personalizations": [
# #           {
# #               "to": [
# #                   {
# #                       "email": to_email
# #                   }
# #               ]
# #           }
# #       ],
# #       "from": {
# #           "email": "natanael.santiago2@upr.edu"  # Replace with your sender email
# #       },
# #       "subject": subject,
# #       "content": [
# #           {
# #               "type": "text/plain",
# #               "value": content
# #           }
# #       ]
# #   }

# #     response = sg.client.mail.send.post(request_body=data)
# #     # Handle the response based on the status code
# #     print(response.status_code)


# # send_email("natanael.santiago2@upr.edu", "Hello", "Hello, this is a test email manitoooou")


# def send_hello_email():
#     # Assumes you set your environment variable:
#     # https://github.com/sendgrid/sendgrid-python/blob/HEAD/TROUBLESHOOTING.md#environment-variables-and-your-sendgrid-api-key
#     message = build_hello_email()
#     sendgrid_client = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
#     response = sendgrid_client.send(message=message)
#     print(response.status_code)
#     print(response.body)
#     print(response.headers)




# using SendGrid's Python Library
# https://github.com/sendgrid/sendgrid-python
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

mail = Mail()
mail.from_email = Email('natanael2012@icloud.com')
mail.template_id = 'd-c3f2266be9b54c419e7c3451ff5174bf'
p = Personalization()
p.add_to(Email('santiagonatanael017@gmail.com'))
# p.dynamic_template_data = {
#    'name': 'Bob',
#    'balance': 42
# }
mail.add_personalization(p)

sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
response = sg.client.mail.send.post(request_body=mail.get())
print(response.status_code)
print(response.headers)
print(response.body)