//Express 기본 모듈
require("dotenv").config();
var express = require("express");
var http = require("http");
var path = require("path");
var serveStatic = require("serve-static");
var expressErrorHandler = require("express-error-handler");
var expressSession = require("express-session");

//mongoose 모듈
var mongoose = require("mongoose");

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
		
		//스키마 정의--스키마 안에 method를 넣을 수 있음
		UserSchema = mongoose.Schema({//-좀 더 디테일하게 설정
			
			id:{type:String,required:true,unique:true}, //자료형, 반드시필요함, 유일값
			name:{type:String},
			pwd:{type:String,required:true},
			age:{type:Number, 'default':20}, //자료형, 입력값 잊어버리면 dafault값 20 넣기
			created:{type:Date, index:{unique:false},'default':Date.now}//unique-중복값 허용여부
		});
		
		//insert method into schema 객체(방법 :static(), method())
		
		//login에서 사용
		UserSchema.static("findById", function(id, callback) {//method name, callback
			
			return this.find({id:id}, callback);
			
		});
		
		//전체 data 가져오기(사용)
		UserSchema.static("findAll", function(callback) {
			
			return this.find({}, callback);
			
		});
		
		console.log("UserSchema 정의함.");
		
		//Model 정의
		UserModel = mongoose.model("users2",UserSchema);
		
		//3개들어있는 값에다가 5개 데이터를 넣고 싶은데 넣을수 있다
		//users2로 table생성
		
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
	UserModel.findById({"id":id }, function(err,result){
		
		if(err){
			callback(err,null);
			return;
		}
		
		//데이터가 있을경우
		if(result.length>0){
			
			console.log("아이디와 일치하는 사용자 찾음");
			
			if(result[0]._doc.pwd==pwd){
				
				console.log("비밀번호 일치함");
				callback(null, result);
				
			}else{
				
				console.log("비밀번호 일치하지 않음");
				callback(null,null);		
			}
			
		}else{
			
			console.log("아이디와 일치하는 데이터가 없습니다.");
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

//User List Router 사용자 리스트 라우터
router.route("/process/listUser").post(function(req, res) {
	
	console.log("/process/listUser 호출..");
	
	if(database){
		
		UserModel.findAll(function(err, result) {
			
			if(err){
				
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h2>사용자 리스트 조회중 오류 발생</h2>")					
				res.end();
				
				return;//오류나면 중지되게 꼭 쓰기(실행되면 안되니까)
			}
			
			if(result){
				
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h2>사용자 리스트</h2>");
				res.write("<div><ul>");
				
				for(var i = 0; i < result.length; i++){
				
					var id = result[i]._doc.id;//column을 가져오려면 ._doc형식으로 사용
					var name = result[i]._doc.name;
					var age = result[i]._doc.age;
					var created = result[i]._doc.created;
					
					res.write("<li>#" + (i + 1) + ":"
							    + id + "," + name + "," + age +  "," + created +"</li>");
				}
				
				res.write("</ul></div>");
				res.write("<br/><br/><a href='/public/listUser.html'>리스트</a>");
				res.end();
				
			}else{
				
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h2>사용자 리스트 조회 실패</h2>");
				res.end();
				
			}
		});
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













