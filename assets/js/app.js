(function() {
    const url = "https://restcountries.com/v3.1/all";
    const containerCards = document.querySelector(".containerCards");
    const inputSearch = document.getElementById("searchBar");
    const countriesArray = [];

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            containerCards.innerHTML = "";
            data.forEach(el => {
                countriesArray.push(el);
                containerCards.append(renderElement(el));
            });
        });

    //Function for search country by name
    inputSearch.addEventListener("keyup", (evt) => {

        let inputText = evt.target.value;
        inputText.trim();

        let filteredFlags = countriesArray.filter(el => isMatch(el.name.common, inputText));

        containerCards.innerHTML = "";
        filteredFlags.forEach((e) => {
            containerCards.append(renderElement(e));
        });

    });


    //Dark theme implementation
    const checkbox = document.getElementById("darkModeButton");
    const iconTheme = document.getElementById("iconTheme");
    const textTheme = document.querySelector(".labelDarkMode > span");

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.setAttribute("data-theme", "dark");
        checkbox.checked = true;
        iconTheme.className = "fi fi-rr-sun";
        textTheme.textContent = "Light Mode";
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        checkbox.checked = false;
        iconTheme.className = "fi fi-rr-moon-stars";
        textTheme.textContent = "Dark Mode";
    }

    checkbox.addEventListener("change", (evt) => {
        document.documentElement.setAttribute(
            "data-theme", evt.target.checked ? "dark" : "light"
        );
        if (evt.target.checked) {
            iconTheme.className = "fi fi-rr-sun";
            textTheme.textContent = "Light Mode";
        } else {
            iconTheme.className = "fi fi-rr-moon-stars";
            textTheme.textContent = "Dark Mode";
        }
    });

    //Function for render HTML element
    function renderElement(element) {
        const newCountry = document.createElement("a");
        newCountry.href = `index.html/details?code=${element.fifa}`;
        newCountry.classList.add("card");
        newCountry.innerHTML = `
                <div class="containerImageFlag">
                    <img src="${element.flags.svg}" alt="${element.name.common} Country Flag">
                </div>
                <div class="containerInfoFlag">
                    <h2>${element.name.common}</h2>
                    <p class="population">Population:
                        <span>${numberWithCommas(element.population)}</span>
                    </p>
                    <p class="region">Region:
                        <span>${element.region}</span>
                    </p>
                    <p class="capital">Capital:
                        <span>${element.capital}</span>
                    </p>
            </div>
                `;

        return newCountry;
    }

    //Function to add comma into the population numbers
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    //Function to check if two string matches
    function isMatch(str, testCase) {
        let rgx = new RegExp(testCase.toLowerCase());
        return str.toLowerCase().match(rgx);
    }

})();