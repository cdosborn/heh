var parseForms = function(){
    $("#get").click(function(){
        var owner = getrepo.owner.value;
        var repo = getrepo.repo.value;
        onSubmit(owner, repo);
    })
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
                }
            })
        }
    });
    console.log("Current_commit: ");
    console.log(commit_list);
}

var onLeftArrow = function() {
  var current_commit_index = window.commit_index;
  console.log("Current_commit: ");
  console.log(window.commit_list);

  
}

var onRightArrow = function() {
  var current_commit_index = window.commit_index;
  if(current_commit_index == 0){
    //Do nothing
  }

    
}

