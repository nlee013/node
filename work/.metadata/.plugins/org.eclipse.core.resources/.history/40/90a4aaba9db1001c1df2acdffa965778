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

module.exports = logger;