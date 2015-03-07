//var repository = 'Jam';
//var repository = 'hackarizona';
var repository = 'lit';
var owner = 'cdosborn';
//var owner = 'respoke';
var base = 'https://api.github.com/repos';
var branch = 'gh-pages'; // or 'master'
var reqUrl = base + '/' + owner + '/' + repository + '/commits?sha=' + branch;
var cur_dir = [];

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
                updateChildrenLinks(head.sha, iframe.contentDocument);

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
    console.log("path", path);
    var file;
    get(reqUrl, function() {
        var json = JSON.parse(this.responseText);
        cb(json.download_url);
    });
};

// choose commit
// fetches index
// updatesChildren, sets onclick on href
//      onlcick needs to be able to reset the process

function updateChildrenLinks(commit, parent) {
  var elements = parent.getElementsByTagName('*');
  var elem;
  for (var i = 0, n = elements.length; i < n; i++) {
    elem = elements[i]; 
    if (elem.getAttribute('src') !== null) {
        handleSrc(commit, elem);
    } else if (elem.tagName == "A") {
        handleAnchor(commit, elem);
    } else if (elem.tagName == "LINK") {
        handleLink(commit, elem);
    }
  }
}

// get elems to change
// 

function handleSrc(commit, elem) {
    var url = elem.getAttribute('src');
    App.correctPath(commit, url, function(hosted_path) { 
        elem.setAttribute('src', hosted_path);
    });
}

function handleLink(commit, elem) {
    var url = elem.getAttribute('href');

    var dirs = url.split('/');
    
    var url_is_relative = !dirs[0].contains('http');
    // if the path is relative update cur_dir
    var this_dur = cur_dir.slice();
    if (url_is_relative) {
        for (var i = 0; i < dirs.length - 1; i++) {
            if (dirs[i] == '..') {
                this_dur.length -= 1;
            } else if (dirs[i] != '.') {
                this_dur.push(dirs[i]);
            }
        }
        url = this_dur.join('/') + '/' +  dirs[dirs.length - 1];

        App.correctPath(commit, url, function(path) { 
          var dirs = path.split('/');
          for (var i = 0; i < dirs.length; i++) {
              if (dirs[i].contains('raw')) {
                  dirs[i] = 'cdn.rawgit.com';
                  break;
              };
          };

          console.log("path", dirs.join('/'));
          elem.setAttribute('href', dirs.join('/'));
        });
    }
}

function handleAnchor(commit, elem) {
    var url = elem.getAttribute('href');

    elem.setAttribute('href', 'javascript:;'); 

    elem.onclick = function() {
        var dirs = url.split('/');
        
        var url_is_relative = !dirs[0].contains('http');
        // if the path is relative update cur_dir
        if (url_is_relative) {
            for (var i = 0; i < dirs.length - 1; i++) {
                if (dirs[i] == '..') {
                    cur_dir.length -= 1;
                } else if (dirs[i] != '.') {
                    cur_dir.push(dirs[i]);
                }
            }

            url = cur_dir.join('/');
            if (cur_dir.length > 0) {
                url += '/';
            }
            url += dirs[dirs.length - 1];
            console.log('CURDIR', cur_dir.join('/'));
        }


        elem.removeEventListener('onclick', this);
        if (url_is_relative) {
            App.checkout(commit, url, function(content) { 
                //console.log('src', cur_dir + url);
                document.querySelector('iframe').srcdoc = atob(content);
            });
        }
    }
}



// iframe.addEventListener('load', function() {
//
//     iframe.removeEventListener('load', this);
//     var doc = iframe.contentDocument;
//     var tags = ['a', 'script',
//     var links = doc.getElementsByTagName('a') + doc.getElementsByTagName('script');
//     var href = link.attributes.href.value;
//     link.setAttribute('href', 'javascript:;');
//     link.onclick = function() {
//         link.removeEventListener('onclick', this);
//         App.checkout(head.sha, href, function(content) { 
//             var style;
//             //console.log("content", content);
//           //var style = link.getAttribute('style');
//           //if (style == null) {
//           //    style = "pointer-events:none;";
//           //} else {
//           //    style += "pointer-events:none;";
//           //}
//           //link.setAttribute('style', style);
//           //console.log('style', link.getAttribute('style'));
//
//             console.log(atob(content));
//             iframe.srcdoc = atob(content);
//         });
//
//     }
//     App.correctPath(head.sha, link.attributes.href.value, function(url) { 
//         console.log("href", link.attributes.href.value);
//         console.log("url", url);
//         //link.setAttribute('href', url);
//     });
// }


