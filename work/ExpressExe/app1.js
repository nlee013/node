//Express 기본 모듈 불러오기

var express = require("express");
var http = require("http");

//express 객체 생성
var app = express();

//기본 포트를 app객체의 속성으로 설정
//express server 객체의 method는 set, get, use 가 있다
app.set("port", process.env.PORT||3000);

//env의 파일이 있는데 그 안에 port가 있으면 3000?

//express에서라서 direct로 가능함
//express server시작
//var server = http.createServer();

//http.createServer(app) 자체가 server가 된다 (test1.js line 11 참조)
//express server를 사용하려고 app를 안에 넣어준 것!
http.createServer(app).listen(app.get("port"), function(){

	console.log("express server를 시작했습니다: " + app.get("port"));
});
