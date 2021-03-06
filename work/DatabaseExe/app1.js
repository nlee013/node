
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
//사용자를 인증하는 함수 만들기. 라우터-미들웨어------------------------------------
var authUser = function(database, id, pwd, callback) {//database = conn과 같음
	
	//users collection참조
	var users = database.collection("users");
	
	//search id & pwd
	users.insertMany({"id": id, "pwd": pwd}).toArray(function(err, result) {//배열로 받기
		
		if(err){//오류가 나면
			
			callback(err, null);//callback함수에 err를 넣어라.data가 없으니까 null
			return;//중지
		}
		//data가 있을 경우
		if(result.length > 0){
			
			callback(null, result)//error가 나면 null
			
		}else{
			console.log("일치하는 데이터가 없습니다.");
			callback(null, null);
		}
	});
}

//사용자를 추가하는 함수
var addUser = function(database, id, pwd, name, callback) {
	
	console.log("addUser 함수 호출..");
	
	var users = database.collection("users");
	
	//insert.json형태
	users.insert([{"id": id, "pwd" : pwd, "name":name}], function(err, result) {
		
		if(err){
			
			callback(err, null);
			return;
		}
		
		if(result.insertedCount > 0){
			
			console.log("사용자 추가..");
			
		}else{
			
			console.log("사용자 추가 실패")
			
		}
		callback(null,result);
	});
};

//router 객체 생성 ---------------------------------------------------
var router = express.Router();

//login router
router.route("/process/login").post(function(req, res){
	
	console.log("/process/login 호출..");
	
	var id = req.body.id;
	var pwd = req.body.pwd;
	
	if(database){
		
		authUser(database, id, pwd, function(err, result) {//만들어준 함수가 callback
			
			if(err){throw err;}
			
			if(result){//결과가 돌아오면
				
				var userName = result[0].name; //별도로 받아낸 이름값
				
				res.writeHead("200", {"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>로그인 성공!</h1>");
				res.write("<div>아이디: " + id + "</div>");
				res.write("<div>이름: " + userName + "</div>");
				res.write("<br/><br/><a href='/public/login.html>다시 로그인</a>");
				res.end();
				
			}else{
				
				res.writeHead("200", {"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>로그인 실패!</h1>");
				res.write("<div>아이디 또는 비밀번호를 확인하세요</div>");
				res.write("<br/><br/><a href='/public/login.html'>다시 로그인</a>");
				res.end();
			}
			
		});
		
	}else{//db연결 실패시
		
		res.writeHead("200", {"Content-type":"text/html;charset=utf-8"});
		res.write("<h1>DATABSE 연결 실패!</h1>");
		res.write("<div>DATABASE를 연결하지 못했습니다.</div>");
		res.end();
	}
	
});

//add user router
router.route("/process/addUser").post(function(req, res) {
	
	console.log("/process/addUser 호출..");
	
	var id = req.body.id;
	var pwd = req.body.pwd;
	var name = req.body.name;
	
	if(database){
		
		addUser(database, id, pwd, name, function(err, result) {//function(err, result)사용자 정의
			
			if(err) {throw err;}
			
			if(result && result.insertedCount > 0){
				
				res.writeHead("200", {"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>사용자 추가 성공!</h1>");
				res.end();
				
			}else{
				
				res.writeHead("200", {"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>사용자 추가 실패!</h1>");
				res.end();
			}
		});
		
	}else{
		
		res.writeHead("200", {"Content-type":"text/html;charset=utf-8"});
		res.write("<h1>DATABSE 연결 실패!</h1>");
		res.write("<div>DATABASE를 연결하지 못했습니다.</div>");
		res.end();
	}
});

//router 객체 등록 ---------------------------------------------------
app.use("/", router);


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
