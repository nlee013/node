var logger = require("./logger");
var fs = require("fs");

var inName = "./output.txt";
var outName = "./output4.txt";

fs.exists(outName, function(fileName){
	
	if(fileName){
		
		fs.unlink(outName, function(err) {
			if(err) throw err; //throw 오류를 표시해라 //코드 한 줄로 많이 사용
			
			//logger.debug(outName + "삭제함...");
			logger.info(outName + "삭제함...");
		});
		
		return;
	}
	//파일 이름이 없으면
	var inFile = fs.createReadStream(inName, {flags:"r"});
	var outFile = fs.createWriteStream(outName, {flags:"w"});
	
	inFile.pipe(outFile); //내보내라 //기억해두어라~!!!
	logger.info("파일복사 성공!");
	//logger.debug("파일복사 성공!");
});