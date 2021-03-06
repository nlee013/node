/* 모듈을 분리할때 사용하는 코드패턴(3가지 방법)
 1. 함수 할당 (모듈 불러온후 괄호 붙여서 실행)
 2. 인스턴스 객체 할당 (모듈 불러온후 객체의 메소드나 속성 호출) 
 3. 프로토타입 객체를 할당 (모듈 불러온후 new로 객체 생성후 실행)
*/

function User(id, name) {
	
	this.id = id;
	this.name = name;
}

User.prototype.group = {id : "suzi", name:"배수지"};

User.prototype.printUser = function(){
	
	console.log("ID : " + this.id + ", Name : " + this.name);
	console.log("ID : " + this.group.id + ", Name : " + this.group.name);
}

module.exports = User;


