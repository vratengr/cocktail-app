"use strict";

const drinks = {
    endpoint: 'https://www.thecocktaildb.com/api/json/v1/1/',

    // entry point upon page load
    init: function() {
        drinks.setEventHandlers();
        drinks.setFilterOptions();
        drinks.getList();
    },

    // handles event triggers for the page, but so far we only have the search/filter section to handle :D
    setEventHandlers: function() {
        // #search-text and #name will serve as duplicates for one another, so let's propagate the changes accordingly
        $('#search-text').on('keyup', function(e) {
            $('#filter-type').val('name');
            $('#filter-type').trigger('change');
            $('#name').val($(this).val());

            // on hit enter key
            if (e.which == 13) {
                $('#search-btn').trigger('click');
            }
        });

        $('#name').on('keyup', function(e) {
            $('#search-text').val($(this).val());
            if (e.which == 13) {
                $('#search-btn').trigger('click');
            }
        });

        $('#search-btn').on('click', drinks.getList);
        $('#filter-btn').on('click', function() {
            $('#filter').slideToggle('slow');
        });

        // let's show the corresponding input field depending on the chosen filter type
        $('#filter-type').on('change', function() {
            let filterType = $(this).val();

            if (filterType != 'name') {
                $('#search-text').val('');
                $('#name').val('');
            }

            $('.filter-value').hide();
            $('.filter-value').val('');
            $('#' + filterType).show();
        });

        // since filter section is below the search button, let's automatically run search once a value is selected in the sub-dropdown
        $('select.filter-value').on('change', drinks.getList);
    },

    // populate options for some of the search filters
    setFilterOptions: function() {
        // the API accepts string params for the filters we are using
        // however, the API does an exact-match search
        // rather than letting users guess what are the accepted/available values,
        // let's show a dropdown of all the available values so that we can give meaningful results to the user

        drinks.getFilterOptions('a', 'strAlcoholic', 'alcoholic');
        drinks.getFilterOptions('c', 'strCategory', 'category');
        drinks.getFilterOptions('g', 'strGlass', 'glass');
        drinks.getFilterOptions('i', 'strIngredient1', 'ingredient');
    },

    // this is just a helper function for the setFilterOptions() so we could reuse it for multiple filters
    getFilterOptions: function(paramName, responseField, dropdownID) {
        $.get(drinks.endpoint + 'list.php?' + paramName + '=list', function(response) {
            if (!response.drinks) return;

            // let's sort the result first so it's easier for the user to browse thru the options
            response.drinks.sort((a, b) => (a[responseField] > b[responseField]) ? 1 : -1);

            // then let's add the values in their respective dropdown field
            $.each(response.drinks, function() {
                $('#' + dropdownID).append('<option value="' + this[responseField] + '">' + this[responseField] + '</option>');
            });
        });
    },

    // calls the API to get the list of drinks
    getList: function() {
        let filter = drinks.getParams()
        $.get(drinks.endpoint + filter.file, filter.input, drinks.display);
    },

    // prepare the parameters needed for the drink search
    getParams: function() {
        let params = {};
        let filtertype = $('#filter-type').val();

        if (filtertype == 'name') {
            params.file = 'search.php';
            var input = $('#name').val().trim();

            if (input.length > 1) {
                // search for drinks that CONTAINS the given text
                params.input = {s: input};
            } else {
                // if there's only one letter, then let's search for drinks that STARTS with it
                params.input = {f: input};
            }

        } else {
            // search for drinks based on different filters
            // we're grouping them here in one else{} since all of these APIs uses the filter.php endpoint

            params.file = 'filter.php';
            var input = $('#' + filtertype).val();

            if (filtertype == 'alcoholic') {
                params.input = {a: input};
            } else if (filtertype == 'category') {
                params.input = {c: input};
            } else if (filtertype == 'glass') {
                params.input = {g: input};
            } else if (filtertype == 'ingredient') {
                params.input = {i: input};
            }
        }

        return params;
    },

    // display the list of drinks from the API response
    display: function(response) {
        if (!response.drinks) {
            $('#results').html('No records found.');
            return;
        }

        $('#spinner').show();
        $('#results').empty();

        // traverse each response entry and display it
        $.each(response.drinks, function() {
            let row = $('#drink-template .drink').clone();
            $(row).attr('id', 'drink-' + this.idDrink);
            $(row).attr('data-id', this.idDrink);
            $('img', row).attr('src', this.strDrinkThumb);
            $('.name', row).html(this.strDrink);

            // handle these optional return values
            if (this.strCategory) {
                $('.details', row).append('<div>Category: <span>' + this.strCategory + '</span></div>');
            }
            if (this.strAlcoholic) {
                $('.details', row).append('<div>Alcohol Content: <span>' + this.strAlcoholic + '</span></div>');
            }
            if (this.strGlass) {
                $('.details', row).append('<div>Glass: <span>' + this.strGlass + '</span></div>');
            }

            // currently there are 15 placeholders for the ingredients, but that might change as there are other cocktails with more than 15 ingredients
            // so let's get all ingredients, how many they may be
            if (this.strIngredient1) {
                let ingredients = [];
                Object.keys(this).forEach((k) => {
                    if ((k.indexOf('strIngredient') == 0) && this[k]) {
                        ingredients.push(this[k]);
                    }
                });
                $('.details', row).append('<div>Ingredients: <span>' + ingredients.join(', ') + '</span></div>');
            }

            $('#results').append(row);
        });

        // open drink details page
        $('.drink').on('click', function() {
            location.href = './drink.html?id=' + $(this).data('id');
        });

        $('#spinner').hide();
    },

};

$(document).ready(drinks.init);