from flask import Flask, request, jsonify
from flask_socketio import SocketIO, join_room, leave_room, emit
import time
import datetime
from flask_cors import CORS
import time
import random
import string
import requests
import jwt  # Import PyJWT library
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from dbOperarions import *
import stripe
from bson import ObjectId


load_dotenv()


app = Flask(__name__)
socketio = SocketIO(app, manage_session=False)
socketio.init_app(app, cors_allowed_origins="*")
CORS(app)





@app.route('/google-login', methods=['POST'])
def google_login():
    token = request.json['token']
    try:
        
        url = f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={token}"
        response = requests.get(url)

        if response.status_code == 200:
            token_info = response.json()
            # print(token_info)user_id
            if token_info.get('error') is None and token_info.get('audience') == os.getenv("CLIENT_ID"):
                    findUser=read_data({'email':token_info.get('email')},'user')
                    userId=None
                    if findUser:
                        userId=findUser['_id']
                    else:
                        createUser=create_data({'email':token_info.get('email'),'public_id':token_info.get('user_id')},"user")
                        userId=createUser
                        if not createUser :
                            return jsonify({"error": "Something went wrong"}), 401
                        else:
                            createPatment=create_data({'user_id':str(createUser),'public_id':token_info.get('user_id'),'free_time':30,'plan':0,'plan_time':0},"payment")
                   
                    jwt_payload = {'user_id':userId,'email':token_info.get('email')}                   
                    authorization_token = jwt.encode(jwt_payload, os.getenv("SECRET_KEY"), algorithm='HS256')
                    return jsonify({'token': authorization_token}), 200
            else:
                return jsonify({"error": "Token verification failed"}), 401
        else:
            return jsonify({"error": "Token verification failed"}), 401
        
    except ValueError as e:
      
        return jsonify({'error': 'Token verification failed'}), 401
    







endpoint_secret = 'whsec_84799235918632abc4e7ca7fcdcaf20312356a223dbdf8df3b00d7c2cd0efb46'

@app.route('/webhook', methods=['POST'])
def webhook():
    event = None
    payload = request.data
    sig_header = request.headers['STRIPE_SIGNATURE']

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise e
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise e

    # # Handle the event
    # if event['type'] == 'payment_intent.succeeded':
    #   payment_intent = event['data']['object']
    #   print(payment_intent)
    
    if event['type'] == 'checkout.session.completed':
     
      payment_intent = event['data']['object']
      current_utc_timestamp = int(datetime.datetime.now(datetime.timezone.utc).timestamp())
      if payment_intent['id']!=None and  payment_intent['payment_status']=='paid':
         if  payment_intent['client_reference_id']!=None :
            #  update_data({'public_id':payment_intent['client_reference_id']},data,"payment"):
             pass
                
    # ... handle other event types
    # else:
    #   print('Unhandled event type {}'.format(event['type']))

    return jsonify(success=True)





@app.route('/verify-token',methods=[ 'POST'])
def verify_token():
    data = request.get_json()
   
    if data['token']:
        try:
            decoded_payload = jwt.decode(data['token'],os.getenv("SECRET_KEY") , algorithms=['HS256'])
            findUser=read_data({'_id':ObjectId(decoded_payload['user_id'])},'user')
            if findUser:
                return jsonify({'verify': "success",'public_id':findUser['public_id']}),200
        except jwt.ExpiredSignatureError:
            return jsonify({'verify': "failed"}),401
        except jwt.InvalidTokenError as e:
            return jsonify({'verify': "failed"}),401
    return jsonify({'verify': "failed"}),401



    

@app.route('/generate-video',methods=['GET', 'POST'])
def generate_video():
    timestamp = str(int(time.time()))
    random_string = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(30 - len(timestamp)))
    room = timestamp + random_string
   
    
    return jsonify({'room': room})

@socketio.on('join', namespace='/generate-video')
def join(data):
    join_room(data['room'])

    inputs=data['inputs']
    emit('status', {'status':'start'},room=data['room'])
    generateVideo(data['room'])
    emit('status', {'status':'done'},room=data['room'])
   

# @socketio.on('disconnect', namespace='/generate-video')
# def on_disconnect():
#     print("OK")
#     # leave_room(data['room'])

    


def generateVideo(room):
    for i in range(0, 101,10):
        time.sleep(0.5)  
        emit('progress', {'percentage': i},room=room)  
    return







if __name__ == '__main__':
    socketio.run(app)
