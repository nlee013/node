
//Express 기본 모듈
require("dotenv").config();
var express = require("express");
var http = require("http");
var path = require("path");
var serveStatic = require("serve-static");
var expressErrorHandler = require("express-error-handler");
var expressSession = require("express-session");
var mongoose = require("mongoose");

var user = require("./router/user"); 

var database;
var UserSchema;
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
		
		//스키마,모델 객체
		createUserSchema();
		
	});
	
	database.on("error",console.error.bind(console,"몽구스 연결 에러..."));
	
	database.on("disconnected",function(){
		
		console.log("DB연결이 끊겼습니다 5초후 재연결 합니다");
		setInterval(connectDB(),5000);
	});
	
}

function createUserSchema(){
	
	//Schema정의
	UserSchema = require("./database/userSchema").createSchema(mongoose);
	
	
	//Model 정의
	UserModel = mongoose.model("users3",UserSchema);
	
	console.log("UserModel 정의함.");
	
	user.init(database,UserSchema,UserModel);
	
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


//--------------------------------------------------------
//라우터 객체 생성
var router = express.Router();

//로그인 라우터
router.route("/process/login").post(user.login);

//사용자 추가 라우터
router.route("/process/addUser").post(user.addUser);

//사용자 리스트 라우터
router.route("/process/listUser").post(user.listUser);


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












