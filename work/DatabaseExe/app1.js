//Express 기본 모듈 불러오기---------
require("dotenv").config();
var express = require("express");
var http = require("http");
var path = require("path");
var serveStatic = require("serve-static");//특정 폴더를 패스로 접근
var expressErrorHandler = require("express-error-handler");
var expressSession = require("express-session");

//mongoDB module(설치 후 불러오기)
var MongoClient = require("mongodb").MongoClient;

//database 객체를 위한 변수
var database;

//database 연결
function connectDB() {
	//database 연결 정보
	var databaseUrl = "mongodb://localhost:27017/shopping";//mongo db port : 27017
	
	//connection
	MongoClient.connect(databaseUrl, function(err, dbase) {
		
		if(err) throw err;
		
		console.log("database에 연결되었습니다: " + databaseUrl);
		
		database = dbase.db("shopping"); //자바 디비에서의 conn과 같음
		
	});
}

//express 객체 생성
var app = express(); //app가 express

app.set("port", process.env.PORT||3000);

app.use(express.urlencoded({extended:false}));

app.use("/public", serveStatic(path.join(__dirname, "public"))); //가상주소: /public

app.use(expressSession({

	secret:"my key",
	resave:true,
	saveUninitialized:true
	
}));

//router 객체 추가---------------------------------------------------

//--------------------------------------------------------------------------------
var errorHandler = expressErrorHandler({
	
	static:{
		"404":"./public/404.html"
	}
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//express 서버 시작
http.createServer(app).listen(app.get("port"), function(){

	console.log("Express Server를 시작했습니다: " + app.get("port"));//3000이 찍힌것은 env에서 가져온것

	//DB 연결 함수 호출(DB 연결실행)
	connectDB();
	
});
