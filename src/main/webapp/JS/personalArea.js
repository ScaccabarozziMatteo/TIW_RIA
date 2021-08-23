(function () {

    var name = sessionStorage.getItem('username');
    var sex = sessionStorage.getItem('sex');
    const welcomeDiv = document.getElementById("welcome");
    const logout_button = document.getElementById("logoutButton");
    const searchBar = document.getElementById("searchBar");
    var cart = null;


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
                productDetails(listProducts[i].code, nameId, listProducts[i]);
            }
        }
    }

    function productDetails(codeProd, nameId, product) {
        const button = document.getElementById(nameId);

        button.addEventListener("click",e => {

                makeCall("GET" , 'getInfoShipmentProduct?code=' + codeProd ,null,
                    function (request) {
                        switch (request.status) {
                            case 200:
                                var shipmentPolicies = JSON.parse(request.responseText);
                                printProductDetails (shipmentPolicies, product);
                        }
                    });




            }


        )

    }


    function printProductDetails (shipmentPolicies,product) {
        const detailsPopupContainer = document.getElementById("detailsPopupContainer");

        if (document.getElementById("detailsPopup") != null)
            document.getElementById("detailsPopup").remove();
        const detailsPopup = document.createElement("div");
        detailsPopup.id = "detailsPopup";

        const close = document.createElement('span');
        close.id = 'closePopup';
        close.textContent = "✖";
        close.style.float = 'right';
        close.style.fontSize = '30px';
        detailsPopup.appendChild(close);

        close.addEventListener("click", ev =>
        detailsPopupContainer.style.display = 'none');

        var title = document.createElement('h3');
        title.textContent = product.name;
        title.style.textAlign = 'center';
        detailsPopup.appendChild(title);
        detailsPopup.appendChild(document.createElement("hr"));

        var code = document.createElement("p");
        code.innerHTML = '<span style="color:midnightblue; font-weight: bold;">Codice prodotto: </span>' + product.code;

        var description = document.createElement("p");
        description.innerHTML = '<span style="color:midnightblue; font-weight: bold;">Descrizione:</span><br>' + product.description;

        var category = document.createElement("p");
        category.innerHTML = '<span style="color:midnightblue; font-weight: bold;">Categoria prodotto: </span>' + product.category;

        var photo = document.createElement("img");
        photo.src = "upload/"+product.image;
        photo.height = 100;
        photo.alt = "imageProduct";
        photo.id = 'imgPopup';

        detailsPopup.appendChild(photo);
        detailsPopup.appendChild(code);
        detailsPopup.appendChild(document.createElement('br'));
        detailsPopup.appendChild(description);
        detailsPopup.appendChild(document.createElement('br'));
        detailsPopup.appendChild(category);
        detailsPopupContainer.appendChild(detailsPopup);

        detailsPopupContainer.style.display = 'block';


    }

}) ();