//session 사용
//npm install express-session -save

//Express 기본 모듈---------
require("dotenv").config();
var express = require("express");
var http = require("http");
var path = require("path");
var serveStatic = require("serve-static");//특정 폴더를 패스로 접근
var expressErrorHandler = require("express-error-handler");
var cookieParser = require("cookie-parser");

//session 추가
var expressSession = require("express-session");

//express 객체 생성-------------------------------------------------
var app = express(); //app가 express

app.set("port", process.env.PORT);
app.use(express.urlencoded({extended:false}));
app.use("/public", serveStatic(path.join(__dirname, "public"))); //가상주소: /public

app.use(cookieParser());

/*
secret – 쿠키를 임의로 변조하는것을 방지하기 위한 sign 값 입니다. 원하는 값을 넣으면 됩니다.
resave – 세션을 언제나 저장할 지 (변경되지 않아도) 정하는 값입니다. 
express-session documentation에서는 이 값을 false 로 하는것을 권장하고 필요에 따라 true로 설정합니다.
saveUninitialized – uninitialized 세션은 새로 생겼지만 변경되지 않은 세션을 의미합니다. 
Documentation에서 이 값을 true로 설정하는것을 권장합니다.
*/
app.use(expressSession({

	secret:"my key",
	resave:true,
	saveUninitialized:true
	
}));

//router 객체 추가---------------------------------------------------

var router = express.Router();//맨위 존재

//무조건 실행시키는 것이 아닌 router를 추가하고 아래는 특정 조건이 올 때만 실행시키게 함
//middleware 객체(use) 생성---------------------------------------
//app.use(function (req, res, next) {

router.route("/process/login").post(function (req, res) {//주소별로 보내기에 next 필요없음
//router.post("/process/login", function (req, res) { //위와 같다. 이런형식이면 get도 가능함
	
	console.log("/process/login 호출..");
	
	var id = req.body.id;
	var pwd = req.body.pwd;
	
	if(req.session.user){
		
		console.log("이미 로그인 되어서 상품 페이지로 이동..");
		res.redirect("/public/product.html");
		
	}else{//여기엔 user가 없음
		
		if(id == "suzi" && pwd == "a123"){
			
			//session 저장(만들기)
			req.session.user={
					
					id:id,
					name:"배수지",
					authorize:true
			};
			
			res.writeHead("200", {"Content-type":"text/html;charset=utf-8"});
			res.write("<h1>로그인 성공</h1>");
			res.write("<div><p>ID:" + id + "</p></div>");
			res.write("<div><p>PWD:" + pwd + "</p></div>");
			res.write("<div><p>NAME:" + req.session.user.name + "</p></div>");
			
			res.write("<br/><br/><a href='/process/product'>상품 페이지</a>");
			res.end();
			
		}else{
			
			console.log("아이디나 패스워드가 틀립니다")
			res.redirect("/public/login3.html");
			
		}
		
	}

});

router.route("/process/product").get(function (req, res) {
	
	console.log("/process/product 호출..");
	
	if(req.session.user){
		
		console.log("login 되어있음")
		res.redirect("/public/product.html");
		
	}else{
		console.log("login 먼저하세요")
		res.redirect("/public/login3.html");
	}
	
});

router.route("/process/logout").get(function (req, res) {
	
	console.log("/process/logout 호출..");
	
	if(req.session.user){
		
		console.log("로그아웃 합니다.");
		
		//session 삭제
		//req.session.destroy();//단순 삭제
		
		req.session.destroy(function(err) {
			
			if(err){throw err};
			
			console.log("session 삭제하고 로그인 되었습니다.");
			
			res.redirect("/public/login3.html");
		});
		
	}else{
		
		console.log("session을 삭제하고 로그인 되었습니다.");
		res.redirect("/public/login3.html");
	}
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
	var server = http.createServer();
	var host = "localhost";
	var port = 3000;
	server.listen(port,host,5000,function(){ // 5000명 동시접속
		
		
});
