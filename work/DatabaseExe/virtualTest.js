//암호화 npm install crypto --save

var mongdb = require("mongodb");
var mongoose = require("mongoose");

var database;
var UserSchema;
var UserModel;

function connectDB() {
	
	var databaseUrl = "mongodb://localhost:27017/shopping";
	
	mongoose.connect(databaseUrl);
	
	database = mongoose.connection;
	
	database.on("open", function() {
		
		console.log("database에 연결된다..");
		
		createUserSchema();
		
		insertData();
		
	});
	
	database.on("error", function() {
		
		console.log("database 연결 error");
	});
	
	database.on("disconnected", function() {
	
		console.log("database 연결 종료..");
	});
	
}
//DB연결 함수 호출
connectDB();

function createUserSchema() {
	
	//schema 정의---------------------
	UserSchema = mongoose.Schema({
		
		id:{type:String, required:true, unique:true},
		name:{type:String},
		//age:{type:Number, 'default':20},
		//created:{type:Date, 'dafault':Date.now}
	});
	
	//virtual 함수
	UserSchema
		.virtual("info")//가상 속성 이름
		.set(function(info) {
				
		//{"info":"suzi", 배수지}
		var array = info.split(",");//,로 구분
				
			this.id = array[0];
			this.name = array[1];
				
		})
		.get(function() {
			
				return this.id + "" + this.name;
		});
	
			console.log("UserSchema 정의함.");//--------------------
			
	//모델 정의
	UserModel = mongoose.model("users3", UserSchema);//새로운 콜렉션 users3
	console.log("UserModel 정의함.");
	
}

function insertData() {
	
	//model : find, save, update, remove
	
	var user = new UserModel({"info": "sss,리나"});
	
	user.save(function(err) {
		
		if(err){throw err;}
		
		console.log("사용자 데이터 추가됌.");
		
		findAll();
		
	});
	
	
}

function findAll(){
	
	UserModel.find({}, function(err, result){
		
		if(err) {throw err;}
		
		if(result){
			
			for(i = 0; i < result.length; i++){
				
				console.log("id:%s, name:%s",
							result[i]._doc.id, result[i]._doc.name);
			}
		}
		
	});
}