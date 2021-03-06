
//Express 기본 모듈
require("dotenv").config();
var express = require("express");
var http = require("http");
var path = require("path");
var serveStatic = require("serve-static");
var expressErrorHandler = require("express-error-handler");
var expressSession = require("express-session");

//-database.js에 맨 위에 import 했기에 여기서 필요없다
//var mongoose = require("mongoose");
var user = require("./router/user"); 
var config = require("./config");

//추가
var routerLoader = require("./router/routerLoader");

//추가
var database = require("./database/database");

//익스프레스 객체 생성
var app = express();

//뷰엔진 설정-----------------------------------------------------------추가(22/04/07)
app.set("views", __dirname + "/views");
/*app.set("view engine", "ejs");
console.log("뷰엔진이 ejs로 설정 되었습니다.");*/

app.set("view engine", "jade");//---추가(22/04/08)
console.log("뷰엔진이 jade로 설정 되었습니다.");

app.set("port",process.env.PORT||config.serverPort);

app.use(express.urlencoded({extended:false}));

app.use("/public1",serveStatic(path.join(__dirname,"public1")));//왼쪽은 가상, 오른쪽은 실제주소

app.use(expressSession({
	
	secret:"my key",
	resave:true,
	saveUninitialized:true
	
}));


//--------------------------------------------------------
//라우터 객체 생성
var router = express.Router();

routerLoader.init(app, router);//오류나는 경우는 아래처럼 사용

//routerLoader.init(app,  express.Router());--위에 var router = express.Router();  주석처리 후 사용(직접 넣어주기)


//-------------------------------------------------------추가

var errorHandler = expressErrorHandler({
	
	static: {
		"404":"./public1/404.html"
	}
	
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


//Express 서버 시작
//var host = localhost;--ip로 접근
http.createServer(app).listen(app.get("port"),function(){
	
	console.log("익스프레스 서버를 시작했습니다: " + app.get("port"));
	
	//DB연결 함수 호출
	database.init(app, config);//app, confg-매개변수, init-변수
	
});












