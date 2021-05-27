$ = $ || jQuery;

class Search {
    
    constructor() {
        this.searchField = $('#search-term');
        this.resultsDiv = $('#results');
        this.countriesList = $('#countries-list');
        this.searchButton = $('.search-button');
        this.previousValue;
        this.typingTimer;
        this.events(); 
    }

    events() { 
        this.searchField.on( 'keyup', this.typingLogic.bind(this));
        this.searchButton.on( 'click', this.getResults.bind(this));
    }

    typingLogic() {

        let term = this.searchField.val(); 

       if ( term != this.previousValue && term.length > 3 ) {
            clearTimeout(this.typingTimer);
            if ( term ) {
                this.typingTimer = setTimeout(this.getCountriesName.bind(this), 750);
            } else {
                this.resultsDiv.html('');
                this.countriesList.html('');
            }
        }
        this.previousValue = term;
    }

    getCountriesName() {
        $.getJSON( 'https://restcountries.eu/rest/v2/name/' + this.searchField.val() + '?fields=name', results => {
            this.resultsDiv.html('');
            this.countriesList.html(`
                ${ results.map( item => `<option>${item.name}</option>` ).join('')  }
            `);    
        }).fail( () => {
            this.resultsDiv.html('<div class="col-12 alert alert-danger" role="alert">No countries matches that search.</div>');
        });
    }

    getResults() {
        if( ! this.searchField.val() ) {
            this.resultsDiv.html('<div class="col-12 alert alert-warning" role="alert">Please type sometyhing.</div>');
        }
        else {
            $.getJSON( 'https://restcountries.eu/rest/v2/name/' + this.searchField.val() + '?fields=name;region;currencies;languages;population;', results => {
            this.countriesList.html('');
            this.resultsDiv.html(`
                ${ results.map( item => `
                    <div class="col-lg-4 col-md-6 col-12">
                        <div class="card">
                            <div class="card-body">
                                <p><strong>Name:</strong> ${item.name}</p>
                                <p><strong>Region:</strong> ${item.region}</p>
                                <p><strong>Currency name:</strong> ${item.currencies[0].name}</p>
                                <p><strong>Language name:</strong> ${item.languages[0].name}</p>
                                <p><strong>Population:</strong> ${item.population}</p>
                            </div>
                        </div>
                    </div> 
                `).join('')  }
            `);    
        }).fail( () => {
            this.resultsDiv.html('<div class="col-12 alert alert-danger" role="alert">No countries matches that search.</div>');
        });
        }
    }
}

let search = new Search;