import json
import time
import string
import random
import calendar
from datetime import date
from datetime import timedelta

from flask import Flask
from flask import flash
from flask import url_for
from flask import request
from flask import redirect
from flask import render_template
from flask.ext.pymongo import PyMongo

from bson import json_util

app = Flask(__name__)

app.debug = True
app.secret_key = "d74ad959-45d9-4f6d-b7b0-92797679aefa"

mongo = PyMongo(app)

def weeks_ago_epoch(num_wks, d=None):
    if not d: d = date.today()

    week_delta = timedelta(weeks=num_wks)
    weeks_ago = d - week_delta

    return calendar.timegm(weeks_ago.timetuple())

def jsonifym(d):
    "A helper to dump Mongo objects to json"
    return json.dumps(d, default=json_util.default)

def run_app():
    app.run(host="0.0.0.0")

def new_bid():
    allowed_chars = list(string.lowercase + string.digits)
    random.shuffle(allowed_chars)
    bid = ''.join(allowed_chars[:random.randint(4, 9)])
    if mongo.db.users.find_one({'bid': bid}):
        bid = new_bid()
    return bid

def new_user(bid, email):
    return {
        "email": email, 
        "bid": bid, 
        "updated": int(time.time()),
        "settings": {
            "daily_limit": 20,
            "currency": "$",
        },
    }

def new_day(bid):
    user = mongo.db.users.find_one({'bid': bid})

    "TODO: handle this error properly"
    if not user: raise 

    today_epoch = calendar.timegm(date.today().timetuple())
    return {
        "bid": user.bid,
        "epoch": today_epoch,
        "amounts": [],
        "limit": user.settings.daily_limit,
    }

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        "Does this user already exist?"
        email = request.form['email']
        user = mongo.db.users.find_one({'email': email})

        if user:
            "Send the user a reminder email"
            flash("You've already signed up. Please check your email for a link to your budget.", "info")
            "TODO: send user an email"
        else:
            "Create a new user and redirect to their budget"
            bid = new_bid()
            mongo.db.users.insert(new_user(bid, email))
            return redirect(url_for('budget', bid=bid))

    return render_template('index.html')

@app.route('/<string:bid>')
def budget(bid):
    "If there is not user with this bid, redirect to sign up page."
    user = mongo.db.users.find_one({'bid': bid})
    if not user:
        return redirect(url_for('index'))

    days = mongo.db.days.find({
        "bid": user.get('bid'),
        "epoch": {"$gte": weeks_ago_epoch(12)}
    })

    return render_template('budget.html', user=jsonifym(user), days=jsonifym(tuple(days)))

if __name__ == '__main__':
    run_app()
