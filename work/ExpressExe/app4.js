//Express 기본 모듈 불러오기---------
require("dotenv").config();
var express = require("express");
var http = require("http");
var path = require("path");
var serveStatic = require("serve-static");//특정 폴더를 패스로 접근
//-------------------------------------

//Error Handler Module 불러오기
var expressErrorHandler = require("express-error-handler");

//express 객체 생성
var app = express(); //app가 express

app.set("port", process.env.PORT);
app.use(express.urlencoded({extended:false}));
app.use("/public", serveStatic(path.join(__dirname, "public"))); //가상주소: /public

//router 객체 추가---------------------------------------------------
var router = express.Router();//맨위 존재

//무조건 실행시키는 것이 아닌 router를 추가하고 아래는 특정 조건이 올 때만 실행시키게 함
//middleware 객체(use) 생성---------------------------------------
//app.use(function (req, res, next) {

//router.route("/process/login").post(function (req, res) {//주소별로 보내기에 next 필요없음
router.post("/process/login", function (req, res) { //위와 같다. 이런형식이면 get도 가능함
	
	console.log("/process/login 처리..");
	
	var paramId = req.body.id || req.query.id;
	var paramPwd = req.body.pwd || req.query.pwd;
	
	res.writeHead("200", {"Content-type":"text/html;charset=utf-8"});
	res.write("<h1>Express Server에서 응답한 결과입니다.</h1>");
	res.write("<div><p>ID:" + paramId + "</p></div>");
	res.write("<div><p>PWD:" + paramPwd + "</p></div>");
	
	res.write("<br/><br/><a href='/public/login2.html'>로그인 페이지</a>");
	res.end();

});

//라우터 객체를 app 객체에 추가해야지 app에서 사용가능----------------------------

app.use("/", router);//맨 밑 존재 해야지 라우터 사용가능(여러개 추가 가능)

//--------------------------------------------------------------------------------
var errorHandler = expressErrorHandler({
	
	static:{
		"404":"./public/404.html"
	}
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


http.createServer(app).listen(app.get("port"), function(){

	console.log("Express Server를 시작했습니다: " + app.get("port"));//3000이 찍힌것은 env에서 가져온것
});
