from dotenv import load_dotenv
from flask import Flask, render_template, jsonify
from models.homeworkuser import Db, HomeworkUser
from os import environ
# Quote following line to run at local
# from flask_heroku import Heroku
app = Flask(__name__)
# Quote following line to run at local
# heroku = Heroku(app)
# Unquote following line to run at local
load_dotenv('.env')

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL', 'postgresql://xyoejgdatfxdhh:ac46b0c61596ccf768cc57853fc4c3ff77895e5ff43381507ab0e9f40f754b54@ec2-3-233-235-48.compute-1.amazonaws.com:5432/da1upkv1h0kcu8')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "s14a-key"
Db.init_app(app)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/load_data', methods=['GET'])
def load_data():
    users_json = {'users': []}
    users = HomeworkUser.query.all()
    for user in users:
        user_info = user.__dict__
        del user_info['_sa_instance_state']
        users_json['users'].append(user_info)
    return jsonify(users_json)
