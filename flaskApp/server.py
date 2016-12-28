from flask import Flask
from flask import request 
from flask import jsonify 
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/getRecipes")
def getRecipes():
    userSearch = request.args.get('recipe')
    BASE_URL = 'https://www.budgetbytes.com'
    SEARCH_URL = '/?s='
    r = requests.get(BASE_URL + SEARCH_URL + userSearch)
    data = r.text
    soup = BeautifulSoup(data, 'lxml')
    correctLinks = []

    for link in soup.find_all('a'):
        if userSearch in link.get('href'):
            correctLinks.append(link.get('href'))
            # print(link.get('href'))

        retVal = {}
        i = 0
        for link in correctLinks:
            retVal[i] = link
            i = i + 1
    print('retrieved ' + str(i) + ' results')
    return jsonify(retVal)
                    
if __name__ == "__main__":
    app.run()
