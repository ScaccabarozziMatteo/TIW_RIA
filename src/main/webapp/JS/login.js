(function() {

    document.getElementById("loginButton").addEventListener('click', (e) => {
        var form = e.target.closest("form");
        if (form.checkValidity()) {
            makeCall("POST", 'Login', e.target.closest("form"),
                function(request) {
                    if (request.readyState == XMLHttpRequest.DONE) {
                        var message = request.responseText;
                        switch (request.status) {
                            case 200:
                                var userData = JSON.parse(request.responseText);
                                sessionStorage.setItem('username', userData.name);
                                sessionStorage.setItem('sex', userData.sex);
                                sessionStorage.setItem('email', userData.email);
                                window.location.href = "PersonalArea.html";
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
                }
            );
        } else {
            form.reportValidity();
        }
    });

})();