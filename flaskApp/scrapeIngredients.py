from bs4 import BeautifulSoup
import requests

if __name__ == '__main__':
    # Replace with URL from getRecipes()
    r = requests.get("https://www.budgetbytes.com/2016/07/baked-beef-black-bean-tacos/")

    data = r.text
    soup = BeautifulSoup(data, 'lxml')
    ingredients = []
    ingPricing = []

    for ul in soup.find_all('ul'):
        for li in ul.find_all('li', class_='ingredient'):
            ingPricing.append(li.string[-5:])
            ingredients.append(li.string[:-5])

    totalPrice = soup.find_all('span', attrs={'itemprop': 'recipeCategory'})
    pricePerServing = soup.find_all('span', attrs={'itemprop': 'recipeCuisine'})
    totalServings = soup.find_all('span', attrs={'itemprop': 'recipeYield'})

    print(totalPrice[0].string)
    print(pricePerServing[0].string)
    print(totalServings[0].string)

