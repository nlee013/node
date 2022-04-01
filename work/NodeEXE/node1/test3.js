/*
 내장 모듈 사용하기
  
  내장 모듈도 호출해야 사용 가능

*/
 //OS
  var os = require("os");
  
  console.log(os.hostname());//host name
  console.log(os.totalmem());//memory data
  
  console.log(os.cpus()); //cpu data
  console.log(os.networkInterfaces());//ram card data
  
  console.log("-----------------------------");
  
  //path
  var path = require("path");//불러들이기
  
  var dir = ["users", "itwill", "docs"];
  
  var docDir = dir.join(path.sep);
  
  console.log(docDir);
  
  var curPath = path.join("/users/itwill", "notepad.exe");
  console.log(curPath);
  
  var filepath = "c:\\users\\itwill\\notepad.exe";
  
  var dirName = path.dirname(filepath);//끊을 수 있다
  var fileName = path.basename(filepath);
  var extName = path.extname(filepath);
  
  console.log(dirName);
  console.log(fileName);
  console.log(extName);
  