//배열 만들고 요소 추가하기

//push() : 마지막에 데이터 추가
//pop() : 마지막 데이터 삭제
//unshift() : 맨앞에 데이터 추가
//shift() : 맨앞에 데이터 삭제
//splice() : 여러 데이터 추가/삭제
//slice() : 잘라내서 새로운 배열 만들기

var users = [{name:"배수지", age:27}, {name:"유인나", age:40}];

users.push({name:"박신혜", age:33});

console.log("data 개수:" + users.length);
console.log(users[0].name);
console.log(users[1].name);
console.log(users[2].name);

console.log("-----------------------------");

console.dir(users);//printout json type

for(var i = 0; i < users.length; i++){
	
	console.log(users[i].name);
}

console.log("-----------------------------");

users.forEach(function(item, index) {
	
	console.log(index + ":" + item.name + ":" + item.age);
	
});

console.log("-----------------------------");

//index 0에서 1개의 data
users.splice(0, 1);

for(var i = 0; i < users.length; i++){
	
	console.log(users[i].name);
}

//배열에 함수 추가
var add = function(a, b) {
	
	return a + b;
	
}

users.push(add);//맨 뒤에/마지막에 들어가는 data
console.log(users[2](10, 20));

console.log("-----------------------------");

//data 다 보기

for(var i = 0; i < users.length; i++){
	
	console.log(users[i].name +"--");
}

console.log("-----------------------------1");

users.push({name:"이효리", age:40});
users.push({name:"정인선", age:30});

for(var i = 0; i < users.length; i++){
	
	console.log(users[i].name);
}

console.log("-----------------------------00");

//delete last data 마지막 data 삭제
users.pop();

for(var i = 0; i < users.length; i++){
	
	console.log(users[i].name);
	
}

//delete first data 첫번째 데이터 삭제

console.log("-----------------------------22");
users.shift();

for(var i = 0; i < users.length; i++){
	
	console.log(users[i].name);
}

console.log("-----------------------------2");

//add first data 첫번째 data 추가
users.unshift({name:"김지현", aga:30});

for(var i = 0; i < users.length; i++){

	console.log(users[i].name);
	
}

console.log("-----------------------------3");

//delete middle of data 중간 data 삭제
delete users[1];

console.dir(users);

//delete - data만 지워진 것이고 공간은 남아 있다
//새로 데이터를 추가해도 빈 공간에 들어가지 않는다
//그래서 삭제는 splice로 해야된다

console.log("-----------------------------");

//index[1]에 추가
users.splice(1, 0, {name:"빅마마", age:40});
console.dir(users);

console.log("-----------------------------");

//splice로 삭제 (삭제, 추가 둘다 가능)
users.splice(2, 1);
console.dir(users);

console.log("-----------------------------0");

//slice
console.log(users.length);

console.log("-----------------------------011");

var users2 = users.slice(1, 3); //3-1 //1에서 부터 2개 자른다

console.log(users);

console.log("-----------------------------033");
//짤린 애들 출력
console.log(users2);

console.log("-----------------------------0");
var users3 = users.slice(1);
console.log(users3);//1부터 끝까지 짤린애들
