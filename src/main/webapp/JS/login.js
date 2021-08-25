(function() {

    document.getElementById("loginButton").addEventListener('click', (e) => {
        let form = e.target.closest("form");
        if (form.checkValidity()) {
            makeCall("POST", 'Login', form,
                function(request) {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        let message = request.responseText;
                        switch (request.status) {
                            case 200:
                                let userData = JSON.parse(request.responseText);
                                sessionStorage.setItem('username', userData.name);
                                sessionStorage.setItem('sex', userData.sex);
                                sessionStorage.setItem('email', userData.email);
                                window.location.replace("PersonalArea.html");
                                break;
                            case 400: // bad request
                                document.getElementById("errormessage").textContent = message;
                                break;
                            case 401: // unauthorized
                                document.getElementById("errormessage").textContent = message;
                                break;
                            case 500: // server error
                                document.getElementById("errormessage").textContent = message;
                                break;
                        }
                    }
                    else
                        document.getElementById("errormessage").textContent = "Caricamento in corso...";
                }
            );
        } else {
            form.reportValidity();
        }
    });

    if (sessionStorage.getItem('username').length > 0) {
        window.location.replace("PersonalArea.html");
    }

})();