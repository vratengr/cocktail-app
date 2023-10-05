"use strict";

const drink = {
    endpoint: 'https://www.thecocktaildb.com/api/json/v1/1/',

    // entry point upon page load
    init: function() {
        drink.getDetails();
    },

    // calls the API to get the drink details
    getDetails: function() {
        let id = new URLSearchParams(window.location.search).get('id');
        if (!id) {
            alert('Missing Drink ID');
        } else {
            $.get(drink.endpoint + 'lookup.php?i=' + id, drink.display);
        }
    },

    // display the API response
    display: function(response) {
        if (!response.drinks[0]) {
            $('#details').html('No records found.');
            $('#spinner').hide();
            return;
        }

        let details = response.drinks[0];
        $('#header h1').html(details.strDrink);
        $('img').attr('src', details.strDrinkThumb);
        $('#category').html(details.strCategory);
        $('#alcholic').html(details.strAlcoholic);
        $('#glass').html(details.strGlass);

        Object.keys(details).forEach(function(k) {
            // get the list of ingredients and their mesurements
            if ((k.indexOf('strIngredient') == 0) && details[k]) {
                let index = k.slice(13);
                let measure = details['strMeasure' + index];
                $('#ingredients').append('<li><a href="./ingredient.html?name=' + details[k] + '">' + [measure, details[k]].join(' ') + '</a></li>');
            }

            // get the instructions for all the languages
            if ((k.indexOf('strInstructions') == 0) && details[k]) {
                let selected    = '';
                let hidden      = 'hidden';
                let langCode    = k.slice(15);
                if (!langCode) {
                    selected    = 'selected';
                    hidden      = '';
                    langCode    = 'EN';
                }

                $('#langs').append('<option value="lang-' + langCode + '" ' + selected + '>' + langCode + '</option>');
                $('#instructions').append('<div id="lang-' + langCode + '" class="instruction ' + hidden + '">' + details[k] + '</div>');
            }
        });

        drink.setEventHandlers();
        $('#spinner').hide();
    },

    // handles event triggers for the page
    setEventHandlers: function() {
        // display the corresponding instruction based on the selected language
        $('#langs').on('change', function() {
            $('.instruction').addClass('hidden');
            $('#' + $(this).val()).removeClass('hidden');
        });
    },
};

$(document).ready(drink.init);