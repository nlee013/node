//파이프(pipe) 사용하기
var fs = require("fs");

var inName = "./output.txt";
var outName = "./output33.txt";

fs.exists(outName, function(fileName){
	
	if(fileName){
		
		fs.unlink(outName, function(err) {
			if(err) throw err; //throw 오류를 표시해라 //코드 한 줄로 많이 사용
			
			console.log(outName + "삭제함...");
		});
		
		return;
	}
	//파일 이름이 없으면
	var inFile = fs.createReadStream(inName, {flags:"r"});
	var outFile = fs.createWriteStream(outName, {flags:"w"});
	
	inFile.pipe(outFile); //내보내라 //기억해두어라~!!!
	console.log("파일복사 성공!");
	
});