//Oracle 사용
//npm install oracledb --save

var oracledb = require("oracledb");
var dbConfig = require("./dbConfig.js");

oracledb.autoCommit = true;//auto commit

oracledb.getConnection({
	
	user:dbConfig.user,
	password:dbConfig.password,
	connectString:dbConfig.connectString
	},
	function(err, conn) {
		
		if(err) {throw err;}
		
		console.log("Oracle DB 연결 성공!!");
		
		var sql;
		
		//create table sql
		sql = "create table cuser (id varchar2(10), password varchar2(10), name varchar2(10), age number)";
		
		conn.execute(sql);
		
		console.log("table 생성 완료!");
		
		/*
		//insert
		sql = "insert into cuser values (:id,:pw,:name,:age)";
		
		//binds = ["b123","123","suzi",27]
		
		binds = [
		 		 ["b123","123","suzi",27],
		         ["c123","123","suzi",27],
		         ["d123","123","suzi",27],
		         ["e123","123","suzi",27]
		     ];
		
		var result = conn.executeMany(sql,binds,function(){
			
			console.log("입력 완료!!");
			
		}); //{}함수
		*/
		/*
		//update
		sql = "update cuser set password=:pw,name=:name,age=:age where id=:id";
		
		conn.executeMany(sql,[["777","inna",30,"a123"]]);
		
		console.log("수정 완료!!");
		*/
		/*
		//delete
		sql = "delete cuser where id=:id";
		conn.execute(sql,["a123"]);
		
		console.log("삭제 완료!!");
		*/
		
		//select 
		sql = " select id,password,name,age from cuser";
		
		conn.execute(sql,[],function(err,result){
			
			if(err){throw err;}
			
			console.log(result.rows);
			
			doRelease(conn);//db.close 아래 함수
		});
	});

//db.close와 같은 애
function doRelease(conn){
	
	conn.release(function(err){
		
		if(err) {throw err;}
	});
	
}
























