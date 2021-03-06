/*
 * npm install socket.io --save
- Web Socket : 웹 서버로 소켓을 연결한후 데이터를 주고받을 수 
  있도록 만든 HTML5 표준으로 웹브라우져가 이 기능을 지원하지 않아도
  Web Socket을 사용할 수 있게 만든것이 Socket.io 모듈
  
  npm install cors --save
- cors모듈 : Ajax의 XMLHttpRequest 는 보안 문제를 이유로  
  웹사이트를 제공하는 서버이외의 다른서버에는 접속할 수 없는데 
  cors (Cross-Origin Resource Sharing)를 사용하면 제약이 풀림
*/

require("dotenv").config();

//var socketio=require("socket.io");//추가

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

var cors = require("cors");//추가

//익스프레스 객체 생성
var app = express();

//뷰엔진 설정
app.set("views",__dirname + "/views");
app.set("view engine","ejs");
console.log("뷰엔진이 ejs로 설정 되었습니다");

app.set("port",process.env.PORT||config.serverPort);

app.use(express.urlencoded({extended:false}));

app.use("/public",serveStatic(path.join(__dirname,"public")));

app.use(cors());//추가

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

//패스포트 설정
var configPassport = require("./passport/passport");
configPassport(app,passport);

//패스포트 라우팅 설정
var userPassport = require("./router/userPassport");
userPassport(router,passport);

var errorHandler = expressErrorHandler({
	
	static: {
		"404":"./public/404.html"
	}
	
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//error가 생기면 system을 종료하지 않고 서버가 버티게 해주는 코드
process.on("uncaughtException", function(err) {
	
	console.log("서버 프로세스를 종료하지 않고 유지한다..");
});

//Express 서버 시작
var host = "localhost";

var server = http.createServer(app).listen(app.get("port"), host,
		function(){
	
	console.log("익스프레스 서버를 시작했습니다: " + app.get("port"));
	
	//DB연결 함수 호출
	database.init(app,config);
	
});

var io = require("socket.io")(server);
console.log("socket.io 요청을 받아들일 준비가 됨");

var loginID = {};

io.sockets.on("connection", function(socket) {
	
	console.log("Connection Info: ", socket.request.connection._peername);
	//socket.remoteAddress=socket.request.connection._peername.address;//ip
	//socket.remotePort=socket.request.connection._peername.port;//port
	
	//나중에 console.log로 확인 할 때 아래 참조
	//ip: socket.request.connection._peername.address
	//port: socket.request.connection._peername.port
	
	//각각의 client마다 고유한 key값이 존재해야된다
	//mobile:휴대폰 번호
	//socket.io가 만드는 고유 정보(socket.id : QR_dkdlaksd)로 id 만든다
	
	socket.on("login",function(login){
		
		console.log("login event를 받는다..");
		
		//객체 생성 후 그 안에 변수 생성
		loginID[login.id] = socket.id;
		
		//확인용
		console.log("접속한 socket ID" + socket.id);
		
		socket.loginId = login.id;//사용자 id(suzi)
		socket.loginAlias = login.alias; //사용자 alias
		
		//응답 메세지
		sendResponse(socket, "login", "200", 
				socket.loginId + "(" + socket.loginAlias + ") 가 로그인 되었습니다."
		);
		
		console.log("접속한 클라이언트 ID 갯수: " + Object.keys(loginID).length);
		
	});
	
	socket.on("logout", function(logout) {
		
		console.log("logout event를 받는다..");
		
		//응답 메세지
		sendResponse(socket, "logout", "444",
				logout.id + "가 로그아웃 되었습니다.");
		
		//Object Key에서 socket.id 삭제
		delete loginID[logout.id];
		
		console.log("접속한 client id 갯수: " + Object.keys(loginID).length);
	});
	
	//emit에서 보낸걸 on으로 받는다
	socket.on("message",function(message){
		
		console.log("message 이벤트를 받았습니다.");
		
		if(message.receiver=='ALL'){//ALL
		
			console.log("모든 클라이언트에게 message를 전송");
			
			io.sockets.emit("message",message);		
		
		}else{
			//receiver != ALL
			if(loginID[message.receiver]){
				
				//io.sockets.connected(loginID[message.receiver]).emit("message", message); //3.0버젼
				io.to(loginID[message.receiver]).emit("message", message);//4.0버젼
				
				sendResponse(socket, "message", "200", message.receiver + "에게 메세지를 전송 했습니다.");
				
			}else{//로그인 안한 경우
				
				sendResponse(socket, "login", "404",
						"상대방의 로그인 ID를 찾을 수 없습니다.");
			}
		}
		
	});
	
});


//응답 함수
function sendResponse(socket,command,code,message){
	
	var returnMessage = {command:command,code:code,message:message};
	
	socket.emit("response",returnMessage);
	
}







