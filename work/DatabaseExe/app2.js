/*
mongoose 모듈
데이터베이스를 테이블이나 엑셀처럼 쉽게 다룰수있게하는 모듈

Schema :
String,Number,Boolean,Array,Buffer,Date,ObjectId,Mixed
어떤 문서(컬럼)에는 name이 있고 다른 문서에는 name이 없을수도 있기때문에
일정한 조건으로 적용하기가 어렵다
관계형 데이터베이스처럼 조회 조건을 공통적으로 적용할수있게
정해진 규칙으로 문서를 저장수있게 하는것이 Schema이다
 
npm install mongoose --save

*/

//Express 기본 모듈
require("dotenv").config();
var express = require("express");
var http = require("http");
var path = require("path");
var serveStatic = require("serve-static");
var expressErrorHandler = require("express-error-handler");
var expressSession = require("express-session");

//몽고디비 모듈
//var MongoClient = require("mongodb").MongoClient;

//mongoose 모듈
var mongoose = require("mongoose");


//데이터베이스 객체를 위한 변수
var database;

//데이터베이스 스키마를 위한 변수
var UserSchema;

//데이터베이스 모델을 위한 변수
var UserModel;


//데이터베이스 연결
function connectDB(){	
	
	//데이터베이스 연결 정보
	var databaseUrl = "mongodb://localhost:27017/shopping";
	
	//연결
	mongoose.connect(databaseUrl);
	
	database = mongoose.connection;
	
	database.on("open",function(){
		
		console.log("데이터베이스가 연결되었습니다: " + databaseUrl);
		
		//스키마 정의
		UserSchema = mongoose.Schema({
			id:String,
			name:String,
			pwd:String
		});
		
		console.log("UserSchema 정의함.");
		
		//Model 정의
		UserModel = mongoose.model("users",UserSchema);
		
		console.log("UserModel 정의함.");
		
	});
	
	database.on("error",console.error.bind(console,"몽구스 연결 에러..."));
	
	database.on("disconnected",function(){
		
		console.log("DB연결이 끊겼습니다 5초후 재연결 합니다");
		setInterval(connectDB(),5000);
	});
	
}

//익스프레스 객체 생성
var app = express();

app.set("port",process.env.PORT||3000);

app.use(express.urlencoded({extended:false}));

app.use("/public",serveStatic(path.join(__dirname,"public")));

app.use(expressSession({
	
	secret:"my key",
	resave:true,
	saveUninitialized:true
	
}));

//사용자를 인증하는 함수
var authUser = function(database,id,pwd,callback){
	
	console.log("authUser 함수 호출..");
			
	//아이디와 비밀번호 검색
	UserModel.find({"id":id,"pwd":pwd}, function(err,result){
		
		if(err){
			callback(err,null);
			return;
		}
		
		//데이터가 있을경우
		if(result.length>0){
			
			callback(null,result);		
			
		}else{
			
			console.log("일치하는 데이터가 없습니다.");
			callback(null,null);
			
		}
		
	});
	
}

//사용자를 추가하는 함수
var addUser = function(database,id,pwd,name,callback){
	
	console.log("addUser 함수 호출..");
	
	var users = new UserModel({"id":id, "pwd":pwd, "name":name});
	
	users.save(function(err,result){
		
		if(err){
			callback(err,null);
			return;
		}
		
		if(result){
			
			console.log("사용자 추가..");
			
		}else{
			
			console.log("사용자 추가 실패..");
			
		}
		
		callback(null,result);		
		
	});
	
};



//--------------------------------------------------------
//라우터 객체 생성
var router = express.Router();

//로그인 라우터
router.route("/process/login").post(function(req,res){
	
	console.log("/process/login 호출..");
	
	var id = req.body.id;
	var pwd = req.body.pwd;
	
	if(database){
		
		authUser(database, id, pwd, function(err,result){
			
			if(err) {throw err;}
			
			if(result){
				
				var userName = result[0].name;
				
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>로그인 성공</h1>")
				res.write("<div>아이디: " + id + "</div>");
				res.write("<div>이름: " + userName + "</div>");
				res.write("<br/><br/><a href='/public/login.html'>다시 로그인</a>");
				res.end();				
				
			}else{
				
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>로그인 실패</h1>")				
				res.write("<div>아이디 또는 패스워드를 확인하세요</div>");
				res.write("<br/><br/><a href='/public/login.html'>다시 로그인</a>");
				res.end();
				
			}
			
		});
		
	}else{
		
		res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
		res.write("<h1>데이터베이스 연결 실패</h1>")				
		res.write("<div>데이터베이스를 연결하지 못했습니다.</div>");		
		res.end();	
		
	}
	
});

//사용자 추가 라우터
router.route("/process/addUser").post(function(req,res){
	
	console.log("/process/addUser 호출..");
	
	var id = req.body.id;
	var pwd = req.body.pwd;
	var name = req.body.name;
	
	if(database){
		
		addUser(database, id, pwd, name, function(err,result){
			
			if(err) {throw err;}
			
			if(result){
				
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>사용자 추가 성공</h1>")	
				res.end();			
				
			}else{
				
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>사용자 추가 실패</h1>")	
				res.end();	
				
			}
		});
		
	}else{
		
		res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
		res.write("<h1>데이터베이스 연결 실패</h1>")				
		res.write("<div>데이터베이스를 연결하지 못했습니다.</div>");		
		res.end();
		
	}
	
});



//라우터 객체 등록
app.use("/",router);

var errorHandler = expressErrorHandler({
	
	static: {
		"404":"./public/404.html"
	}
	
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


//Express 서버 시작
http.createServer(app).listen(app.get("port"),function(){
	
	console.log("익스프레스 서버를 시작했습니다: " + app.get("port"));
	
	//DB연결 함수 호출
	connectDB();
	
});












