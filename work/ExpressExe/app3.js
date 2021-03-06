//Express 기본 모듈 불러오기
require("dotenv").config();
var express = require("express");
var http = require("http");
var path = require("path");

//var은 get방식은 기본 default값으로 지원하지만 post 방식을 지원안해서 지원하게 만들 예정이었지만
//이제 지금은 기본 default값으로 내장되어 있어서 아래 코드 안씀
//var bodyParser = require("body-parser");

var serveStatic = require("serve-static");//특정 폴더를 패스로 접근

//express 객체 생성
var app = express(); //app가 express

app.set("port", process.env.PORT);

//중첩된 객체 표현 허용할지 여부(선택)
//enctype="application/x-www-form-urlencoded" 로 파싱
//app.use(bodyParser.urlencoded({extended:false})); //예전방식.지금은 안씀
app.use(express.urlencoded({extended:false}));

app.use(serveStatic(path.join(__dirname, "public")));


//middleware 객체(use) 생성
app.use(function (req, res, next) {//next는 사용자 정의. 다음으로 넘어간다고 해서 next로 써준 것
	
	console.log("POST middleware 실행..");
	
	var paramId = req.body.id;
	var paramPwd = req.body.pwd;
	
	res.writeHead("200", {"Content-type":"text/html;charset=utf-8"});
	res.write("<h1>Express Server에서 응답한 결과입니다.</h1>");
	res.write("<div><p>ID:" + paramId + "</p></div>");
	res.write("<div><p>PWD:" + paramPwd + "</p></div>");
	res.end();
	
	//네스케이프, 모질라(처음나온 브라우저 이름)
});

http.createServer(app).listen(app.get("port"), function(){

	console.log("Express Server를 시작했습니다: " + app.get("port"));//3000이 찍힌것은 env에서 가져온것
});
