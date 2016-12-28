from bs4 import BeautifulSoup
import requests

BASE_URL = 'https://www.budgetbytes.com'
SEARCH_URL = '/?s='

if __name__ == '__main__':

    userSearch = input('Search for recipe... ')

    r = requests.get(BASE_URL + SEARCH_URL + userSearch)

    data = r.text

    soup = BeautifulSoup(data, 'lxml')

    correctLinks = []

    for link in soup.find_all('a'):
        if 'taco' in link.get('href'):
            correctLinks.append(link.get('href'))
            # print(link.get('href'))

    for link in correctLinks:
        print(link)
