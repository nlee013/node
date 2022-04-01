/*
모듈 분리 방법 exports

1. 객체를 사용(분리 방법 : module.exports)

var calc = {}; calc class 빈 객체 만든 것
cal.add = 10; 전역 변수 생성

변수에 method 함수도 넣을 수 있음
cal.add  = function(a, b){
return a + b; 
}
calc.mul = function(a, b){
return a*b;
}
외부에서 이 파일을 calc 이름으로 불러내주어서 사용하면 된다
module.exports = calc;

-------------------------
2. 속성을 사용 (exports로 분리) exports가 내장 되어 있어서

exports.add = function(a, b){
	
	return a*b;
};


exports.mul = function(a, b){
	
	return a*b;
};



*/

var calc = {}

calc.add = function(a, b){
	
	return a + b;
}

console.log("모듈 분리전: " + calc.add(10, 20));

//1. 객체를 사용(분리 방법 : module.exports)

//require = java의 import와 같은 역할 (꼭 써주기)
//이미 만들어진 것을 불러올 때
var calc1 = require('./calc1'); 

console.log("모듈(객체로) 분리후: " + calc1.add(20, 30));

//2. 속성을 사용 (exports로 분리) exports가 내장 되어 있어서

var calc2 = require("./calc2");

console.log("모듈(속성으로) 분리 후: " + calc2.mul(20, 30));


