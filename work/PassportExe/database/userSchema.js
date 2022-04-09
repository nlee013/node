//여기에 Schema를 빼내올 예정----

//crypto(암호화) 모듈
var crypto = require("crypto");

var Schema = {};//빈 객체//java에선 class//객체 초기화

//객체 안에 변수 만들어서 함수 넣기
Schema.createSchema = function(mongoose) {//**here 매개변수
	
	//스키마 정의
	UserSchema = mongoose.Schema({//mongoose가 있으므로 **here부분에 mongoose를 넣어준다
		email:{type:String,required:true,unique:true},//id 대신 email로 인증하기에 email로 바꿈
		hashed_password:{type:String,required:true},
		salt:{type:String,required:true},
		name:{type:String},		
		created:{type:Date,index:{unique:false},'default':Date.now}
	});		
	
	UserSchema
		.virtual("pwd")
		.set(function(pwd){
			
			this._password = pwd;
			this.salt = this.makeSalt();
			this.hashed_password = this.encryptPassword(pwd);
			
		})
		.get(function(){
			
			return this._password;
			
		});
	
		UserSchema.method("makeSalt",function(){
			
			//console.log("date : " + new Date().valueOf());//12321423423
			//console.log("math : " + Math.random());//0.12321423423
			
			return Math.round((new Date().valueOf() * Math.random())) + "";
			
		});
		
		//암호화 작업
		UserSchema.method("encryptPassword",function(inputPwd,inSalt){
			
			if(inSalt){				
				return crypto.createHmac("sha1",inSalt).update(inputPwd).digest("hex");				
			}else{				
				return crypto.createHmac("sha1",this.salt).update(inputPwd).digest("hex");				
			}
			
			
		});
		
		//로그인할때 암호화된 pwd와 비교
		UserSchema.method("authenticate",function(inputPwd,inSalt,hashed_password){
			
			if(inSalt){
				
				console.log("사용자 입력 pwd: " + inputPwd);
				console.log("암호화된 pwd: " + this.encryptPassword(inputPwd,inSalt));
				console.log("DB에 저장되어있는 pwd: " + hashed_password);				
				
				return this.encryptPassword(inputPwd,inSalt)==hashed_password;//true,false
				
			}else{
				
				console.log("사용자 입력 pwd: " + inputPwd);
				console.log("암호화된 pwd: " + this.encryptPassword(inputPwd,inSalt));
				console.log("DB에 저장되어있는 pwd: " + hashed_password);				
				
				return this.encryptPassword(inputPwd)==this.hashed_password;//true,false				
				
			}		
			
		});
		
	
	//스키마 객체에 메소드를 추가( 방법: static(), method() )
	
	//로그인에서 사용
	UserSchema.static("findByEmail", function(email,callback){//email로 바꿔줌
		return this.find({email:email}, callback);
	})
	
	//전체데이터 사용
	UserSchema.static("findAll", function(callback){
		return this.find({}, callback);
	})	
	console.log("UserSchema 정의함.");
	
	return UserSchema; //자기 자신한테 UserSchema를 return해야된다.
}

module.exports = Schema;

