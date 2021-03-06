/*
Event

EventEmitter : 이미 process에 내부적으로상속되어 있음(direct로 쓰는 것이 아님)
				이벤트를 주고 받음

method 종류 on기억하기!! 엄청 나옴!!
-> ****on(event, function) : event가 전달 될 객체에 event listener (event를 받음)
-> emit: event를 다른 쪽으로 전달하는 method(event를 호출)

*/

//1.event 사용하기
/*
exit는 내장 이벤트이므로 이름 바꾸면 안된다
process가 종료하면 자동으로 exit event로 호출
*/

//on이 있으면 이벤트 실행하는 애다!!!!!!꼭 기억해라!!!!!
//내장 객체
process.on("exit", function() { //(이벤트 이름, 함수)
	
	console.log("exit event 발생...");
	
});
/*
setTimeout(function() {
	
}, ms);

*/

//호출 전까지 안나옴
setTimeout(function() {
	
	console.log("3초 후에 시스템 종료함.");
	
	process.exit(); //exit 호출 //이미 존재하는 method
	
}, 3000);

process.on("tick", function(count) {
	
	console.log("tick 이벤트 발생: " + count);
});

setTimeout(function() {
	
	console.log("2초 후에 tick event 전달 시도..");
	process.emit("tick", 4);//emit사용해서 event이름을 적어줘야된다

}, 2000);


