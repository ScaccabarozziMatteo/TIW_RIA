(function () {


    let name = sessionStorage.getItem('username');
    let sex = sessionStorage.getItem('sex');
    let welcomeDiv;
    let logout_button = document.getElementById("logoutButton");
    let searchBar = document.getElementById("searchBar");
    let homeButton = document.getElementById("homeButton");
    let productsSearched;

    let orders = [];

    if (name == null) {
        sessionStorage.clear();
        window.location.replace("index.html");
    }

    let fiveProducts = JSON.parse(sessionStorage.getItem('fiveProducts'));
    let viewedElements = JSON.parse(sessionStorage.getItem('viewedElements'));
    let cart = JSON.parse(sessionStorage.getItem('cart'));
    let shipmentPolicies = JSON.parse(sessionStorage.getItem('shipmentPolicies'));

    // Initialize cart and viewedElements if they don't exist
    if (viewedElements == null)
        viewedElements = [];
    if (cart == null)
        cart = [];

    if(document.getElementById("welcome") == null) {
        sessionStorage.clear();
        window.location.replace('index.html');
    }
    else
        welcomeDiv = document.getElementById("welcome");


    switch (sex) {
        case 'male':
            welcomeDiv.textContent = "Benvenuto " + name;
            break;
        case 'female':
            welcomeDiv.textContent = "Benvenuta " + name;
            break;
        case null:
            welcomeDiv.textContent = "Benvenut* " + name;
            break;
    }

    get5products();

    logout_button.addEventListener("click", function () {
        sessionStorage.clear();
        window.location.replace("index.html");
    })

    let buttonCart = document.getElementById('cartButton');
    buttonCart.addEventListener('click', function () {
        cartCollapse(true, shipmentPolicies, true);
    })

    homeButton.addEventListener('click', function () {
        homeAction();
    })

    getOrders();

    let cartColl = document.getElementById("cartCollapsible")

    cartColl.addEventListener("click", function () {
        cartCollapse(false, shipmentPolicies);
    });

    let ordersButtonNav = document.getElementById('orderButtonNav');
    ordersButtonNav.addEventListener('click', function () {
        orderCollapse(true, true);
    })

    let ordersColl = document.getElementById("ordersCollapsible");

    ordersColl.addEventListener("click", function () {
        orderCollapse();
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
                        if (request.readyState === XMLHttpRequest.DONE) {
                            switch (request.status) {
                                case 200:
                                    productsSearched = JSON.parse(request.responseText);
                                    printProductSearched(productsSearched, searchBar);

                                    window.location.href = "#searchedProducts";
                                    document.getElementById('searchBar').focus({preventScroll: true});

                                    break;
                                default:
                                    sessionStorage.clear();
                                    window.location.replace("errorPage.html");
                            }
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
                detailsCol.innerHTML = "<button class='details_button_search' id='" + nameId + "'>Dettagli</button>";
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

        button.addEventListener("click",function () {

                makeCall("GET" , 'getInfoProduct?code=' + codeProd ,null,
                    function (request) {
                        if (request.readyState === XMLHttpRequest.DONE) {
                            switch (request.status) {
                                case 200:
                                    let lists = JSON.parse(request.responseText);
                                    let suppliers = lists[0];
                                    shipmentPolicies = lists[1];
                                    printProductDetails(suppliers, product, shipmentPolicies);
                                    break;
                                default:
                                    sessionStorage.clear();
                                    window.location.replace("errorPage.html");
                            }
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

        close.addEventListener("click", function () { detailsPopupContainer.style.display = 'none'});

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
        let quantity = document.createElement('th');

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
        quantity.textContent = 'Quantità';
        row.appendChild(quantity);
        table.appendChild(row);

        for (let x = 0; x < suppliers.length; x++) {

            let supplierCode = suppliers[x].code;

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
            let numProdCart = document.createElement('td');



            nameCol.textContent = suppliers[x].name;
            evaluationCol.textContent = suppliers[x].evaluation;
            evaluationCol.style.width = '5%';
            shipmentPoliciesCol.style.width = '30%';
            priceCol.textContent = suppliers[x].priceProd + ".00 \u20ac";
            product.price = suppliers[x].priceProd; // Setta correttamente il prezzo

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
            addProductsInputNumArt.placeholder = 'Quantità';
            addProductsSubmitInput.value = 'Inserisci nel carrello';
            addProductsSubmitInput.id = 'submitQuantityButton'
            addProductsInputNumArt.id = 'submitQuantity';

            let numProdInCart = getNumProductInCart(product, supplierCode);
            numProdCart.textContent = numProdInCart;
            numProdCart.style.cursor = 'pointer';

            createPopup(numProdInCart, supplierCode, numProdCart, product.code);

            numProdCart.addEventListener('mousemove', function (e) {
                let offsetEL = window.document.getElementById('detailsPopup');

                document.getElementById('divPopup' + supplierCode + product.code).style.left = Number(e.clientX - offsetEL.offsetLeft - 200) + 'px';
                document.getElementById('divPopup' + supplierCode + product.code).style.top = Number(e.clientY - offsetEL.offsetTop - 200) + 'px';
                document.getElementById('divPopup' + supplierCode + product.code).style.display = 'block';
            });

            numProdCart.addEventListener('mouseout', function () {
                document.getElementById('divPopup' + supplierCode + product.code).style.display = 'none';
            });

            addProductsForm.appendChild(addProductsInputNumArt);
            addProductsForm.appendChild(addProductsSubmitInput);
            addProductsCartCol.appendChild(addProductsForm);

            row2.appendChild(nameCol);
            row2.appendChild(evaluationCol);
            row2.appendChild(priceCol);
            row2.appendChild(shipmentPoliciesCol);
            row2.appendChild(numProdCart);
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
                    printProductSearched(productsSearched, searchBar);
                    cartCollapse(true, shipmentPolicies, true);
                }
            });


        }

        table.appendChild(tableBody);
        detailsPopup.appendChild(table);
        detailsPopupContainer.appendChild(detailsPopup);

        detailsPopupContainer.style.display = 'block';

        addProdViewed(product);

    }

    function addProductsCart(supplier, prod, quantity) {
        let cartLength = cart.length;
        let product = null;
        let added = false;
        let subtotal = 0;
        let costShipment = 0;
        let products = {
            product,
        };
        let order = {
            products: [],
            supplier,
            costShipment,
            subtotal
        };


        for (let i = 0; i < cartLength; i++) {
            if (cart[i].supplier.code === supplier.code) {
                let numProd = cart[i].products.length;
                for (let x = 0; x < numProd; x++) {
                    if (cart[i].products[x].product.code === prod.code) {
                        cart[i].products[x].product.quantity = Number.parseInt(cart[i].products[x].product.quantity) + Number.parseInt(quantity);
                        cart[i].quantity += Number(quantity);
                        added = true;
                    }
                }
                if (added)  // Se l'elemento è stato aggiunto termina la funzione di inserimento
                    return false;
                else {      // Se elemento non esiste ma c'è il fornitore
                    products.product = prod;
                    products.product.quantity = quantity;
                    cart[i].products.push(products);
                    cart[i].quantity += Number(quantity);
                    return;
                }
            }
        }
        order.supplier = supplier;
        products.product = prod;
        products.product.quantity = quantity;
        order.products.push(products);
        order.quantity = Number(quantity);
        cart.push(order);

        sessionStorage.setItem('cart', JSON.stringify(cart));
    }

    function printCart(contentCart, shipmentPolicies) {

        shipmentPolicies = getShipmentPolicies();

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

            let supplierCode = cart[y].supplier.code;

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
                numProducts.textContent = cart[y].products[a].product.quantity;
                totalQuantity += parseInt(cart[y].products[a].product.quantity);
                let totalProd = document.createElement('td');
                let total = parseFloat(cart[y].products[a].product.price) * parseInt(cart[y].products[a].product.quantity);
                totalCost += total;
                cart[y].subtotal = totalCost;       // Set subtotal cost of this order in cart
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
            totalShipCost = getShipmentCost(cart[y].supplier.code, totalCost, totalQuantity);
            cart[y].costShipment = totalShipCost;       // Set shipment cost of this order in cart
            totalShipCostCol.textContent = totalShipCost.toString() +  ".00 \u20ac";
            let totalCostCol = document.createElement('td');
            let totalVar = totalShipCost + totalCost;
            totalCostCol.textContent = totalVar.toString() +  ".00 \u20ac";
            let orderButtonCol = document.createElement('td');
            let orderButton = document.createElement('button');
            orderButton.textContent = 'Ordina tutti i prodotti di questo fornitore!';
            orderButton.id = 'orderButton';
            orderButtonCol.appendChild(orderButton);

            orderButton.addEventListener('click', function() {
                startOrder(supplierCode);
            })


            lastRow.appendChild(totalCol);
            lastRow.appendChild(document.createElement('td'));
            lastRow.appendChild(totalShipCostCol);
            lastRow.appendChild(totalCostCol);
            lastRow.appendChild(orderButtonCol);
            tableBody.appendChild(lastRow);

            table.appendChild(tableBody);
            containerCartContent.appendChild(table);
            containerCartContent.appendChild(document.createElement('br'));

        }
        contentCart.appendChild(containerCartContent);

    }

    function cartCollapse(collapse, shipmentPolicies, anchor) {
        let cartColl = document.getElementById("cartCollapsible");
        let contentCart = document.getElementById("contentCart");

        cartColl.classList.toggle("active");
        let content = cartColl.nextElementSibling;
        if (collapse)
            content.style.maxHeight = null;

        if (collapse === -1)
            content.style.maxHeight = content.scrollHeight + "px";

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            if (document.getElementById("cartMessage") !== null)
                document.getElementById("cartMessage").remove();
        } else {
            printCart(contentCart, shipmentPolicies);
            content.style.maxHeight = content.scrollHeight + "px";
        }

        setTimeout(() => {
            if (anchor)
                window.location.href = "#cartCollapsible";
            }, 200);

    }

    function orderCollapse(collapse, anchor) {
        let orderColl = document.getElementById("ordersCollapsible");

        orderColl.classList.toggle("active");
        let content = orderColl.nextElementSibling;
        if (collapse)
            content.style.maxHeight = null;

        if (collapse === -1)
            content.style.maxHeight = content.scrollHeight + "px";

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            if (document.getElementById("ordersMessage") !== null)
                document.getElementById("ordersMessage").remove();
        } else {
            printOrders();
            content.style.maxHeight = content.scrollHeight + "px";
        }

        setTimeout(() => {
            if (anchor)
                window.location.href = "#ordersCollapsible";
        }, 200);

    }

    function getShipmentCost(supplierCode, totalCost, totalQuantity) {
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

    function startOrder(supplierCode) {
        let stringOrder;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].supplier.code === supplierCode) {
                stringOrder = JSON.stringify(cart[i]);
                sentOrder(stringOrder);
                cart.splice(i, 1);
            }
        }
    }

    function sentOrder(order) {
        sendJSON('Orders', order, function (request) {
            if (request.readyState === XMLHttpRequest.DONE) {
                let message = request.responseText;
                switch (request.status) {
                    case 200:
                        getOrders();
                        cartCollapse(true, shipmentPolicies);
                        orderCollapse(-1);
                        break;
                    default:
                        alert(message);
                        sessionStorage.clear();
                        window.location.replace("errorPage.html");
                }
            }
        })
    }

    function getOrders() {
        makeCall('GET', 'Orders', null, function (request) {
            if (request.readyState === XMLHttpRequest.DONE) {
                switch (request.status) {
                    case 200:
                        orders = JSON.parse(request.responseText);
                        break;
                    default:
                        sessionStorage.clear();
                        window.location.replace("errorPage.html");
                }
            }
        })
    }

    function printOrders() {

        if (document.getElementById('containerOrderContent') != null)
            document.getElementById('containerOrderContent').remove();
        let containerOrderContent = document.createElement('div');
        let contentOrders = document.getElementById('contentOrders');
        containerOrderContent.id = 'containerOrderContent';


        if (orders.length === 0) {
            let message = document.createElement('h3');
            message.textContent = 'Nessun ordine presente! :('
            containerOrderContent.appendChild(message);
            contentOrders.appendChild(containerOrderContent);
            return;
        }

        for (let y = 0; y < orders.length; y++) {

            let orderID = document.createElement('h3');
            orderID.textContent = '#Ordine:' + orders[y].numOrder + ' - '+ orders[y].supplierName;
            containerOrderContent.appendChild(orderID);

            let table = document.createElement('table');
            let tableBody = document.createElement('tbody');
            let row1 = document.createElement('tr');

            let thName = document.createElement('th');
            thName.textContent = 'Nome prodotto';
            row1.appendChild(thName);
            let thQuantity = document.createElement('th');
            thQuantity.textContent = 'Quantità';
            row1.appendChild(thQuantity);
            let thPhoto = document.createElement('th');
            thPhoto.textContent = 'Foto';
            row1.appendChild(thPhoto);
            let thCostShipment = document.createElement('th');
            thCostShipment.textContent = 'Costo Spedizione';
            row1.appendChild(thCostShipment);
            let thTotal = document.createElement('th');
            thTotal.textContent = 'Totale';
            row1.appendChild(thTotal);


            table.appendChild(row1);

            for (let a = 0; a < orders[y].products.length; a++) {
                let product = orders[y].products[a];
                let row2 = document.createElement('tr');

                let nameProduct = document.createElement('td');
                nameProduct.textContent = product.name;
                let numProducts = document.createElement('td');
                numProducts.textContent = product.quantity;
                let totalProd = document.createElement('td');
                let total = parseFloat(product.price) * parseInt(product.quantity);
                totalProd.textContent = total.toString() + ".00 \u20ac";
                row2.appendChild(nameProduct);
                row2.appendChild(numProducts);


                let photoTd = document.createElement('td');
                let photoImg = document.createElement('img');
                photoImg.src = "upload/" + product.image;
                photoImg.height = 100;
                photoImg.alt = "imageProduct";

                photoTd.appendChild(photoImg);
                row2.appendChild(photoTd);
                row2.appendChild(document.createElement('td'));
                row2.appendChild(totalProd);
                tableBody.appendChild(row2);
            }
            let lastRow = document.createElement('tr');
            let totalCol = document.createElement('td');
            totalCol.textContent = 'Totale';
            let totalShipCostCol = document.createElement('td');
            totalShipCostCol.textContent = orders[y].shipmentFees +  ".00 \u20ac";
            let totalCostCol = document.createElement('td');
            let totalCost = Number(orders[y].total) + Number(orders[y].shipmentFees);
            totalCostCol.textContent = totalCost +  ".00 \u20ac";


            lastRow.appendChild(totalCol);
            lastRow.appendChild(document.createElement('td'));
            lastRow.appendChild(document.createElement('td'));
            lastRow.appendChild(totalShipCostCol);
            lastRow.appendChild(totalCostCol);
            tableBody.appendChild(lastRow);

            table.appendChild(tableBody);
            containerOrderContent.appendChild(table);
            containerOrderContent.appendChild(document.createElement('br'));

        }
        contentOrders.appendChild(containerOrderContent);
    }

    function getShipmentPolicies() {
        makeCall('GET', 'getShipmentPolicies', null, function (request) {
            if (request.readyState === XMLHttpRequest.DONE) {
                switch (request.status) {
                    case 200:
                        shipmentPolicies = JSON.parse(request.responseText);
                        sessionStorage.setItem('shipmentPolicies', JSON.stringify(shipmentPolicies));
                        return shipmentPolicies;
                    default:
                        sessionStorage.clear();
                        window.location.replace("errorPage.html");
                }
            }
        })
    }

    function getNumProductInCart(product, supplier) {

        for (let a = 0; a < cart.length; a++) {
            if (cart[a].supplier.code === supplier) {
                return cart[a].quantity;
            }
        }
        return 0;
    }

    function homeAction() {
        document.getElementById('searchedProducts').style.display = 'none';
        cartCollapse(-1, shipmentPolicies);
        orderCollapse(-1);
        searchBar.value = '';

    }

    function get5products() {

        if (sessionStorage.getItem('fiveProducts') != null) {
            fiveProducts = JSON.parse(sessionStorage.getItem('fiveProducts'))
            printADVprod();
        }

        if (fiveProducts == null) {
            makeCall('GET', 'get5products', null, function (request) {
                if (request.readyState === XMLHttpRequest.DONE) {
                    switch (request.status) {
                        case 200:
                            fiveProducts = JSON.parse(request.responseText);
                            sessionStorage.setItem('fiveProducts', JSON.stringify(fiveProducts));
                            printADVprod()
                            break;
                        default:
                            sessionStorage.clear();
                            window.location.replace("errorPage.html");
                    }
                }
            })
        }
    }

    function printADVprod() {
        let divID = document.getElementById('adv');

        if (document.getElementById('advTable') !== null) {
            document.getElementById('advTable').remove();
            document.getElementById('advTitle').remove();
        }

        let advTitle = document.createElement('h3');
        advTitle.id = 'advTitle';
        advTitle.textContent = 'Ecco un pò di consigli scelti apposta per te:';
        divID.appendChild(advTitle);
        let advTable = document.createElement('table');
        advTable.id = 'advTable';
        let advTableBody = document.createElement('tbody');
        let advRow = document.createElement('tr');
        advRow.style.backgroundColor = 'white';

        let vw = 0;
        let five = 0;
        let product = [];
        let prod;

        for(let a = 0; a < 5; a++) {
            let advCol = document.createElement('td');
            let advDiv = document.createElement('div');
            let advImg = document.createElement('img');
            let advP1 = document.createElement('p');
            let advP2 = document.createElement('p');

            if (viewedElements.length > vw) {
                advImg.src = "upload/" + viewedElements[vw].image;
                advImg.height = 200;
                advImg.alt = "imageProduct";
                advImg.style.cursor = 'pointer';

                advP1.textContent = viewedElements[vw].name;
                advP1.style.cursor = 'pointer';
                advP1.className = 'ADVlink';
                prod = viewedElements[vw];
                product.push(prod);
                advP2.textContent = 'Prodotto visto di recente'
                advP2.className = 'viewedMessage';
                vw++;
            }
            else {
                advImg.src = "upload/" + fiveProducts[five].image;
                advImg.height = 200;
                advImg.alt = "imageProduct";
                advImg.style.cursor = 'pointer';
                prod = fiveProducts[five];
                product.push(prod);

                advP1.textContent = fiveProducts[five].name;
                advP1.style.cursor = 'pointer';
                advP1.className = 'ADVlink';
                advP2.textContent = 'Offerta speciale!'
                advP2.className = 'saleMessage';
                five++;
            }

            advCol.id = 'ADV' + prod.code;
            advDiv.appendChild(advImg);
            advDiv.appendChild(advP1);
            advDiv.appendChild(advP2);
            advCol.appendChild(advDiv);
            advRow.appendChild(advCol);
        }

        advTableBody.appendChild(advRow);
        advTable.appendChild(advTableBody);
        divID.appendChild(advTable);

        for (let a = 0; a < 5; a++) {
            productDetails(product[a].code, 'ADV' + product[a].code, product[a]);
        }
    }

    function addProdViewed(product) {
        for (let i = 0; i < viewedElements.length; i++) {
            if (viewedElements[i].code === product.code)
                viewedElements.splice(i, 1);
        }
        viewedElements.unshift(product);

        if (viewedElements.length > 5)
            viewedElements.pop();

        eliminateFrom5products(product.code);

        sessionStorage.setItem('viewedElements', JSON.stringify(viewedElements));

    }

    function eliminateFrom5products(codeProd) {
        for (let i = 0; i < fiveProducts.length; i++) {
            if (fiveProducts[i].code === codeProd) {
                fiveProducts.splice(i, 1);
            }
        }

        printADVprod();

        sessionStorage.setItem('fiveProducts', JSON.stringify(fiveProducts));
    }

    function createPopup(numProdInCart, supplierCode, numProdCart, prodCode) {

        if (document.getElementById('divPopup' + supplierCode + prodCode) != null)
            document.getElementById('divPopup' + supplierCode + prodCode).remove();

        let divPopup = document.createElement('div');
        divPopup.id = 'divPopup' + supplierCode + prodCode;
        divPopup.className = 'divPopup'

        if (numProdInCart === 0) {
            let titleH4 = document.createElement('h4');
            titleH4.className = 'spanPopup';
            titleH4.textContent = 'Non ci sono prodotti di questo fornitore nel carrello!'
            divPopup.appendChild(titleH4);
            divPopup.style.background = 'yellow';
        } else {

            let elementCart;

            for (let i = 0; i < cart.length; i++)
                if (cart[i].supplier.code === supplierCode) {
                    elementCart = cart[i];
                    break;
                }

            let titlePopup = document.createElement('h4');
            titlePopup.textContent = numProdInCart + ' articoli presenti:';

            divPopup.appendChild(titlePopup);
            divPopup.style.background = 'lawngreen';

            for (let a = 0; a < elementCart.products.length; a++) {
                let spanText = document.createElement('p');
                spanText.textContent = elementCart.products[a].product.quantity + 'x ' + elementCart.products[a].product.name;
                spanText.style.textAlign = 'left';
                divPopup.appendChild(spanText);
            }

        }
        numProdCart.appendChild(divPopup);

    }

}) ();