var get = function(url, onload, headers) {
    var r = new XMLHttpRequest();
    if (headers != undefined) {
        for (var k in headers) {
            r.setRequestHeader(k, headers.k);
        }
    }
    r.onload = onload
    r.open('GET', url)
    r.send();
}
