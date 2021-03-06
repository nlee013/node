//Express 기본 모듈 불러오기

var express = require("express");
var http = require("http");

//express 객체 생성
var app = express(); //app가 express

app.set("port", process.env.PORT||3000);


//middleware 객체(use) 생성
app.use(function (req, res, next) {//next는 사용자 정의. 다음으로 넘어간다고 해서 next로 써준 것
	
	console.log("First middleware 실행..");
	
	//res.send({name:'배수지', age:27});//send는 json형식의 data 그대로 보낸다.
	
	//res.status(403).send('접근 금지!!');//web에서 접근금지는 403이다
	//res.sendStatus(403);//Forbidden
	//res.redirect("http://m.naver.com");
	
	//GET 방식으로 data를 보낼 때(주소 길게 보낼 때)
	//req.query.name
	
	//POST 방식으로 data를 보낼 때(입력 값을 보낼 때)
	//req.body.name
	
	//GET/POST 방식 : req.param('name') 어떤 방식으로 보내는 것이 가능함. 'name'/"name" 상관없음
	
	//받아 내는 방식이 웹 브라우저 마다 조금 다를 수 있음
	
	var userAgent = req.header("User-Agent");//browser info
	var paramName = req.query.name;//get localhost:3000/?name=suzi
	//var paramName = req.param('name');//get, post
	//var paramName = req.body.name//post(받을 수 없다. 오류남)
	
	res.writeHead("200", {"Content-type":"text/html;charset=utf-8"});
	res.write("<h1>Express Server에서 " + req.query.name + "가 응답한 결과입니다.</h1>");
	res.write("<div><p>User-Agent:" + userAgent + "</p></div>");
	res.write("<div><p>param Name:" + paramName + "</p></div>");
	res.end();
	
	//네스케이프, 모질라(처음나온 브라우저 이름)
});

http.createServer(app).listen(app.get("port"), function(){

	console.log("Express Server를 시작했습니다: " + app.get("port"));
});
