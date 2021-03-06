//암호화
//npm install crypto --save
//crypto 모듈은 pwd + salt(key)를 합쳐서 암호화


//Express 기본 모듈
require("dotenv").config();
var express = require("express");
var http = require("http");
var path = require("path");
var serveStatic = require("serve-static");
var expressErrorHandler = require("express-error-handler");
var expressSession = require("express-session");
var mongoose = require("mongoose");

//crypto(암호화) 모듈
var crypto = require("crypto");

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
	
	//스키마 정의
	UserSchema = mongoose.Schema({
		id:{type:String,required:true,unique:true},//반드시 써야하나? required:not null, unique:primary key 와 비슷한 개념
		hashed_password:{type:String,required:true},//암호화된 pwd
		salt:{type:String,required:true},
		name:{type:String},		
		age:{type:Number,'default':20},
		created:{type:Date,index:{unique:false},'default':Date.now}
	});		
	
	UserSchema
		.virtual("pwd")//가상 속성 이름
		.set(function(pwd){ //위 변수 읽어오기
			
			//this._password는 외부에서 가져온것//앞의 this값과 다르게 구분짓기 위해서
			this._password = pwd;
			//.virtual("pwd")
			this.salt = this.makeSalt();//.makeSalt() method 아래에 만듦
			this.hashed_password = this.encryptPassword(pwd);
			
		})
		.get(function(){
			
			return this._password;//위에 정의해준 hashed_password에 반환
			
		});
	
		UserSchema.method("makeSalt",function(){
			
			console.log("date : " + new Date().valueOf());//12321423423
			console.log("math : " + Math.random());//0.12321423423 실시간으로 변하는 난수값을 암호화에 사용
			
			return Math.round((new Date().valueOf() * Math.random())) + "";
			
		});
		
		//암호화 작업
		UserSchema.method("encryptPassword",function(inputPwd,inSalt){//비밀번호와 salt값 줘야 아래에서 합쳐짐
			
			if(inSalt){	//sha1에서 1이 암호화 등급. inSalt, inputPwd 사용자 입력값?			
				return crypto.createHmac("sha1",inSalt).update(inputPwd).digest("hex");
		//inSalt와 사용자가 입력한 Pwd를 합쳐 sha1방식으로 암호화 한 파일을 16진수의 hex상태로 저장되는것(컴퓨터 언어로 바꿔줌)
				
			}else{				
				
				return crypto.createHmac("sha1",this.salt).update(inputPwd).digest("hex");				
			}
			
			
		});
		
		//로그인할때 암호화된 pwd와 비교(인증)
		UserSchema.method("authenticate",function(inputPwd,inSalt,hashed_password){//입력된 암호화, salt, 암호화된 비밀번호
			
			if(inSalt){
				
				console.log("사용자 입력 pwd: " + inputPwd);
				console.log("암호화된 pwd: " + this.encryptPassword(inputPwd,inSalt));
				console.log("DB에 저장되어있는 pwd: " + hashed_password);				
				
				return this.encryptPassword(inputPwd,inSalt)==hashed_password;//true,false
				//입력값과 db값이 일치하면 true, 일치하지 않으면 false값을 반환
			}else{
				
				console.log("사용자 입력 pwd: " + inputPwd);
				console.log("암호화된 pwd: " + this.encryptPassword(inputPwd,inSalt));
				console.log("DB에 저장되어있는 pwd: " + hashed_password);				
				
				return this.encryptPassword(inputPwd) == this.hashed_password;//true,false				
				
			}		
			
		});
		
	
	//스키마 객체에 메소드를 추가( 방법: static(), method() )
	
	//로그인에서 사용
	UserSchema.static("findById", function(id,callback){
		return this.find({id:id}, callback);
	})
	
	//전체데이터 사용
	UserSchema.static("findAll", function(callback){
		return this.find({}, callback);
	})	
	console.log("UserSchema 정의함.");
	
	
	//Model 정의
	UserModel = mongoose.model("users3",UserSchema);
	
	console.log("UserModel 정의함.");
	
	
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
	UserModel.findById(id, function(err,result){
		
		if(err){
			callback(err,null);
			return;
		}
		
		//데이터가 있을경우
		if(result.length>0){
			
			console.log("아이디와 일치하는 사용자 찾음");
			
			var user = new UserModel({id:id});
						
			var authenticated = 
				user.authenticate(pwd, result[0]._doc.salt,result[0]._doc.hashed_password);
			
			if(authenticated){//true
				
				console.log("비밀번호 일치함");
				
				callback(null,result);
				
			}else{//false
				
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

//사용자 리스트 라우터
router.route("/process/listUser").post(function(req,res){
	
	console.log("/process/listUser 호출..");
	
	if(database){
		
		UserModel.findAll(function(err,result){
			
			if(err){
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h2>사용자 리스트 조회중 에러 발생</h2>");						
				res.end();
				
				return;
			}
			
			if(result){
			
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h2>사용자 리스트</h2>");	
				res.write("<div><ul>");
				
				for(var i=0;i<result.length;i++){
					
					var id = result[i]._doc.id;
					var name = result[i]._doc.name;
					var age = result[i]._doc.age;
					var created = result[i]._doc.created;
					
					res.write("<li>#" + (i+1) + " : " 
							+ id + ", " + name + ", " + age + "</li>");					
					
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












