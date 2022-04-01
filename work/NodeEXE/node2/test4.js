//FS 사용하기(동기방식)
var fs = require("fs");

//1. 파일을 동기 방식으로 읽어옴-맨 아래 가 있음
/*var data = fs.readFileSync("../data.json", "UTF-8");

console.log(data);

console.log("동기방식으로 읽음..");//맨 아래
*/
//2.파일을 비동기식으로 읽어옴 - 동시에 이루어짐
fs.readFile("../data.json", "utf-8", function(err, data) {
	
	console.log(data);
});


console.log("비동기방식으로 읽음..");//맨 위