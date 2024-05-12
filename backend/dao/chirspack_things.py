from flask import jsonify, request
from dao.buoys import *
from config.APIs import *
import random
import string
from dotenv import load_dotenv

import os
import sys
import grpc
from chirpstack_api import api

# load_dotenv()

debugging = True#os.getenv('DEBUGGING') if not None else os.environ.get('DEBUGGING')
# server = os.getenv('TEST_CHIRPSTACK_URL')
# application_id = os.getenv('TEST_CHIRPSTACK_APP_ID')
# api_token = os.getenv('TEST_CHIRPSTACK_API_KEY')
# device_profile_id = os.getenv('TEST_DEVICE_PROFILE_ID')
# multicast_group_id = os.getenv('TEST_MULTICAST_GROUP_ID')

server = os.environ.get('CHIRPSTACK_URL')
application_id = os.environ.get('CHIRPSTACK_APP_ID')
api_token =  os.environ.get('CHIRPSTACK_API_KEY')
device_profile_id = os.environ.get('CHIRPSTACK_DEVICE_PROFILE_ID')
multicast_group_id = os.environ.get('CHIRPSTACK_MULTICAST_GROUP_ID')

class ChirpstackThing():
   
    def add_device(self, device_eui, device_name, description):
       
        
        channel = grpc.insecure_channel(server)
        client = api.DeviceServiceStub(channel)
        auth_token = [("authorization", "Bearer %s" % api_token)]

        try :
            req = api.CreateDeviceRequest()
            req.device.dev_eui = device_eui
            req.device.name = device_name
            # req.device.description = description
            req.device.application_id = application_id
            req.device.device_profile_id = device_profile_id
            req.device.skip_fcnt_check = False
            req.device.is_disabled = False
            resp = client.Create(req, metadata=auth_token)
        except grpc.RpcError as e:
            print('exception: '+ str(e))
            return None
        
        return resp
        # return None

    def delete_device (self, device_eui):
        channel = grpc.insecure_channel(server)
        client = api.DeviceServiceStub(channel)
        auth_token = [("authorization", "Bearer %s" % api_token)]

        try:
            req = api.DeleteDeviceRequest()
            req.dev_eui = device_eui
            resp = client.Delete(req, metadata=auth_token)
        except grpc.RpcError as e:
            print('exception: '+ str(e))
            return None
        # print (resp)
        return resp
    

    def add_device_to_multicast_group(self, device_eui):
        channel = grpc.insecure_channel(server)
        client = api.MulticastGroupServiceStub(channel)
        auth_token = [("authorization", "Bearer %s" % api_token)]

        try:
            req2 = api.AddDeviceToMulticastGroupRequest()
            req2.dev_eui = device_eui
            req2.multicast_group_id = multicast_group_id
            resp2 = client.AddDevice(req2, metadata=auth_token)

        except grpc.RpcError as e:
            print('exception: '+ str(e))
            return None
        
        return resp2
    
    def add_device_keys(self, eui, app_key):
        channel = grpc.insecure_channel(server)
        client = api.DeviceServiceStub(channel)
        auth_token = [("authorization", "Bearer %s" % api_token)]

        try:
            dev_key = api.DeviceKeys()
            dev_key.dev_eui = eui
            dev_key.nwk_key = app_key

            create_dev_key = api.CreateDeviceKeysRequest()
            create_dev_key.device_keys.CopyFrom(dev_key)

            resp = client.CreateKeys(create_dev_key, metadata=auth_token)
        
        except grpc.RpcError as e:
            print('exception: '+ str(e))
            return None
        
        return resp
    
    def send_multicast_queue(self, payload):

        channel = grpc.insecure_channel(server)
        client = api.MulticastGroupServiceStub(channel)
        auth_token = [("authorization", "Bearer %s" % api_token)]

        try:
            multicast_item = api.MulticastGroupQueueItem()
            multicast_item.multicast_group_id = multicast_group_id
            multicast_item.f_port = 1
            multicast_item.data = payload
            print('printing multicast item data: ', multicast_item.data)
            print('printing whole multicast item: ', multicast_item)
            
            multicast_req = api.EnqueueMulticastGroupQueueItemRequest()
            multicast_req.queue_item.CopyFrom(multicast_item)
            print('printing multicast request: ', multicast_req)
            resp = client.Enqueue(multicast_req, metadata=auth_token)

        except grpc.RpcError as e:
            print('exception: '+ str(e))
            return None
        
        print('printing response: ', resp)
        return resp
    
    def send_message_to_one_buoy(self, payload, eui):
        channel = grpc.insecure_channel(server)
        client = api.DeviceServiceStub(channel)
        auth_token = [("authorization", "Bearer %s" % api_token)]

        try:
            device_queue_item = api.DeviceQueueItem()
            device_queue_item.dev_eui = eui
            device_queue_item.confirmed = False
            device_queue_item.f_port = 8
            device_queue_item.data = payload

            device_queue_req = api.EnqueueDeviceQueueItemRequest()
            device_queue_req.queue_item.CopyFrom(device_queue_item)

            resp = client.Enqueue(device_queue_req, metadata=auth_token)

        except grpc.RpcError as e:
            print('exception: '+ str(e))
            return None
        
        return resp


    def get_multicast_queue(self):
        channel = grpc.insecure_channel(server)
        client = api.MulticastGroupServiceStub(channel)
        auth_token = [("authorization", "Bearer %s" % api_token)]

        try:
            req = api.ListMulticastGroupQueueRequest()
            req.multicast_group_id = multicast_group_id
            resp = client.ListQueue(req, metadata=auth_token)
            print(resp)
        except grpc.RpcError as e:
            print('exception: '+ str(e))
            return None
        
        return resp
    
    def flush_multicast_queue(self):
        channel = grpc.insecure_channel(server)
        client = api.MulticastGroupServiceStub(channel)
        auth_token = [("authorization", "Bearer %s" % api_token)]

        try:
            req = api.FlushMulticastGroupQueueRequest()
            req.multicast_group_id = multicast_group_id
            resp = client.FlushQueue(req, metadata=auth_token)

        except grpc.RpcError as e:
            print('exception: '+ str(e))
            return None
        
        return resp
    
    def flush_dev_queue(self, eui):
        channel = grpc.insecure_channel(server)
        client = api.DeviceServiceStub(channel)
        auth_token = [("authorization", "Bearer %s" % api_token)]

        try:
            req = api.FlushDeviceQueueRequest()
            req.dev_eui = eui
            resp = client.FlushQueue(req, metadata=auth_token)
            return resp
        except grpc.RpcError as e:
            print('exception: '+ str(e))
            return None