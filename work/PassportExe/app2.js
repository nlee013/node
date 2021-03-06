
/*
패스포트는 수백가지 인증방식(Strategy)을 제공 하는데 
어떤 인증 방식을 사용할지 Strategy를 선택
Local Strategy, Facebook Strategy, Google Strategy,
Nakao Strategy, Naver Strategy...

* 대표적 인증 방식
  로컬 인증: 데이터베이스에 저장된 사용자 정보와 비교
  OAuth2.0 인증: 네이버이나 카카오계정 사용
 
* 모듈설치
사용자 인증처리 필수 모듈
npm install passport --save

로컬인증기능(사용자 입력 정보와 DB정보 비교)	
npm install passport-local --save
npm install passport-facebook --save
npm install passport-kakao --save	

요청객체에 메세지를 넣어둘수있는 기능
다른 함수나,뷰템플릿 처리 함수에 메세지 전달
사용자에게 메세지 전달
npm install connect-flash --save

로컬인증기능
id(email)/pw
-serializeUser():사용자 로그인(인증) 성공 시 호출
-deserializeUser():사용자 로그인(인증) 이후 사용자 요청 시마다 호출


*/

require("dotenv").config();
var express = require("express");
var http = require("http");
var path = require("path");
var serveStatic = require("serve-static");
var expressErrorHandler = require("express-error-handler");
var expressSession = require("express-session");

var passport = require("passport");
var flash = require("connect-flash");

var config = require("./config");
var database = require("./database/database");
var routerLoader = require("./router/routerLoader");

//익스프레스 객체 생성
var app = express();

//뷰엔진 설정
app.set("views",__dirname + "/views");
app.set("view engine","ejs");
console.log("뷰엔진이 ejs로 설정 되었습니다");

app.set("port",process.env.PORT||config.serverPort);

app.use(express.urlencoded({extended:false}));

app.use("/public",serveStatic(path.join(__dirname,"public")));

app.use(expressSession({
	
	secret:"my key",
	resave:true,
	saveUninitialized:true
	
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//라우터 객체 생성
var router = express.Router();

routerLoader.init(app,router);

/*
클라이언트요청	웹서버		뷰템플릿

홈화면조회		/(get)				홈화면(index.ejs)
로그인화면		/login(get)		로그인화면(login.ejs)  
로그인요청		/login(post)	로그인처리(함수)       
회원가입화면	/signup(get)	회원가입화면(signup.ejs) created.jsp
회원가입요청	/signup(post)	회원가입처리(함수)       created_ok.jsp
사용자프로필	/profile(get)	프로필화면(profile.ejs)
로그아웃요청	/logout(get)	로그아웃처리(함수)
*/

//홈화면
router.route("/").get(function(req,res){
	res.render("index.ejs");
});

//로그인화면
router.route("/login").get(function(req,res){
	res.render("login.ejs",{message:req.flash("loginMessage")});
});

//로그인요청
router.route("/login").post(passport.authenticate("local-login",{
	
	successRedirect : "/profile", //성공
	failureRedirect : "/login",	//실패
	fallureFlash : true	//실패 메세지
	
}));

//회원가입 화면
router.route("/signup").get(function(req,res){
	res.render("signup.ejs",{message:req.flash("signupMessage")});
});

//회원가입
router.route("/signup").post(passport.authenticate("local-signup",{
	
	successRedirect : "/profile", //성공
	failureRedirect : "/signup",//실패
	fallureFlash : true	//실패 메세지
	
}));


//프로파일
router.route("/profile").get(function(req,res){
	
	//인증실패
	if(!req.user){
		
		console.log("사용자 인증이 안된 상태");
		
		res.redirect("/");
		return;
		
	}
	
	//인증 성공
	console.log("사용자 인증된 상태");
	
	if(Array.isArray(req.user)){
		res.render("profile.ejs",{user:req.user[0]._doc});
	}else{
		res.render("profile.ejs",{user:req.user});
	}	
	
});

//로그아웃
router.route("/logout").get(function(req,res){
	
	req.logout();
	res.redirect("/");
	
});


//*********************************************************
//Passport Strategy 설정
var LocalStrategy = require("passport-local").Strategy;

//패스포트 로그인
//use(이름,인증방식객체) - 이름은 함수 구분용도
//done() 메소드는 예약어
passport.use("local-login", new LocalStrategy({
	
	usernameField : "email",
	passwordField : "pwd",
	
	//아래 콜백함수의 첫번째 파라미터로 req 객체를 전달함
	passReqToCallback : true
	
	}, function(req,email,pwd,done){
		
		//데이터베이스 객체
		var database = app.get("database");
		
		database.UserModel.findOne({"email":email},function(err,user){
			
			if(err) {return done(err);}
			
			if(!user){ //등록자가 없을때
				
				console.log("등록된 계정이 없습니다.");
				
				//검증 콜백에서 두번째 파라미터 값을 false로 해서 
				//인증 실패한것으로 처리
				return done(null,false,req.flash("loginMessage","등록된 계정이 없습니다."));
				
			}
			
			//비밀번호를 비교해서 틀릴경우
			var authenticated = 
				user.authenticate(pwd, user._doc.salt, user._doc.hashed_password);
			
			if(!authenticated){
				
				console.log("비밀번호가 일치하지 않음.");
				
				return done(null,false,req.flash("loginMessage","비밀번호가 일치하지 않음."));				
				
			}
						
			//비밀번호가 맞을경우			
			console.log("비밀번호가 일치함.");
			
			return done(null,user);			
			
		});
		
	}));


//패스포트 회원가입
passport.use("local-signup", new LocalStrategy({

	usernameField : "email",
	passwordField : "pwd",
	
	//아래 콜백함수의 첫번째 파라미터로 req 객체를 전달함
	passReqToCallback : true
	
	},function(req,email,pwd,done){
		
		var name = req.body.name;
		
		process.nextTick(function(){
			
			var database = app.get("database");
			
			database.UserModel.findOne({"email":email},function(err,user){
				
				if(err) {return done(err);}
				
				//이미 회원가입이 되어 있는경우
				if(user){
					
					console.log("회원가입이 되어 있습니다.");
					
					return done(null,false,req.flash("signupMessage","회원가입이 되어 있습니다."));	
					
				}else{
					
					var user = new database.UserModel({"email":email,"pwd":pwd,"name":name});
					
					user.save(function(err){
					
						if(err) {throw err;}
						
						console.log("사용자 데이터 추가 함.");
						
						return done(null,user);
						
					});//end..if
				}//findOne
			});//nextTick
		});//function
	}
));


//사용자 인증 성공시 호출
//사용자 정보를 이용해서 세션을 만듬
passport.serializeUser(function(user,done){
	
	console.log("serializeUser 호출됨.");
	
	//이 인증 콜백함수에서 넘겨주는 user 객체의 정보로
	//session를 생성
	done(null,user);
	
});

//사용자 인증후 사용자 요청시마다 호출
//user : 사용자 인증 성공시 serializeUser 함수를 이용해서
//만든 세션정보가 파라미터로 넘어옴
passport.deserializeUser(function(user,done){
	
	console.log("deserializeUser 호출됨.");
	
	done(null,user);
	
});


var errorHandler = expressErrorHandler({
	
	static: {
		"404":"./public/404.html"
	}
	
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


//Express 서버 시작

var host = "localhost";

http.createServer(app).listen(app.get("port"),host,function(){
	
	console.log("익스프레스 서버를 시작했습니다: " + app.get("port"));
	
	//DB연결 함수 호출
	database.init(app,config);
	
});












