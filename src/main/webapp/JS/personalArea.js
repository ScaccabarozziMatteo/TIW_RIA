var cart = [];

(function () {

    var name = sessionStorage.getItem('username');
    var sex = sessionStorage.getItem('sex');
    const welcomeDiv = document.getElementById("welcome");
    const logout_button = document.getElementById("logoutButton");
    const searchBar = document.getElementById("searchBar");
    var shipmentPolicies;
    var orders = [];


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

    let buttonCart = document.getElementById('cartButton');
    buttonCart.addEventListener('click', function () {
        cartCollapse(false, shipmentPolicies);
    })

    getOrders();

    let cartColl = document.getElementById("cartCollapsible")

    cartColl.addEventListener("click", function () {
        cartCollapse(false, shipmentPolicies);
    });


    searchBar.addEventListener("keyup", e => {

        let el = document.getElementById("searchBar");
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
                                printProductSearched(productsSearched, searchBar);
                        }
                    })
            }
        }  else
                printProductSearched(null);


    });


    function printProductSearched(listProducts, searchBar) {
        const searchedProd = document.getElementById("searchedProducts");
        let tableExisted = document.getElementById('tableProductSearched');
        let messageExist = document.getElementById('messageSearchProd');
        if (messageExist != null) {
            messageExist.remove();
        }

        if (listProducts == null && searchBar == null) {
            tableExisted.remove();
            document.getElementById('titleSearch').remove();
            return;
        }


        if (tableExisted != null) {
            tableExisted.remove();
            document.getElementById('titleSearch').remove();
        }
        if (listProducts != null && listProducts.length > 0) {
            let title = document.createElement('h3')
            title.id = "titleSearch";
            title.textContent = "Elementi trovati per: " + searchBar.value;

            let table = document.createElement('table');
            table.id = "tableProductSearched";
            let tableBody = document.createElement('tbody');

            searchedProd.style.display = "block";

            let row = document.createElement('tr');

            let thCode = document.createElement('th');
            let thName = document.createElement('th');
            let thPrice = document.createElement('th');
            let thDetails = document.createElement('th');


            thCode.textContent = "Codice";
            row.appendChild(thCode);
            thName.textContent = "Nome";
            row.appendChild(thName);
            thPrice.textContent = "Prezzo";
            row.appendChild(thPrice);
            thDetails.textContent = "Dettagli";
            row.appendChild(thDetails);
            table.appendChild(row);

            for (let i = 0; i < listProducts.length; i++) {
                let row2 = document.createElement('tr');
                let codeCol = document.createElement('td');
                let nameCol = document.createElement('td');
                let priceCol = document.createElement('td');
                let detailsCol = document.createElement('td');

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

            for (let i = 0; i < listProducts.length; i++) {
                const nameId = "detailButton" + listProducts[i].code;
                productDetails(listProducts[i].code, nameId, listProducts[i]);
            }
        } else if (searchBar.value !== '') {
            let message = document.createElement('h3');
            message.id = 'messageSearchProd';
            message.textContent = "Nessun elemento trovato :("
            searchedProd.appendChild(message);
        }
    }

    function productDetails(codeProd, nameId, product) {
        const button = document.getElementById(nameId);

        button.addEventListener("click",e => {

                makeCall("GET" , 'getInfoProduct?code=' + codeProd ,null,
                    function (request) {
                        switch (request.status) {
                            case 200:
                                let lists = JSON.parse(request.responseText);
                                let suppliers = lists[0];
                                shipmentPolicies = lists[1];
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

        close.addEventListener("click", ev => detailsPopupContainer.style.display = 'none');

        let title = document.createElement('h3');
        title.textContent = product.name;
        title.style.textAlign = 'center';
        detailsPopup.appendChild(title);
        detailsPopup.appendChild(document.createElement("hr"));

        let code = document.createElement("p");
        code.innerHTML = '<span style="color:midnightblue; font-weight: bold;">Codice prodotto: </span>' + product.code;

        let description = document.createElement("p");
        description.innerHTML = '<span style="color:midnightblue; font-weight: bold;">Descrizione:</span><br>' + product.description;

        let category = document.createElement("p");
        category.innerHTML = '<span style="color:midnightblue; font-weight: bold;">Categoria prodotto: </span>' + product.category;

        let photo = document.createElement("img");
        photo.src = "upload/" + product.image;
        photo.height = 200;
        photo.alt = "imageProduct";
        photo.id = 'imgPopup';

        detailsPopup.appendChild(photo);
        detailsPopup.appendChild(code);
        detailsPopup.appendChild(description);
        detailsPopup.appendChild(category);


        let table = document.createElement('table');
        table.id = "tableShipmentPolicies";
        let tableBody = document.createElement('tbody');

        let row = document.createElement('tr');

        let thName = document.createElement('th');
        let thEvaluation = document.createElement('th');
        let thPrice = document.createElement('th');
        let thShipmentPolicies = document.createElement('th');
        let thNumProdCart = document.createElement('th');

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

        for (let x = 0; x < suppliers.length; x++) {

            let row2 = document.createElement('tr');
            let nameCol = document.createElement('td');
            let evaluationCol = document.createElement('td');
            let priceCol = document.createElement('td');
            let shipmentPoliciesCol = document.createElement('td');
            let shipmentPoliciesDetails = document.createElement('details');
            let shipmentPoliciesSummary = document.createElement('summary');

            let addProductsCartCol = document.createElement('td');
            let addProductsForm = document.createElement('form');
            let addProductsInputNumArt = document.createElement('input');
            let addProductsSubmitInput = document.createElement('input');



            nameCol.textContent = suppliers[x].name;
            evaluationCol.textContent = suppliers[x].evaluation;
            evaluationCol.style.width = '5%';
            shipmentPoliciesCol.style.width = '30%';
            priceCol.textContent = suppliers[x].priceProd + ".00 \u20ac";

            shipmentPoliciesSummary.textContent = "Espandi";
            shipmentPoliciesDetails.appendChild(shipmentPoliciesSummary);


            shipmentPolicies.forEach(function (element) {
                let shipPolicyDiv = document.createElement('div');
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
            addProductsInputNumArt.required;
            addProductsSubmitInput.value = 'Inserisci nel carrello';
            addProductsInputNumArt.id = 'submitQuantity';

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

            addProductsForm.addEventListener('submit', ev => {
                if (addProductsInputNumArt.value === '')
                    ev.preventDefault();
                else {
                    ev.preventDefault();
                    addProductsCart(supplier, product, addProductsInputNumArt.value);
                    detailsPopupContainer.style.display = 'none';
                    searchBar.value = '';
                    printProductSearched();
                    cartCollapse(true, shipmentPolicies);
                }
            });


        }

        table.appendChild(tableBody);
        detailsPopup.appendChild(table);
        detailsPopupContainer.appendChild(detailsPopup);

        detailsPopupContainer.style.display = 'block';


    }

    function addProductsCart(supplier, prod, quantity) {
        let cartLength = cart.length;
        let product = null;
        let added = false;
        let products = {
            product,
            quantity
        };
        let order = {
            products: [],
            supplier
        };


        for (let i = 0; i < cartLength; i++) {
            if (cart[i].supplier.code === supplier.code) {
                let numProd = cart[i].products.length;
                for (let x = 0; x < numProd; x++) {
                    if (cart[i].products[x].product.code === prod.code) {
                        cart[i].products[x].quantity = Number.parseInt(cart[i].products[x].quantity) + Number.parseInt(quantity);
                        added = true;
                    }
                }
                if (added)  // Se l'elemento è stato aggiunto termina la funzione di inserimento
                    return false;
                else {      // Se elemento non esiste ma c'è il fornitore
                    products.product = prod;
                    products.quantity = quantity;
                    cart[i].products.push(products);
                    return;
                }
            }
        }
        order.supplier = supplier;
        products.product = prod;
        products.quantity = quantity;
        order.products.push(products);
        cart.push(order);
    }

    function printCart(contentCart, shipmentPolicies) {

        if (document.getElementById('containerCartContent') != null)
            document.getElementById('containerCartContent').remove();
        let containerCartContent = document.createElement('div');
        containerCartContent.id = 'containerCartContent';

        if (cart.length === 0) {
            let message = document.createElement('h3');
            message.textContent = 'Carrello vuoto! :('
            containerCartContent.appendChild(message);
            contentCart.appendChild(containerCartContent);
            return;
        }

        for (let y = 0; y < cart.length; y++) {
            let totalCost = 0;
            let totalQuantity = 0;

            let supplierName = document.createElement('h3');
            supplierName.textContent = cart[y].supplier.name;
            containerCartContent.appendChild(supplierName);

            let table = document.createElement('table');
            let tableBody = document.createElement('tbody');
            let row1 = document.createElement('tr');

            let thName = document.createElement('th');
            thName.textContent = 'Nome';
            row1.appendChild(thName);
            let thQuantity = document.createElement('th');
            thQuantity.textContent = 'Quantità';
            row1.appendChild(thQuantity);
            let thCostShipment = document.createElement('th');
            thCostShipment.textContent = 'Costo Spedizione';
            row1.appendChild(thCostShipment);
            let thTotal = document.createElement('th');
            thTotal.textContent = 'Totale';
            row1.appendChild(thTotal);
            let thDelete = document.createElement('th');
            thDelete.textContent = 'Elimina';
            row1.appendChild(thDelete);

            table.appendChild(row1);

            for (let a = 0; a < cart[y].products.length; a++) {
                let row2 = document.createElement('tr');

                let nameProduct = document.createElement('td');
                nameProduct.textContent = cart[y].products[a].product.name;
                let numProducts = document.createElement('td');
                numProducts.textContent = cart[y].products[a].quantity;
                totalQuantity += parseInt(cart[y].products[a].quantity);
                let totalProd = document.createElement('td');
                let total = parseFloat(cart[y].products[a].product.price) * parseInt(cart[y].products[a].quantity);
                totalCost += total;
                totalProd.textContent = total.toString() + ".00 \u20ac";
                row2.appendChild(nameProduct);
                row2.appendChild(numProducts);
                row2.appendChild(document.createElement('td'));
                row2.appendChild(totalProd);
                let deleteTd = document.createElement('td');
                let deleteSpan = document.createElement('span');
                deleteSpan.textContent = '🗑';
                deleteSpan.id = 'bin';
                deleteTd.appendChild(deleteSpan);
                deleteSpan.addEventListener('click', function (){
                    cart[y].products.splice(a, 1);
                    if (cart[y].products.length === 0)
                        cart.splice(y, 1);
                    printCart(contentCart, shipmentPolicies);
                });
                row2.appendChild(deleteTd);
                tableBody.appendChild(row2);
            }
            let lastRow = document.createElement('tr');
            let totalCol = document.createElement('td');
            totalCol.textContent = 'Totale';
            let totalShipCostCol = document.createElement('td');
            let totalShipCost = 0;
            totalShipCost = getShipmentCost(cart[y].supplier.code, shipmentPolicies, totalCost, totalQuantity);
            totalShipCostCol.textContent = totalShipCost.toString() +  ".00 \u20ac";
            let totalCostCol = document.createElement('td');
            let totalVar = totalShipCost + totalCost;
            totalCostCol.textContent = totalVar.toString() +  ".00 \u20ac";
            let orderButtonCol = document.createElement('td');
            let orderButton = document.createElement('button');
            orderButton.textContent = 'Ordina tutti i prodotti di questo fornitore!';
            orderButtonCol.appendChild(orderButton);

            orderButton.addEventListener('click', function() {
                startOrder();
            })


            lastRow.appendChild(totalCol);
            lastRow.appendChild(document.createElement('td'));
            lastRow.appendChild(totalShipCostCol);
            lastRow.appendChild(totalCostCol);
            lastRow.appendChild(orderButtonCol);
            tableBody.appendChild(lastRow);

            table.appendChild(tableBody);
            containerCartContent.appendChild(table);

        }
        contentCart.appendChild(containerCartContent);

    }

    function cartCollapse(collapse, shipmentPolicies) {
        let cartColl = document.getElementById("cartCollapsible");
        let contentCart = document.getElementById("contentCart");

        cartColl.classList.toggle("active");
        var content = cartColl.nextElementSibling;
        if (collapse)
            content.style.maxHeight = null;

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            if (document.getElementById("cartMessage") !== null)
                document.getElementById("cartMessage").remove();
        } else {
            printCart(contentCart, shipmentPolicies);
            content.style.maxHeight = content.scrollHeight + "px";
        }

    }

    function getShipmentCost(supplierCode, shipmentPolicies, totalCost, totalQuantity) {
        let cost = 0;
        for (let i = 0; i < shipmentPolicies.length; i++) {
            if (shipmentPolicies[i].supplier === supplierCode) {
                if (parseFloat(totalCost) >= parseFloat(shipmentPolicies[i].freeShipment) && shipmentPolicies[i].min_articles === 999999999)
                    return 0;
                else if (parseInt(shipmentPolicies[i].min_articles) <= totalQuantity && totalQuantity <= parseInt(shipmentPolicies[i].max_articles))
                    cost = parseFloat(shipmentPolicies[i].costShipment);
            }
        }
        return cost;
    }

    function startOrder() {

    }

    function getOrders() {
        makeCall('GET', 'getOrders', null, function (request) {
            switch (request.status) {
                case 200:
                    orders = JSON.parse(request.responseText);
                    //printProductDetails (suppliers, product, shipmentPolicies);
            }
        })
    }

}) ();