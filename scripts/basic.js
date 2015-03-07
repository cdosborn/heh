var repository = 'lit';
var owner = 'cdosborn';
var base = 'https://api.github.com/repos';
var branch = 'gh-pages'; // or 'master'
var reqUrl = base '/' + owner + '/' + repository + '/commits?sha=' + branch;

var commits, head;

var App = function() {

    get(reqUrl, function() {
        commits = JSON.parse(this.responseText);
        head = commits[0]; 
        App.checkout(head.sha, 'index.html', function(url) {
            var iframe = document.querySelector('iframe');
            iframe.src = url;
        });
    });
};

App.checkout = function(hash, path, cb) {
    //GET /repos/:owner/:repo/contents/:path?ref=hash

    var reqUrl = base + '/' + owner + '/' + repository + '/contents/' + path + '?ref=' + hash
    var file;
    get(reqUrl, function() {
        var json = JSON.parse(this.responseText);
        cb(json.download_url);
    });
};

var get = function(url, onload) {
    var r = new XMLHttpRequest();
    r.onload = onload
    r.open('GET', url)
    r.send();
}
