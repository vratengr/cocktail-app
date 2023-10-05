"use strict";

const ingredient = {
    endpoint: 'https://www.thecocktaildb.com/api/json/v1/1/',

    // entry point upon page load
    init: function() {
        ingredient.getDetails();
    },

    // calls the API to get the ingredient details
    getDetails: function() {
        let name = new URLSearchParams(window.location.search).get('name');
        if (!name) {
            alert('Missing Ingredient Name');
        } else {
            $.get(ingredient.endpoint + 'search.php?i=' + name, ingredient.display);
        }
    },

    // display the API response
    display: function(response) {
        if (!response.ingredients[0]) {
            $('#details').html('No records found.');
            $('#spinner').hide();
            return;
        }

        let details = response.ingredients[0];
        $('#header h1').html(details.strIngredient);

        // not sure if the img URL will always work as I didn't find this documented,
        // so far all are working, let's just put an Alt Text also
        $('img').attr('src', 'https://www.thecocktaildb.com/images/ingredients/' + details.strIngredient + '.png');
        $('img').attr('alt', details.strIngredient);
        $('#type').html(details.strType);
        $('#alcoholic').html(details.strAlcohol);
        $('#abv').html(details.strABV);
        $('#description').html(details.strDescription);
        ingredient.getDrinks(details.strIngredient);
    },

    // calls the API to get the list of drinks that uses this ingredient
    getDrinks: function(ingrName) {
        $.get(ingredient.endpoint + 'filter.php?i=' + ingrName, function(response) {
            $.each(response.drinks, function() {
                $('#drinks').append('<div class="drink" data-id="' + this.idDrink + '"><img src="' + this.strDrinkThumb + '" /><div class="drink-name">' + this.strDrink + '</div></div>');
            });
            ingredient.setEventHandlers();
            $('#spinner').hide();
        });
    },

    // handles event triggers for the page
    setEventHandlers: function() {
        // display the drink detail page for the clicked item
        $('.drink').on('click', function() {
            location.href = './drink.html?id=' + $(this).attr('data-id');
        });
    },
};

$(document).ready(ingredient.init);