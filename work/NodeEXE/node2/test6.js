//파일 복사
var fs = require("fs");

//read, write, append
//r, w, w + (r+w), a+ (r+ w 누적)

//비동기식 방식 : 따로 하나씩 호출

var inFile = fs.createReadStream("./output.txt", {flags:"r"}); //read 읽어내는 곳
var outFile = fs.createWriteStream("./output2.txt", {flags:"w"});//write 쓰는 곳
//var outFile = fs.createWriteStream("./output2.txt", {flags:"a+"}); //누적
//event
//내부적으로 emit이 있기 때문에 on만 있어도 자동 호출된다.
inFile.on("data", function(str) {//data - 사용자 정의 X, 예약어
	
	console.log("output.txt 읽음..");
	outFile.write(str);
});

inFile.on("end", function() {
	
	console.log("파일 읽기 종료..");
	outFile.end(function() {
		
		console.log("output2.txt 쓰기 완료..")
	})
});