from flask import Flask
from flask import request 
from flask import jsonify 
from bs4 import BeautifulSoup
from flask_cors import CORS, cross_origin
import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'
app.config['CORS_HEADERS'] = 'Content-Type'

CORS(app)

@app.route("/getRecipes")
def getRecipes():
    userSearch = request.args.get('recipe')
    BASE_URL = 'https://www.budgetbytes.com'
    SEARCH_URL = '/?s='
    r = requests.get(BASE_URL + SEARCH_URL + userSearch)
    data = r.text
    soup = BeautifulSoup(data, 'lxml')
    recipes = []
    correctLinks = []
    recipe = {}

    for link in soup.find_all('a'):
        if userSearch in link.get('href') and (link.get('href') not in correctLinks):
            if link.find('img'):
                recipe['link'] = link.get('href')
                recipe['title'] = link.find('img')['alt']
                recipe['image'] = link.find('img')['src']
                recipes.append(recipe)
                correctLinks.append(link.get('href'))
                recipe = {}

    print('retrieved ' + str(len(correctLinks)) + ' results')
    return jsonify(recipes)

@app.route('/getIngredients')
def getIngredients():
    link = request.args.get('url')
    BASE_URL = 'https://www.budgetbytes.com'
    RECIPE_URL = link
    print(BASE_URL + RECIPE_URL)

    ingR = requests.get(BASE_URL + RECIPE_URL)
    ingData = ingR.text
    ingSoup = BeautifulSoup(ingData, 'lxml')
    ingredients = []

    for ul in ingSoup.find_all('ul'):
        for li in ul.find_all('li', class_='ingredient'):
            if li.string:
                li.string = li.string[:-5]
                ingredients.append(li.string)
    return jsonify(ingredients)
                    
if __name__ == "__main__":
    app.run()
