# VRAT's Drinks

### Task 

Create a web app to list cocktails.

The coctail API: https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita

TASK: fork this repo and create a web app that displays a list of nicely formatted results, in english, from the API link above.

BONUS 1: provide the ability to search the api

BONUS 2: allow switching between languages


### Installation

- clone the repo: git clone https://github.com/vratengr/cocktail-app.git
- open the cocktail-app directory
- open index.html in a browser


### Features
- Main Page
    - Displays a list of drinks
    - By default, it searches "margarita"
    - You can open the filter icon (right side of search icon) for other search options
    - The result list is clickable and opens the drink's detail page
- Detail Page
    - Displays the full details of the drink including the ingredients' measurements and instructions
    - The list of ingredients are clickable and opens the ingredient's detail page
    - You can also change the language for the displayed instructions
    - At the bottom there are navigation links to Home | Back pages
    - Home navigation link goes to main page
    - Back navigation link goes to previous page
- Ingredients Page
    - Displays more details regarding the ingredient
    - Displays a list of drinks that uses this item as an ingredient
    - The list of drinks are clickable and opens the drink's detail page
    - At the bottom there are navigation links to Home | Back pages
    - Home navigation link goes to main page
    - Back navigation link goes to previous page