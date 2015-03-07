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
            iframe.addEventListener('load', function() {

                iframe.removeEventListener('load', this);
                var link = iframe.contentDocument.querySelector('a');
                var href = link.attributes.href.value;
                console.log('fuck', link.attributes.href.value);
                link.setAttribute('href', 'javascript:;');
                link.onclick = function() {
                    link.removeEventListener('onclick', this);
                    App.checkout(head.sha, href, function(content) { 
                        var style;
                        console.log("href2", href);
                        //console.log("content", content);
                      //var style = link.getAttribute('style');
                      //if (style == null) {
                      //    style = "pointer-events:none;";
                      //} else {
                      //    style += "pointer-events:none;";
                      //}
                      //link.setAttribute('style', style);
                      //console.log('style', link.getAttribute('style'));

                        console.log(atob(content));
                        iframe.srcdoc = atob(content);
                    });

                }
                App.correctPath(head.sha, link.attributes.href.value, function(url) { 
                    console.log("href", link.attributes.href.value);
                    console.log("url", url);
                    //link.setAttribute('href', url);
                });
            });

          //var matches = /src="(.*?)"/g.exec(html);

          //});

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
    console.log("path", path);
    var file;
    get(reqUrl, function() {
        var json = JSON.parse(this.responseText);
        cb(json.download_url);
    });
};
