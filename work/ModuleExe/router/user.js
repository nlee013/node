var moment = require("moment");

var login = function(req,res){
	
	console.log("/process/login 호출..");
	
	var id = req.body.id;
	var pwd = req.body.pwd;
	
	var database = req.app.get("database");
	
	if(database){
		
		authUser(database, id, pwd, function(err,result){
			
			if(err) {throw err;}
			
			if(result){
				
				var userName = result[0].name;
				
				var context = {userId:id,userName:userName};
				
				//req.app.render("login",context,function(err,html){
				req.app.render("login_Success.jade",context,function(err,html){
					if(err){
						
						res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
						res.write("<h2>뷰 렌터링 중 에러 발생</h2>")
						res.end();
						
						return;
					}
										
					res.end(html);
					
				})				
				
				
			}else{
				
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<meta name='viewport' content='width=device-width,height=device-height,initial-scale=1'>");
				res.write("<h1>로그인 실패</h1>")				
				res.write("<div>아이디 또는 패스워드를 확인하세요</div>");
				res.write("<br/><br/><a href='/public1/login.html'>다시 로그인</a>");
				res.end();
				
			}
			
		});
		
	}else{
		
		res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
		res.write("<meta name='viewport' content='width=device-width,height=device-height,initial-scale=1'>");
		res.write("<h1>데이터베이스 연결 실패</h1>")				
		res.write("<div>데이터베이스를 연결하지 못했습니다.</div>");		
		res.end();	
		
	}
	
	
};


var addUsers = function(req,res){
	
	console.log("/process/addUser 호출..");
	
	var id = req.body.id;
	var pwd = req.body.pwd;
	var name = req.body.name;
	
	var database = req.app.get("database");
	
	if(database){
		
		addUser(database, id, pwd, name, function(err,result){
			
			if(err) {throw err;}
			
			if(result){
				
				//var context = {title:"사용자 추가 성공(View-ejs)"};
				//req.app.render("addUser.ejs", context, function(err, html) {
				
				var context = {title:"사용자 추가 성공(View-jade)"};
				req.app.render("addUser_Success.jade", context, function(err, html) {
					if(err){
						
						res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
						res.write("<h2>뷰 렌터링 중 에러 발생</h2>")
						res.end();
						
						return;
					}
										
					res.end(html);
					
				});
				
			}else{
				
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<meta name='viewport' content='width=device-width,height=device-height,initial-scale=1'>");
				res.write("<h1>사용자 추가 실패</h1>")	
				res.write("<br/><br/><a href='/public1/login.html'>다시 로그인</a>");
				res.end();	
				
			}
		});
		
	}else{
		
		res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
		res.write("<meta name='viewport' content='width=device-width,height=device-height,initial-scale=1'>");
		res.write("<h1>데이터베이스 연결 실패</h1>")				
		res.write("<div>데이터베이스를 연결하지 못했습니다.</div>");		
		res.end();
		
	}	
	
}

var listUser = function(req,res){
	
	console.log("/process/listUser 호출..");
	
	var database = req.app.get("database");
	
	if(database){
		
		database.UserModel.findAll(function(err,result){
			
			if(err){
				
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<meta name='viewport' content='width=device-width,height=device-height,initial-scale=1'>");
				res.write("<h2>사용자 리스트 조회중 에러 발생</h2>");
				res.write("<br/><br/><a href='/public1/login.html'>다시 로그인</a>");
				res.end();
				
				return;
			}
			
			if(result){
			
				var context = {result:result, moment:moment};
				
				//req.app.render("listUserResp.ejs",context,function(err,html){					
				req.app.render("listUserResp_Success.jade",context,function(err,html){	
					
					if(err){
						
						res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
						res.write("<h2>뷰 렌터링 중 에러 발생(jade)</h2>")
						res.end();
						
						return;
					}
					
					res.end(html);	
					
					
				});
				
				
			}else{
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<meta name='viewport' content='width=device-width,height=device-height,initial-scale=1'>");
				res.write("<h2>사용자 리스트 조회 실패</h2>");	
				res.write("<br/><br/><a href='/public1/login.html'>다시 로그인</a>");
				res.end();
				
			}
			
		});
		
	}
}


//사용자를 인증하는 함수
var authUser = function(database,id,pwd,callback){
	
	console.log("authUser 함수 호출..");
			
	//아이디와 비밀번호 검색
	database.UserModel.findById(id, function(err,result){
		
		if(err){
			callback(err,null);
			return;
		}
		
		//데이터가 있을경우
		if(result.length>0){
			
			console.log("아이디와 일치하는 사용자 찾음");
			
			var user = new database.UserModel({id:id});
						
			var authenticated = 
				user.authenticate(pwd, result[0]._doc.salt, result[0]._doc.hashed_password);
			
			if(authenticated){//true
				
				console.log("비밀번호 일치함");
				
				callback(null,result);
				
			}else{//false
				
				console.log("비밀번호 일치하지 않음");
				
				callback(null,null);	
				
			}
			
		}else{
			
			console.log("아이디와 일치하는 데이터가 없습니다.");
			
			callback(null,null);
			
		}
		
	});
	
}

//사용자를 추가하는 함수
var addUser = function(database,id,pwd,name,callback){
	
	console.log("addUser 함수 호출..");
	
	var users = new database.UserModel({"id":id, "pwd":pwd, "name":name});
	
	users.save(function(err,result){
		
		if(err){
			callback(err,null);
			return;
		}
		
		if(result){
			
			console.log("사용자 추가..");
			
		}else{
			
			console.log("사용자 추가 실패..");
			
		}
		
		callback(null,result);		
		
	});
	
};


//module.exports.init = init;
module.exports.login = login;
module.exports.addUser = addUsers;
module.exports.listUser = listUser;











