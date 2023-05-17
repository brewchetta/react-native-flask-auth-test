# React Native Test With Auth

To get started you first need to create an ngrok account and install ngrok on
your terminal.

Start the ngrok tunnel with
```bash
ngrok http 5000
```

This will create a tunnel for port 5000 that any device can connect to. Copy the
URL, for example https://lots-of-numbers-here.ngrok-free.app. This will go in
the URL variable for your App.

IMPORTANT: You will need to change the URL in App.js every time you restart
ngrok. You will NOT need to restart ngrok if you restart the flask server or
react-native client.

In another terminal run these commands to get everything set up:

```bash
pipenv install
npm install --prefix client
```

Run these commands to upgrade, seed, and start the server:
```bash
pipenv shell
cd server
flask db upgrade
python seed.py
flask run --debug
```

In another terminal run the client with:
```bash
npm start --prefix client
```

If you have the expo client on your phone you should be able to use the QR code
to connect and test the app fully.
