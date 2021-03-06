
/*
* 위치기반 서비스 서버 만들기(LBS : Location Based Service)

특정 위치의 정보를 제공하고 조회하는 방법을 데이터베이스에서 
대부분 제공. 몽고디비도 기능을 제공

1. 스타벅스의 위치정보 확인(이름,전화번호,위치 경도)
2. 스타벅스의 위치정보 저장
3. 스타벅스을 위치로 조회

* 위치정보는 사람의 이름과 같은 문자열을 저장하는 것과 다르게 
  경도와 위도를 사용
* 위치정보를 저장하거나 조회할때는 공간 인덱싱(Spatial Indexing)이란 방법으로
  경도와 위도의 좌표를 인덱스로 만들어 조회속도를 높임
* 몽고디비에서는 GeoSpatial Indexing 이라 함

* 조회방법
	1. 사용자 위치에서 가장 가까운 스타벅스(near)
	2. 사용자가 보고있는 지도 범위 안의 스타벅스(within)
	3. 사용자가 있는 곳에서 일정 반경 안에 있는 스타벅스(circle)

* 위치 데이터 종류
	1. Point : 현재위치나 스타벅스의 위치같은 특정한 지점
	2. LineString : 도로와 같이 이어진 위치
	3. Polygon : 청담동, 역삼동 같은 지역

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

//Passport 설정!
var configPassport = require("./passport/passport");
configPassport(app, passport);

//Passport Router 설정!
var userPassport = require("./router/userPassport");
userPassport(router, passport);

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












