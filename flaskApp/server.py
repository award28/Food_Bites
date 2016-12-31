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

    for article in soup.find_all('article'):
        for link in article.find_all('a'):
            if userSearch in link.get('href') and (link.get('href') not in correctLinks):
                if link.find('img'):
                    recipe['link'] = link.get('href')
                    recipe['title'] = link.find('img')['alt']
                    recipe['image'] = link.find('img')['src']
                    correctLinks.append(link.get('href'))

        if(article.find_all('a')[0].get('href') == correctLinks[len(correctLinks) - 1]):
            for cost in article.find_all('div', attrs={'class': 'recipe-cost'}):
                totalPrice = float("".join(str(x) for x in cost.string.split('/', 1)[0][1:]).split(' ', 1)[0])
                recipe['totalPrice'] = totalPrice 

                if(len(cost.string.split('/', 1)) > 1):
                    pricePerServing = float("".join(str(x) for x in(cost.string.split('/', 1)[1][2:]).split(' ', 1)[0]))
                    recipe['pricePerServing'] = pricePerServing 
                    recipe['totalServing'] = int(round(totalPrice/pricePerServing, 0))
                recipes.append(recipe)
        recipe = {}

    totalPrice = soup.find_all('div', attrs={'class': 'recipe-cost'})
    pricePerServing = soup.find_all('span', attrs={'itemprop': 'recipeCuisine'})
    totalServings = soup.find_all('span', attrs={'itemprop': 'recipeYield'})

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
    ingPricing = []
    ingredient = {}

    for ul in ingSoup.find_all('ul'):
        for li in ul.find_all('li', class_='ingredient'):
            if li.string:
                ingredient['ingredient'] = li.string[:-5]
                ingredient['price'] = li.string[-5:]
                ingredients.append(ingredient)
                ingredient = {}
    return jsonify(ingredients)
                    
if __name__ == "__main__":
    app.run()
