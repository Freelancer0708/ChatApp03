from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.sqlite')
socketio = SocketIO(app, cors_allowed_origins="*")
db = SQLAlchemy(app)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(80), nullable=False)
    text = db.Column(db.String(120), nullable=False)

@socketio.on('sendMessage')
def handle_message(msg):
    print(msg)
    message = Message(user=msg['user'], text=msg['text'])
    db.session.add(message)
    db.session.commit()
    emit('message', msg, broadcast=True)

@socketio.on('connect')
def handleConnect():
    messages = Message.query.all()
    for message in messages:
        emit('message', {'user': message.user, 'text': message.text})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app)
