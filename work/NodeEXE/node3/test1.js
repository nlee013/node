//http module로 웹서버 만들기

var http = require("http"); //웹 환경을 만들때 반드시 필요

//웹 서버 객체 생성
var server = http.createServer();

var host = "localhost";
var port = 3000;

server.listen(port, host, 5000, function() {

	console.log("web server 시작:" + port);
});

//client 연결 event 처리
server.on("connection", function(socket) {//뭔가 연결이 되면 실행해라 socket//사용자 정의
	
	console.log("web server 접속:" + socket.remoteAddress + ":" + socket.remotePort);
});

//client 요청 event 처리
server.on("request", function(req, res) {
	
	console.log("client의 요청 들어옴");
	
	//servlet 날코딩 - 이런식으로 사용하기 어렵기 때문에 template 사용(query)
	res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
	res.write("<!DOCTYPE html>");
	res.write("<html>");
	res.write("<head>");
	res.write("<title>응답 페이지</title>");
	res.write("</head>");
	res.write("<body>");
	res.write("<h1>서버에서 응답 받기 - request </h1> ");
	res.write("</body>");
	res.write("</html>");
	
	res.end();//반드시 있어야 실행된다.
});

//server 종료 event 처리
server.on("close", function() {
	
	console.log("서버가 종료됩니다.");
});