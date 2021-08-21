(function() {

    document.getElementById("loginButton").addEventListener('click', (e) => {
        var form = e.target.closest("form");
        if (form.checkValidity()) {
            makeCall("POST", 'Login', e.target.closest("form"),
                function(request) {
                        switch (request.status) {
                            case 200:
                                var userData = JSON.parse(request.responseText);
                                sessionStorage.setItem('username', userData.name);
                                sessionStorage.setItem('sex', userData.sex);
                                sessionStorage.setItem('email', userData.email);
                                window.location.replace("PersonalArea.html");
                                break;
                            default: // server error
                                document.getElementById("errormessage").textContent = "Account inesistente";
                                break;
                        }
                }
            );
        } else {
            form.reportValidity();
        }
    });

})();