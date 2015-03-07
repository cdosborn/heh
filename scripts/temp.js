HI = function(){



$(".btn").click(function(){
		//console.log(getrepo)
		testResults(getrepo);

})


}
function testResults (form) {
    var TestVar = form.owner.value;
    var test = form.repo.value;

    //alert ("You typed: " + TestVar + " and " + test);
}