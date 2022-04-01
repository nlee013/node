
//이번엔 분리 작업함

var Calc = function() {
	
	//test3.js에서 보낸 event를 받는 부분
	this.on("stop", function(){
		
		console.log('Calc에 stop event에 전달됌');
		
	});
	
};

//상속을 가능하게 하는 모듈
var util = require("util");

var eventEmitter = require("events").EventEmitter;

//.inherits 상속
//public class Calc extends EventEmitter{} 아래 코드와 같음
util.inherits(Calc, eventEmitter);

module.exports = Calc;
module.exports.title = "계산기";