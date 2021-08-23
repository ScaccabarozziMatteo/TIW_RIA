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
                                printProductSearched(productsSearched)
                        }
                    })
            }
        }  else
                printProductSearched(null);


    });

    function printProductSearched(listProducts) {
        const searchedProd = document.getElementById("searchedProducts");
        var tableExisted = document.getElementById('tableProductSearched');
        if (tableExisted != null)
            tableExisted.remove();
        if (listProducts != null) {
            var table = document.createElement('table');
            table.id = "tableProductSearched";
            var tableBody = document.createElement('tbody');

            searchedProd.style.display = "block";

            for (var i = 0; i < listProducts.length; i++) {
                var row = document.createElement('tr');
                var nameCol = document.createElement('td');
                var description = document.createElement('td');
                nameCol.textContent = listProducts[i].name;
                description.textContent = listProducts[i].description;
                row.appendChild(nameCol);
                row.appendChild(description)
                tableBody.appendChild(row);
            }
            table.appendChild(tableBody);
            searchedProd.appendChild(table);
        }
    }

}) ();