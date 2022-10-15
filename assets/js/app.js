(function() {
    const url = "https://restcountries.com/v3.1/all";
    const containerCards = document.querySelector(".containerCards");
    const inputSearch = document.getElementById("searchBar");
    const countriesArray = [];
    const mainTag = document.getElementsByTagName("main")[0];

    //Function for render HTML element
    function renderElement(element) {
        const newCountry = document.createElement("a");
        newCountry.href = `?code=${element.cca3}`;
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

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            containerCards.innerHTML = "";
            data.forEach(el => {
                /*  console.log(el); */
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
        if (filteredFlags.length) {
            filteredFlags.forEach((e) => {
                containerCards.append(renderElement(e));
            });
        } else {
            let notFoundElement = document.createElement("p");
            notFoundElement.classList.add("notFoundElement");
            notFoundElement.textContent = "Country not found, try with other...";
            containerCards.append(notFoundElement);
        }

    });

    //Function for focus input
    inputSearch.addEventListener("focusin", (e) => { e.target.closest(".containerSearchBar").classList.add("focus") });
    inputSearch.addEventListener("focusout", (e) => { e.target.closest(".containerSearchBar").classList.remove("focus") });

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

    //Filter dropdown
    const dropdown = document.querySelector(".dropdown");
    const dropdownContent = document.querySelector(".dropdownContent");

    dropdown.addEventListener("click", (evt) => {
        let selectedRegion = evt.target.nodeName == "LI" ? evt.target.getAttribute("data-region") : evt.target.parentNode.getAttribute("data-region");

        if (selectedRegion != null) {
            let filteredFlagsByRegion = countriesArray.filter(el => el.region.toLowerCase() == selectedRegion);

            containerCards.innerHTML = "";
            filteredFlagsByRegion.forEach((e) => {
                containerCards.append(renderElement(e));
            });
        }

        dropdownContent.classList.toggle("open");
    });

    //Add view details functionality
    containerCards.addEventListener("click", (evt) => {
        evt.preventDefault();

        let closestElement = evt.target.closest(".card");

        if (closestElement) {
            const urlParams = new URLSearchParams(closestElement.href);

            for (const p of urlParams) {
                let clickedCountry = countriesArray.filter(el => el.cca3 === p[1]);
                let country = clickedCountry[0];
                console.log(country.name);
                let languages;
                let currencies;


                Object.values(country.languages).forEach(val => {
                    languages = val;
                });

                Object.values(country.currencies).forEach(val => {
                    currencies = val.name;
                });

                let countriesContainer = document.createElement("div");
                countriesContainer.classList.add("countriesContainer");

                if (country.borders) {
                    country.borders.forEach((e) => {
                        let newBorder = document.createElement("p");
                        let countryBorderName;
                        newBorder.classList.add("country");

                        countriesArray.filter(el => {
                            if (el.cca3 === e) {
                                countryBorderName = el.name.common;
                            }
                        });

                        newBorder.textContent = countryBorderName;
                        countriesContainer.append(newBorder);
                    });
                }

                mainTag.innerHTML = `
            <div class="containerBack">
                <a href="" class="backButton"><i class="fi fi-rr-arrow-left"></i>Back</a>
            </div>
            <div class="containerDetails">
                <section class="flagContainer">
                    <img src="${country.flags.svg}" alt="${country.name.common} Country Flag">
                </section>
                <section class="textContainer">
                    <div class="topContainer">
                        <div class="primaryIformation">
                            <h1 class="title">${country.name.common}</h1>
                            <p>Native Name:<span>${Object.values(country.name.nativeName)[0].common}</span></p>
                            <p>Population:<span>${numberWithCommas(country.population)}</span></p>
                            <p>Region:<span>${country.region}</span></p>
                            <p>Sub Region:<span>${country.subregion}</span></p>
                            <p>Capital:<span>${country.capital}</span></p>
                        </div>
                        <div class="secondaryInformation">
                            <p>Top Level Domain:<span>${country.tld[0]}</span></p>
                            <p>Currencie:<span>${currencies}</span></p>
                            <p>Language:<span>${languages}</span></p>
                        </div>
                    </div>
                    <div class="borderContainer">
                        <span>Border Countries:</span>
                    </div>
                </section>
            </div>
            `;

                mainTag.querySelector(".containerDetails > .textContainer > .borderContainer").appendChild(countriesContainer);

            }
        }



    });

})();