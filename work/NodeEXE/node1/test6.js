//callBack function

//기억해두기 구조를 항상 이런식으로 사용
//함수를 호출 했을 때 결과를 다른 함수로 전달하는 비동기 방식 코딩

function add(a, b, callback) { //매개변수가 3개인데 문자인지 정수인지 모르지만 값 두개, 함수
	
	var result = a + b;
	
	callback(result);
	
}

add(10, 20, function(result) {
	
	console.log(result);
});