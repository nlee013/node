//로그 만들기

//windston은 외부 module을 설치해야 호출가능
//아래 2개의 module이 필요
//아래 module은 node에 없으므로 아래방법과 같이 설치하면 된다.
/*
**********************************************************
 외부 모듈 설치하기(npm)
----------------------------------------------------------
package.json 파일생성
npm init 실행 (기본 외부모듈 설치-기본값 엔터) -가장기본

npm install 모듈이름 : 설치
npm uninstall 모듈이름 : 삭제
npm install -g npm : 모든 모듈 업데이트

-----------------------------------------------------------
save를 빼고 앞에만 쓰면 파일 설치만 된 것이지 패키지에 저장이 안되므로 --save까지 써주자

**** (이것만은 꼭 기억해두기!!)
npm install 모듈이름 --save : package.json 파일에 저장(설치경로는 아래참조)

-----------------------------------------------------------
다른 프로젝트에도 공통으로 인식할 수 있게 설치된다
npm install 모듈이름 --g 또는 (--global) : 전역 환경에 파일 저장

설치 경로: C:\Users\itwill\AppData\Roaming\npm\node_modules

------------------------------------------------------------
npm install : package.json 파일에 기록된 모든패키지 설치

npm list : 설치된 패키지 정보
npm list -g : 전역환경에 설치된 정보
**********************************************************
*/

var winston = require("winston"); //log 처리 module
var winstonDaily = require("winston-daily-rotate-file");//log 일별(매일) 처리 module

var logger = winston.createLogger({
	
	//log 수준(가장 약한 순부터 나열)
	//debug:0 < info:1 < notis:2 < warning:3 < error:4 < crit:5 < alert:6 <emerg:7
	
	level:"debug",
	
	format:winston.format.simple(),//winston이 제공하는 형식
	transports: [
	             new (winston.transports.Console)({
	            	 
	            	 colorize:true}),
	            
	            new (winstonDaily)({
	            	
	            	filename: './log/server_%DATE%.log',
	            	maxSize: "10m", //10메가
	            	datePattern: "YYYY-MM-DD HH-mm-ss"
	            })
	          
	            ]
	
});

var fs = require("fs");

var inName = "./output.txt";
var outName = "./output4.txt";

fs.exists(outName, function(fileName){
	
	if(fileName){
		
		fs.unlink(outName, function(err) {
			if(err) throw err; //throw 오류를 표시해라 //코드 한 줄로 많이 사용
			
			//logger.info(outName + "삭제함...");
			logger.debug(outName + "삭제함...");
		});
		
		return;
	}
	//파일 이름이 없으면
	var inFile = fs.createReadStream(inName, {flags:"r"});
	var outFile = fs.createWriteStream(outName, {flags:"w"});
	
	inFile.pipe(outFile); //내보내라 //기억해두어라~!!!
	logger.debug("파일복사 성공!");
	//logger.info("파일복사 성공!");
});