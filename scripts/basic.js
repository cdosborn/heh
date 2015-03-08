var TIMES = 0;
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

var generateIframe = function() {
    var head = commit_list[commit_index];
    App.checkout(head.sha, 'index.html', function(content) {
        // https://developer.github.com/v3/media/
        var html = atob(content);
        var iframe = document.querySelector('iframe');
        iframe.srcdoc = html;

        var durp = function() { 
		updateChildrenLinks(head.sha, iframe.contentDocument, function() {});
        };
    
        iframe.addEventListener('load', durp);
    
    });
}

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

function updateChildrenLinks(commit, parent, after) {
  var elements = parent.getElementsByTagName('*');
  var elem;
  for (var i = 0, n = elements.length; i < n; i++) {
    elem = elements[i]; 
    if (elem.getAttribute('src') !== null) {
        handleSrc(commit, elem, after);
    } else if (elem.tagName == "A") {
        handleAnchor(commit, elem, after);
    } else if (elem.tagName == "LINK") {
        handleLink(commit, elem, after);
    }
  }
}

// get elems to change
// 

function handleSrc(commit, elem, after) {
    var url = elem.getAttribute('src');
    App.correctPath(commit, url, function(path) { 
      var dirs = path.split('/');
      for (var i = 0; i < dirs.length; i++) {
          if (dirs[i].indexOf('raw') != -1) {
              dirs[i] = 'cdn.rawgit.com';
              break;
          };
      };

      //console.log("path", dirs.join('/'));
      elem.setAttribute('src', dirs.join('/'));
      after();
    });
}

function handleLink(commit, elem, after) {
    var url = elem.getAttribute('href');

    var dirs = url.split('/');
    
    var url_is_relative = dirs[0].indexOf('http') == -1;

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
              if (dirs[i].indexOf('raw') != -1) {
                  dirs[i] = 'cdn.rawgit.com';
                  break;
              };
          };

          console.log("LINK", dirs.join('/'));
          console.log("CURDIR", cur_dir);
          elem.setAttribute('href', dirs.join('/'));
	  after();
	  console.log("WHAT", elem.getAttribute('href'));
        });
    }
}

function handleAnchor(commit, elem, after) {
    var url = elem.getAttribute('href');

    elem.setAttribute('href', 'javascript:;'); 

    elem.onclick = function() {
        var dirs = url.split('/');
        
        var url_is_relative = dirs[0].indexOf('http') == -1;
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
	    	after();
            });
        } else { 
	  after(); 
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


