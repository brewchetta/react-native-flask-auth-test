#!/usr/bin/env python3

# we want the dotenv so we can get our secret env variables later
import os
from dotenv import load_dotenv
load_dotenv()
# IMPORTANT #
# make sure to add the .env file to the .gitignore so it won't get pushed
print('[DO NOT PRINT THIS IN YOUR PROJECTS] Here is the secret key:')
print(os.getenv("JWT_SECRET_KEY"))


from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

from models import db, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.json.compact = False

jwt = JWTManager(app)

migrate = Migrate(app, db)

db.init_app(app)

@app.get('/')
def index():
    return "Hello world", 200

@app.post('/login')
def login():
    current_user = User.query.where(User.username=='Chett').first()
    if current_user:
        access_token = create_access_token(identity=current_user.username)
        return { 'token': access_token, "current_user": current_user.to_dict() }, 201
    else:
        return { 'message': 'Invalid username or password' }, 401

@app.get('/check_token')
@jwt_required()
def check_token():
    # because we logged username in the JWT identity, we're going to find our user that way
    username = get_jwt_identity()
    current_user = User.query.where(User.username == username).first()
    if current_user:
        return {"id": 1, "username": "Chett"}, 200
    else:
        return { "message": "Unauthorized" }, 401

@app.get('/protected')
@jwt_required()
def protected_route():
    username = get_jwt_identity()
    current_user = User.query.where(User.username == username).first()
    if current_user:
        return {'message': "You're authorized for this protected route!", "data": "Here are some protected resources you can access"}, 200
    else:
        return { 'message': "You're NOT AUTHORIZED" }, 401

if __name__ == '__main__':
    app.run(port=5000, debug=True)
