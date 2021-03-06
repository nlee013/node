/*
 자료형 : Boolean, Number, String, Undefined, null, Object
 
 Undefined : return값이 없을 때 나옴
 값을 할당하지 않은 변수 (단순히 값이 없음)
 
 null : 아예 존재하지 않느 값 (의도적으로 값이 없음)
 
 */

//JavaScript 의 Object Type (객체 타입)

//큰 따옴표 "", 작은 따옴표 '' 둘다 된다 (both of them are available to use.)

var Person = {};

Person["name"] = "suzi";
Person['age'] = "27";
Person.mobile = '010-123-1234';

console.log("name:" + Person.name);
console.log("age:" + Person.age);
console.log("mobile:" + Person.mobile);

console.log("name:" + Person["name"]);
console.log("age:" + Person["age"]);
console.log("mobile:" + Person["mobile"]);


console.log("-------------------------");
//Basic function 기본 함수
function add1(a, b) {
	
	return a + b;
	
}

//함수 호출해서 대입 연산자 입력해서 결과 출력
var result = add1(10, 20); 
console.log(result);

//익명 함수 Anonymous function : 익명의 함수로 변수안에 함수 넣을수 있음
var addr2 = function(a, b) {
	
	return a + b;
	
}

var result2 = addr2(20, 30); 
console.log(result2);

//객체의 속성으로 변수 생성
var Person1 = {};

Person1["name"] = "정인선";
Person1['age'] = 30; //변수 초기화

Person1.mobile = 30;
Person1.add3 = function(a, b) {
	
	return a + b;
	
}

console.log(Person1.add3(30, 40));

//변수에 함수할당 후 객체의 속성으로 추가
var add4 = function(a, b) {
	
	return a + b;
}

Person1.add4 = add4; //Person1["add4"] = add4; 
console.log(Person1.add4(40, 50));//direct로 불러온 경우


//객체를 만들면서 동시에 속성을 초기화
//JSON 방식
var Person2 = {
		
		name:'유인나',
		age:'40',
		add5:function(a, b){
			return a + b;
		}

};

console.log(Person2.add5(50, 60));
console.log(Person2.name);
