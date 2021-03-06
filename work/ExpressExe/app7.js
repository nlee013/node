//session 사용
//npm install multer -save

//Express 기본모듈
require("dotenv").config();
var express = require("express");
var http = require("http");
var path = require("path");
var serveStatic = require("serve-static");
var expressErrorHandler = require("express-error-handler");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");

//파일업로드 모듈
var multer = require("multer");

//익스프레스 객체생성
var app = express(); //app가 express

app.set("port", process.env.PORT);

app.use(express.urlencoded({extended:false}));

app.use("/public",serveStatic(path.join(__dirname, "public")));
app.use("/upload",serveStatic(path.join(__dirname, "uploads")));

app.use(cookieParser());

//storage의 저장기준 설정
var storage = multer.diskStorage({
	
	destination:function(req,file,callback){
		callback(null,"uploads");
	},
	filename:function(req,file,callback){
		
		var extension = path.extname(file.originalname);//파일 이름
		var basename = path.basename(file.originalname,extension);//확장자
		
		//callback(null,basename + extension);//abc.txt
		//callback(null,file.originalname + extension);//abc.txt
		//callback(null, basename + Date.now() + extension);//파일명1649052640857.jpg
		callback(null,Date.now().toString() + path.extname(file.originalname)); //1649052841312.jpg
		
		
	}
	
});

//위에서 만든 storage를 기준을
var upload = multer({
	storage:storage,
	limits:{
		files:10,
		fileSize:1024*1024*1024
	}
	
});


//라우터 객체 추가
var router = express.Router();

//라우팅 함수 등록
router.route("/process/file").post(upload.array("upload",2),function (req, res) {
	console.log("/process/file 호출..");
	try {
		
		var files = req.files;//파일정보를 배열로 받음
		
		console.log(req.files[0]);
		console.log("------------------")
		console.log(req.files[1]);
		
		//파일 정보를 저장할 변수
		var originalName = "";
		var fileName = "";
		var mimeType = "";
		var size = 0;
		

		res.writeHead("200", {"Content-type":"text/html;charset=utf-8"});
		res.write("<h1>파일 업로드  성공</h1>");
		
		if(Array.isArray(files)){
			
			console.log("파일 갯수 : " + files.length + "개");
			
			for(var i = 0; i < files.length; i++){
				
				originalName = files[i].originalname;
				fileName = files[i].filename;
				mimeType = files[i].mimetype;
				size = files[i].size;
				
				res.write("<hr/>");
				res.write("<div>원본파일명: " + originalName + "</div>");
				res.write("<div>저장파일명: " + fileName + "</div>");
				res.write("<div>MimeType: " + mimeType + "</div>");
				res.write("<div>파일크기: " + size + "</div>");
			}
			
		}
		
	
		res.end();
		
		
	} catch (e) {
		console.dir(err.stack);
	}
});


//라우터 객체를 app객체에 추가
app.use("/",router);

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

