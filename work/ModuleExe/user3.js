//exports에는 속성만 추가 가능하지만 객체는 할당 불가

var user = {
		
		getUser : function() {
			
			return {id:"suzi", name:"배수지"};
		},
		group : {id:"inna", name:"유인나"}//사용불가 -함수로 호출해야 가능..?
		
}
module.exports = user;
