#!/usr/bin/env python3

import os
from dotenv import load_dotenv
load_dotenv()

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
    current_user = User.query.where(User.username==request.json['username']).first()
    if current_user:
        access_token = create_access_token(identity=current_user.username)
        return {
            "current_user": current_user.to_dict(),
            "access_token": access_token
        }, 201
    else:
        return { 'message': 'Invalid username or password' }, 401

@app.get('/check_token')
@jwt_required()
def check_token():
    token_username = get_jwt_identity()
    current_user = User.query.where(User.username == token_username).first()
    if current_user:
        return { "current_user": current_user.to_dict() }, 200
    else:
        return { "message": "Unauthorized" }, 401

if __name__ == '__main__':
    app.run(port=5000, debug=True)
