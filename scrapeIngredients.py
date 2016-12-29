from bs4 import BeautifulSoup
import requests

if __name__ == '__main__':
    # Replace with URL from getRecipes()
    r = requests.get("https://www.budgetbytes.com/2016/07/baked-beef-black-bean-tacos/")

    data = r.text
    soup = BeautifulSoup(data, 'lxml')
    ingredients = []

    for ul in soup.find_all('ul'):
        for li in ul.find_all('li', class_='ingredient'):
            li.string = li.string[:-5]
            ingredients.append(li.string)

    for ing in ingredients:
        print(ing)
