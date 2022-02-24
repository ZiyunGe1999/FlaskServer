# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python38_app]
# [START gae_python3_app]
from flask import Flask, request, jsonify
import requests
from my_utils import extractInfo, extractNews
from datetime import datetime
from dateutil.relativedelta import relativedelta


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)
API_KEY = "c87v1q2ad3iet0qj41mg"


@app.route('/')
def index():
    """Return a friendly HTTP greeting."""
    return app.send_static_file('html/index.html')
    # return render_template('index.html')
    # return 'Hello World!'

@app.route('/search', methods=['GET'])
def search():
    infos = {}
    if request.method == 'GET':
        stock = request.args.get('stock')
        stock = stock.upper()
        url = f'https://finnhub.io/api/v1/stock/profile2?symbol={stock}&token={API_KEY}'
        r = requests.get(url, auth=('user', 'pass'))
        if len(r.json()) > 0:
            keys = ['logo', 'name', 'ticker', 'exchange', 'ipo', 'finnhubIndustry']
            extractInfo(r.json(), infos, keys)

            url = f'https://finnhub.io/api/v1/quote?symbol={stock}&token={API_KEY}'
            r = requests.get(url, auth=('user', 'pass'))
            keys = ['t', 'pc', 'o', 'h', 'l', 'd', 'dp']
            extractInfo(r.json(), infos, keys)
            date_time = datetime.fromtimestamp(infos['t'])
            infos['t'] = date_time.strftime('%d %B, %Y')

            url = f'https://finnhub.io/api/v1/stock/recommendation?symbol={stock}&token={API_KEY}'
            r = requests.get(url, auth=('user', 'pass'))
            keys = ['strongSell', 'sell', 'hold', 'buy', 'strongBuy']
            extractInfo(r.json()[0], infos, keys)

            today = datetime.now()
            before_30 = today + relativedelta(days=-30)
            today_str = today.strftime('%Y-%m-%d')
            before_30_str = before_30.strftime('%Y-%m-%d')
            url = f'https://finnhub.io/api/v1/company-news?symbol={stock}&from={before_30_str}&to={today_str}&token={API_KEY}'
            r = requests.get(url, auth=('user', 'pass'))
            extractNews(r.json(), infos)

    return jsonify(infos)

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python3_app]
# [END gae_python38_app]
