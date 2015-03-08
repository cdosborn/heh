var parseForms = function(){
    $("#get").click(function(){
        var owner = getrepo.owner.value;
        var repo = getrepo.repo.value;
        onSubmit(owner, repo);
    })
    $('.left').click(function(){
	onLeftArrow();
    });
    $('.right').click(function(){
	onRightArrow();
    });
}


var onSubmit = function(owner, repo) {
    // /users/:username
    get('https://api.github.com/users/' + owner, function() {
        if (this.responseText != '') {
            get('https://api.github.com/repos/' + owner + '/' + repo + '/commits?sha=gh-pages', function() {
                var json = JSON.parse(this.responseText);
                if (this.responseText != '') {
                    window.commit_list = json;
                    window.commit_index = 0;
                    window.owner = owner;
                    window.repo = repo;
			
	            generateIframe();
		    ANIMATE()
                }
            })
        }
    });
}

var onLeftArrow = function() {
  var current_commit_index = window.commit_index;
  window.commit_index = current_commit_index + 1;
  ANIMATE();
  generateIframe();
}

var onRightArrow = function() {
  var current_commit_index = window.commit_index;
  window.commit_index = current_commit_index - 1;  
  ANIMATE();
  generateIframe();
}

