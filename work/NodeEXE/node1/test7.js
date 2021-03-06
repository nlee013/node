//prototype 객체 만들기 - 예전에 ajax 할 때 했었음

function Person(name, age) {//기본 생성자와 같은 개념
	
	//초기화 시켜줄 애들//생성자
	this.name = name;
	this.age = age;
}

//Person.walk = function (speed) {...} - 사용불가

Person.prototype.walk = function(speed) {//class type으로 쓴 것
	
	if(speed > 30){
		
		console.log(speed + "km 속도로 뛰어갑니다.");
		return
	}
	
	console.log(speed + "km 속도로 걸어갑니다.");
}

var person1 = new Person("수지", 25);
var person2 = new Person("인나", 35);

console.log(person1.name + "가 걸어간다");
//Person.walk(10); - direct로 사용불가
person1.walk(10); // 객체 생성 후 그 객체 이름으로 접근해줘야 된다 - prototype

console.log(person1.name + "가 뛰어간다");
person2.walk(50);
