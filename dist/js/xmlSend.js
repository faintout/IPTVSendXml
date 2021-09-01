
var xmlHttp;
function createXMLHttpResquest() {
    if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
}

function sendPets() {
    createXMLHttpResquest();
    var xml = createXML();
    var url = "http://172.17.13.17:8313?timestamp=" + new Date
        ().getTime();
    xmlHttp.open("POST", url, true);
    xmlHttp.onreadystatechange = callback;
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urllencoded");
    xmlHttp.send(xml);
}
function createXML() {
    var xml = "<pets>";
    // var options = document.getElementByIdx("pet");
    // var option = null;
    // for (var i = 0; i < options.length; i++) {
    //     option = options[i];
    //     if (option.selected) {
    //         xml = xml + "<type>" + option.value + "<\/type>";
    //     }
    // }
    xml = xml + "<\/pets>";
    return xml;
}
function callback() {
    if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
            parseResults();
        }
    }
}
function parseResults() {
    var responseDiv = document.getElementByIdx("serverresponse");
    if (responseDiv.hasChildNodes()) {
        responseDiv.removeChild(responseDiv.childNodes[0]);
    }
    var responseText = document.createTextNode(xmlHttp.responseText);
    responseDiv.appendChild(responseText);
}