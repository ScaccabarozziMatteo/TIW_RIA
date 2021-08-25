function makeCall(method, url, formElement, cback, reset = true) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        cback(req)
    };
    req.open(method, url);
    if (formElement == null) {
        req.send();
    } else {
        req.send(new FormData(formElement));
    }
    if (formElement !== null && reset === true) {
        formElement.reset();
    }
}

function sendJSON(url, JSONObj, cback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        cback(req)
    };
    req.open('POST', url);
    req.setRequestHeader("JSONObj", "application/json");
    req.send(JSONObj);
}
