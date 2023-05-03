#!/usr/bin/env python3

from app import app
from models import db # models go here
from faker import Faker

faker = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("Seeding database...")

        # write your seeds here!

        print("Seeding complete!")
