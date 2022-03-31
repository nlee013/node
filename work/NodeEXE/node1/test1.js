/*전역객체와 method

console 객체 안에 method가 있다 -종류 : dir, time, timeEnd
process 객체 -종류 : drgv, env,exit
exports 객체 
 */

var result = 0;

console.time("계산시간");//사용자 정의 aaa


for(var i = 1; i <= 100; i++){
	result += i;
}

console.timeEnd("계산시간");//위와 맞춰줘야된다 aaa
console.log("1부터 100까지의 합 %d", result);

console.log("현재 실행할 파일 이름: " + __filename);
console.log("현재 실행할 파일 경로: " + __dirname);

var Person = {name:"배수지", age:27}
//객체속성 출력
console.dir(Person);

console.log("argv 속성의 parameter 갯수: " + process.argv.length);
console.dir(process.argv);

process.argv.forEach(function(item, index){//(item, index) 순서 바뀌면 안된다
	
	console.log(index + ":" + item);
});

//환경변수
console.dir(process.env);
