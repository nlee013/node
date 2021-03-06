//http module로 웹서버 만들기

var http = require("http"); //웹 환경을 만들때 반드시 필요
var fs = require("fs");

//웹 서버 객체 생성
var server = http.createServer();

var host = "localhost";
var port = 3000;

server.listen(port, host, 5000, function() {

	console.log("web server 시작:" + port);
});

//client 연결 event 처리
server.on("connection", function(socket) {//뭔가 연결이 되면 실행해라 socket//사용자 정의
	
	console.log("client 접속:" + socket.remoteAddress + ":" + socket.remotePort);
});

server.on("request", function(req, res) {//뭔가 연결이 되면 실행해라 socket//사용자 정의
	
	console.log("client의 요청이 들어옴");
	
	var fileName = "./image/angelina.png";
	
	fs.readFile(fileName,function(err,img){
		
		res.writeHead(200, {"Content-Type":"image/png"}); //image/jpeg가 원래맞음
		res.write(img);
		res.end();
	
	});
});


//server 종료 event 처리
server.on("close", function() {
	
	console.log("서버가 종료됩니다.");
});