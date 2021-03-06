//url module
var url = require("url");

//parse : 주소열을 url 객체로 변환
var curURL = url.parse("https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=angelina");

//format :URL 객체를 주소 문자열로 변환
var curStr = url.format(curURL);

console.log(curStr);
console.log(curURL);

console.log("-----------------------");

//요청 parameter 구분
var queryStr = require("querystring");
var param = queryStr.parse(curURL.query);

console.log(param.query);

//stringify: 객체를 문자열로 변환
console.log(queryStr.stringify(param));

