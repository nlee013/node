//폴더 생성, 삭제

//node안에 있어서 호출하면 된다
var fs = require("fs");
/*
fs.rmdir("./doc", function(err) {
	
	if(err) throw err;
	console.log("doc폴더 삭제..");
});

*/

fs.mkdir("./doc", function(err) {
	
	if(err) throw err;
	console.log("doc폴더 생성..");
	
});

