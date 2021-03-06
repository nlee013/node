//Express 기본 모듈 불러오기

/*Express는 몇가지 종류가 있다
http://localhost:3000

middleware : 하나의 독립된 함수 (use method로 설정)
- router : (요청 pattern : /, /users, /sales, /bbs와 같은 설정) -뒤에 나타내주는 주소가 라우터

client가 요청 -> middleware #0이 받는다면 -> router(/)-> client의 응답
client가 요청 -> middleware #1이 받는다면 -> router(/users)-> client의 응답
client가 요청 -> middleware #2이 받는다면 -> router(/sales)-> client의 응답

*/
var express = require("express");
var http = require("http");

//express 객체 생성
var app = express(); //app가 express

//기본 포트를 app객체의 속성으로 설정
//express server 객체의 method는 set, get, use 가 있다
app.set("port", process.env.PORT||3000);

//env의 파일이 있는데 그 안에 port가 있으면 port를 사용하고 없으면 3000 사용

//middleware 객체(use) 생성
app.use(function (req, res, next) {//next는 사용자 정의. 다음으로 넘어간다고 해서 next로 써준 것
	
	console.log("First middleware 실행..");
	
	req.user = "suzi";//req 라는 객체에 user라는 객체에 suzi를 넣은 것
	next(); //위 객체를 next로 넘김
	
	//res.writeHead("200", {"Content-type":"text/html;charset=utf-8"});
	//res.end("<h1>Express Server에서 응답한 결과입니다.</h1>");
});

//안뜸. 아직 실행이 되지 않는 이유는
app.use("/", function(req, res, next) {
	
	console.log("Second middleware 실행..");
	
	res.writeHead("200", {"Content-type":"text/html;charset=utf-8"});
	res.end("<h1>Express Server에서 " + req.user + "가 응답한 결과입니다.</h1>");
})

//express에서라서 direct로 가능함
//express server시작
//var server = http.createServer();

//http.createServer(app) 자체가 server가 된다 (test1.js line 11 참조)
//express server를 사용하려고 app를 안에 넣어준 것!
http.createServer(app).listen(app.get("port"), function(){

	console.log("Express Server를 시작했습니다: " + app.get("port"));
});
