var repository = 'lit';
var owner = 'cdosborn';
var base = 'https://api.github.com/repos';
var branch = 'gh-pages'; // or 'master'
var reqUrl = base + '/' + owner + '/' + repository + '/commits?sha=' + branch;

var commits, head;

var App = function() {

    get(reqUrl, function() {
        commits = JSON.parse(this.responseText);
        head = commits[0]; 
        App.checkout(head.sha, 'index.html', function(content) {
            // https://developer.github.com/v3/media/
            var html = atob(content);
            var iframe = document.querySelector('iframe');
            iframe.srcdoc = html;
            iframe.srcdoc = html.replace(/src="(.*?)"/g, function(match, path) {
                App.correctPath(head.sha, path, function(url) {
                });
            });

        });
    });
};

App.checkout = function(hash, path, cb) {
    //GET /repos/:owner/:repo/contents/:path?ref=hash

    var reqUrl = base + '/' + owner + '/' + repository + '/contents/' + path + '?ref=' + hash
    var file;
    get(reqUrl, function() {
        var json = JSON.parse(this.responseText);
        //cb(json.download_url);
        cb(json.content);
    });
};

App.correctPath = function(hash, path, cb) {
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
