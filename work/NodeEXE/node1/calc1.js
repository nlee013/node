//1. 객체를 사용(분리 방법 : module.exports)

var calc = {};

calc.add = function (a, b) {
	
	return a + b;
}

module.exports = calc;

