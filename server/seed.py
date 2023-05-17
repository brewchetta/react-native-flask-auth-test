#!/usr/bin/env python3

from app import app
from models import db, User
from faker import Faker

faker = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("Seeding database with a test user...")

        User.query.delete()
        u1 = User(username='Chett')
        db.session.add(u1)
        db.session.commit()

        print("Seeding complete!")
