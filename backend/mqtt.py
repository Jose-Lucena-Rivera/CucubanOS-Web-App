import paho.mqtt.client as mqtt

# Define mqtt broker details
broker_address = "your_broker_address"
topic_to_publish = "your_topic"
on_message = None

# Remember to add the client
mqtt_client = None

def connect_mqtt():
    global mqtt_client
    mqtt_client = mqtt.Client()  # create new instance
    mqtt_client.connect(broker_address)  # connect to broker

def publish_message(message):
    if mqtt_client is not None:
        mqtt_client.publish(topic_to_publish, message)

def subscribe_message():
    if mqtt_client is not None:
        mqtt_client.subscribe(topic_to_publish)
        mqtt_client.on_message = on_message