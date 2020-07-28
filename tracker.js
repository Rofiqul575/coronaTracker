let searchDataForm = document.querySelector('#searchDataForm');

let searchBy = document.querySelector('#searchBy');

let searchFetched = document.querySelector('#searchFetched');

let outputResults = document.querySelector('#outputResults .row');


class Req {
    constructor() {
        this.xhr = new XMLHttpRequest();
    }

    searchAllCountries(url) {
        searchFetched.classList.add('loader');

        this.xhr.open('GET', url, true);

        this.xhr.onload = function() {
            searchFetched.classList.remove('loader');

            if (this.status === 200) {
                const countries = JSON.parse(this.responseText);

                for (let i = 0; i < countries.length; i++) {
                    searchFetched.innerHTML += `<option value = ${countries[i].alpha2}>${countries[i].name}</option>`;
                }
            }
        }
        this.xhr.send();
    }

    searchByCountry(url) {
        outputResults.innerHTML = '';

        outputResults.classList.add('loader');
        this.xhr.open('GET', url, true);

        this.xhr.onload = function() {

            if (this.status === 200) {
                outputResults.classList.remove('loader');
                const statusData = JSON.parse(this.responseText);

                outputResults.innerHTML = '';

                outputResults.innerHTML += `

                    <form class="mb-4" id="#country-sort-form">
                        <div class="form-row">
                            <div class="col-sm-4 ml-auto">
                                <select id="sort-by" class="form-control">
                                    <option value="noselect">Sort By</option>
                                    <option value="last24hrs">Last 24 Hrs</option>
                                </select>
                            </div>
                        </div>
                    </form>

                    <h4 class="text-center text-primary mb-4">Last Updated: ${statusData.last_update}</h4>
                    <div class="col-3">
                        <div class="circle-wrapper bg-warning d-flex justify-content-center align-items-center">
                            Country: ${statusData.country}
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="circle-wrapper bg-primary d-flex justify-content-center align-items-center">
                            Cases: ${statusData.cases}
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="circle-wrapper bg-danger d-flex justify-content-center align-items-center">
                            Death: ${statusData.deaths}
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="circle-wrapper bg-success d-flex justify-content-center align-items-center">
                            Recovered: ${statusData.recovered}
                        </div>
                    </div>
                    `;
                countrySortByHandler(statusData);
            }
        }
        this.xhr.send();
    }

    searchByCountryDiff(url, countryDataArr) {
        outputResults.innerHTML = '';

        outputResults.classList.add('loader');
        this.xhr.open('GET', url, true);

        this.xhr.onload = function() {

            if (this.status === 200) {
                outputResults.classList.remove('loader');
                const todayData = JSON.parse(this.responseText);
                console.log(todayData);

                outputResults.innerHTML = '';

                outputResults.innerHTML += `

                    <form class="mb-4" id="#country-sort-form">
                        <div class="form-row">
                            <div class="col-sm-4 ml-auto">
                                <select id="sort-by" class="form-control">
                                    <option value="noselect">Sort By</option>
                                    <option value="last24hrs">Last 24 Hrs</option>
                                </select>
                            </div>
                        </div>
                    </form>

                    <div class="col-sm-6 mx-auto mb-4">
                        <div class="card text-center">
                            <div class="card-header">
                                Last updated: ${todayData.last_update}
                                    </div>
                                        <div class="card-body">
                                            <h5 class="card-title text-primary">New Cases</h5>
                                            <p class="card-text">Total <span class="font-weight-bold text-primary">${todayData.new_cases}</span> new active cases during last 24hrs</p>
                                            <h5 class="card-title text-danger">New Deaths</h5>
                                            <p class="card-text">Total <span class="font-weight-bold text-danger">${todayData.new_deaths}</span> reportedly died during last 24hrs</p>
                                            <h5 class="card-title text-success">New Recovered</h5>
                                            <p class="card-text">Total <span class="font-weight-bold text-success">${todayData.new_recovered}</span> new patients recovered during last 24hrs</p>
                                        </div>
                                  <div class="card-footer text-muted">
                                Daily Tally
                            </div>
                        </div>
                    </div>

                    <h4 class="text-center text-primary mb-4">Last Updated: ${countryDataArr.last_update}(Total Tally)</h4>
                    <div class="col-3">
                        <div class="circle-wrapper bg-warning d-flex justify-content-center align-items-center">
                            Country: ${countryDataArr.country}
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="circle-wrapper bg-primary d-flex justify-content-center align-items-center">
                            Cases: ${countryDataArr.cases}
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="circle-wrapper bg-danger d-flex justify-content-center align-items-center">
                            Death: ${countryDataArr.deaths}
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="circle-wrapper bg-success d-flex justify-content-center align-items-center">
                            Recovered: ${countryDataArr.recovered}
                        </div>
                    </div>
                    `;
            }
        }
        this.xhr.send();
    }
}

let req = new Req();

searchBy.addEventListener('change', function(e) {
    switch (searchBy.value) {
        case "searchByCountry":
            searchFetched.innerHTML = '';
            req.searchAllCountries('https://covid19-api.org/api/countries');
            break;
    }

});

searchDataForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let country = searchFetched.value;

    req.searchByCountry(`https://covid19-api.org/api/status/${country}`);

});

function countrySortByHandler(countryDataArr) {
    let sortByToday = document.querySelector('#sort-by');

    sortByToday.addEventListener('change', function(e) {
        switch (sortByToday.value) {
            case "last24hrs":
                // searchFetched.innerHTML = '';
                req.searchByCountryDiff(`https://covid19-api.org/api/diff/${searchFetched.value}`, countryDataArr);
                break;
        }

    });
}