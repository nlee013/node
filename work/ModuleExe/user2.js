//exports에는 속성만 추가 가능하지만 객체는 할당 불가

exports = {//exports는 내장 객체이므로 못만듦
		
		getUser : function() {
			
			return {id:"suzi", name:"배수지"};
		},
		group : {id:"inna", name:"유인나"}//사용불가 -함수로 호출해야 가능
		
}

//var Object={}//객체 