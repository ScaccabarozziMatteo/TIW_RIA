var cart = [];

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
            var title = document.createElement('h3')
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

                makeCall("GET" , 'getInfoProduct?code=' + codeProd ,null,
                    function (request) {
                        switch (request.status) {
                            case 200:
                                var lists = JSON.parse(request.responseText);
                                var suppliers = lists[0];
                                var shipmentPolicies = lists[1];
                                printProductDetails (suppliers, product, shipmentPolicies);
                        }
                    });
            })
    }

    function printProductDetails (suppliers, product, shipmentPolicies) {
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
        photo.src = "upload/" + product.image;
        photo.height = 200;
        photo.alt = "imageProduct";
        photo.id = 'imgPopup';

        detailsPopup.appendChild(photo);
        detailsPopup.appendChild(code);
        detailsPopup.appendChild(description);
        detailsPopup.appendChild(category);


        var table = document.createElement('table');
        table.id = "tableShipmentPolicies";
        var tableBody = document.createElement('tbody');

        var row = document.createElement('tr');

        var thName = document.createElement('th');
        var thEvaluation = document.createElement('th');
        var thPrice = document.createElement('th');
        var thShipmentPolicies = document.createElement('th');
        var thNumProdCart = document.createElement('th');

        thName.textContent = "Nome";
        row.appendChild(thName);
        thEvaluation.textContent = "Valutazione";
        thEvaluation.style.width = '5%';
        row.appendChild(thEvaluation);
        thPrice.textContent = "Prezzo";
        row.appendChild(thPrice);
        thShipmentPolicies.textContent = "Politiche di spedizione";
        thShipmentPolicies.style.width = '30%';
        row.appendChild(thShipmentPolicies);
        thNumProdCart.textContent = "#prodotti del fornitore nel carrello";
        row.appendChild(thNumProdCart);
        row.appendChild(document.createElement('th'));
        table.appendChild(row);

        for (var x = 0; x < suppliers.length; x++) {

            var row2 = document.createElement('tr');
            var nameCol = document.createElement('td');
            var evaluationCol = document.createElement('td');
            var priceCol = document.createElement('td');
            var shipmentPoliciesCol = document.createElement('td');
            var shipmentPoliciesDetails = document.createElement('details');
            var shipmentPoliciesSummary = document.createElement('summary');

            var addProductsCartCol = document.createElement('td');
            var addProductsForm = document.createElement('form');
            var addProductsInputNumArt = document.createElement('input');
            var addProductsSubmitInput = document.createElement('input');



            nameCol.textContent = suppliers[x].name;
            evaluationCol.textContent = suppliers[x].evaluation;
            evaluationCol.style.width = '5%';
            shipmentPoliciesCol.style.width = '30%';
            priceCol.textContent = suppliers[x].priceProd + ".00 \u20ac";

            shipmentPoliciesSummary.textContent = "Espandi";
            shipmentPoliciesDetails.appendChild(shipmentPoliciesSummary);


            shipmentPolicies.forEach(function (element) {
                var shipPolicyDiv = document.createElement('div');
                if (element.supplier === suppliers[x].code && element.min_articles !== 999999999) {
                    shipPolicyDiv.textContent = "Da " + element.min_articles + " a " + element.max_articles + " articoli " + element.costShipment + ".00 \u20ac";
                    shipmentPoliciesDetails.appendChild(shipPolicyDiv);
                }
                else if (element.supplier === suppliers[x].code && element.min_articles === 999999999) {
                    shipPolicyDiv.textContent = "Spedizione gratuita a partire da " + element.freeShipment + ".00 \u20ac";
                    shipmentPoliciesDetails.appendChild(shipPolicyDiv);
                }
            })

            shipmentPoliciesCol.appendChild(shipmentPoliciesDetails);

            addProductsInputNumArt.min = '1';
            addProductsInputNumArt.type = 'number';
            addProductsSubmitInput.type = 'submit';
            addProductsInputNumArt.name = 'numProducts';
            addProductsSubmitInput.value = 'Inserisci nel carrello';
            addProductsSubmitInput.id = 'submitQuantity'

            addProductsForm.appendChild(addProductsInputNumArt);
            addProductsForm.appendChild(addProductsSubmitInput);
            addProductsCartCol.appendChild(addProductsForm);

            row2.appendChild(nameCol);
            row2.appendChild(evaluationCol);
            row2.appendChild(priceCol);
            row2.appendChild(shipmentPoliciesCol);
            row2.appendChild(document.createElement('td'));
            row2.appendChild(addProductsCartCol);
            tableBody.appendChild(row2);

            let supplier = suppliers[x];

            addProductsForm.addEventListener('submit', ev => addProductsCart(supplier, product));


        }

        table.appendChild(tableBody);
        detailsPopup.appendChild(table);
        detailsPopupContainer.appendChild(detailsPopup);

        detailsPopupContainer.style.display = 'block';


    }

    function addProductsCart(supplier, prod) {
        var quantity = document.getElementById('submitQuantity');
        var products = {};
        products.supplier = supplier;
        products.product = prod;
        products.quantity = quantity;
        cart.push(products);
        console.alert(cart[0].supplier.name);
    }

}) ();