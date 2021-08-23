(function () {

    var name = sessionStorage.getItem('username');
    var sex = sessionStorage.getItem('sex');
    const welcomeDiv = document.getElementById("welcome");
    const logout_button = document.getElementById("logoutButton");
    const searchBar = document.getElementById("searchBar");


    if (name != null) {
        switch (sex) {
            case 'male':
                welcomeDiv.innerHTML = "Benvenuto " + name;
                break;
            case 'female':
                welcomeDiv.innerHTML = "Benvenuta " + name;
                break;
            case null:
                welcomeDiv.innerHTML = "Benvenut* " + name;
                break;
        }
    }
    else
        window.location.replace("index.html");

    logout_button.addEventListener("click", ev => {
        sessionStorage.clear();
        window.location.replace("index.html");
    })

    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }


    searchBar.addEventListener("keyup", e => {

        var el = document.getElementById("searchBar");
        el.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
            }
        });


        if (searchBar.value !== '') {
            if (e.key !== 'Enter') {
                makeCall("GET", "SearchProduct?search=" + searchBar.value, null,
                    function (request) {
                        switch (request.status) {
                            case 200:
                                var productsSearched = JSON.parse(request.responseText);
                                printProductSearched(productsSearched, searchBar)
                        }
                    })
            }
        }  else
                printProductSearched(null);


    });


    function printProductSearched(listProducts, searchBar) {
        const searchedProd = document.getElementById("searchedProducts");
        var tableExisted = document.getElementById('tableProductSearched');
        if (tableExisted != null) {
            tableExisted.remove();
            document.getElementById('titleSearch').remove();
        }
        if (listProducts != null) {
            var title = document.createElement('p')
            title.id = "titleSearch";
            title.textContent = "Elementi trovati per: " + searchBar.value;

            var table = document.createElement('table');
            table.id = "tableProductSearched";
            var tableBody = document.createElement('tbody');

            searchedProd.style.display = "block";

            var row = document.createElement('tr');

            var thCode = document.createElement('th');
            var thName = document.createElement('th');
            var thPrice = document.createElement('th');
            var thDetails = document.createElement('th');


            thCode.textContent = "Codice";
            row.appendChild(thCode);
            thName.textContent = "Nome";
            row.appendChild(thName);
            thPrice.textContent = "Prezzo";
            row.appendChild(thPrice);
            thDetails.textContent = "Dettagli";
            row.appendChild(thDetails);
            table.appendChild(row);

            for (var i = 0; i < listProducts.length; i++) {
                var row2 = document.createElement('tr');
                var codeCol = document.createElement('td');
                var nameCol = document.createElement('td');
                var priceCol = document.createElement('td');
                var detailsCol = document.createElement('td');

                codeCol.textContent = listProducts[i].code;
                nameCol.textContent = listProducts[i].name;
                priceCol.textContent = listProducts[i].price + ".00 \u20ac";
                const nameId = "detailButton" + listProducts[i].code;
                detailsCol.innerHTML = "<button id=" + nameId + ">Dettagli</button>";
                row2.appendChild(codeCol);
                row2.appendChild(nameCol);
                row2.appendChild(priceCol);
                row2.appendChild(detailsCol);
                tableBody.appendChild(row2);
            }
            table.appendChild(tableBody);
            searchedProd.appendChild(title);
            searchedProd.appendChild(table);

            for (var i = 0; i < listProducts.length; i++) {
                const nameId = "detailButton" + listProducts[i].code;
                productDetails(listProducts[i].code, nameId);
            }
        }
    }

    function productDetails(codeProd, nameId) {
        const button = document.getElementById(nameId);

        button.addEventListener("click",e => {
                makeCall("GET" , 'getInfoProduct?code=' + codeProd ,null );
                var product = document.getElementById(codeProd);
                var close = document.getElementsByClassName("close")[0];
                button.onclick = function() {
                    product.style.display = "block";
                }
                close.onclick = function() {
                    product.style.display = "none";
                }

            }


        )

    }

}) ();