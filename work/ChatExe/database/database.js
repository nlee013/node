
var mongoose = require("mongoose");

//database 객체에 db, schema, model 추가
var database = {};

//app=express 객체
//config = config.js 정보
database.init = function(app, config) {
	
	connect(app, config);
	
}

function connect(app, config){
	
	console.log("connect 호출된다..")
	
	mongoose.connect(config.dbUrl);//databaseUrl->config.dbUrl
	
	database = mongoose.connection;
	
	database.on("open",function(){
		
		console.log("데이터베이스가 연결되었습니다: " + config.dbUrl);
		
		//config에 등록된 스키마,모델 객체 생성
		createSchema(app, config);//userSchema.js의 createUserSchema()
		
	});
	
	database.on("error",console.error.bind(console,"몽구스 연결 에러..."));
	
	database.on("disconnected",function(){
		
		console.log("DB연결이 끊겼습니다 5초후 재연결 합니다");
		setInterval(connectDB(),5000);
	});
	
}

//config에 정의된 schema 및 모델 객체 생성 함수-----
function createSchema(app, config){
	
	var schemaLen = config.dbSchemas.length;
	
	//config에 있는 data가 여러개 일 경우
	
	for(var i = 0; i < schemaLen; i++){
		
		var curItem = config.dbSchemas[i];
		
		//Schema 객체 생성
		//file : userschema의 위치, 경로(config.js의 line 11
		var curSchema = require(curItem.file).createSchema(mongoose);
			
		//Schema Model 생성
		//app2.js
		var curModel = mongoose.model(curItem.collection, curSchema);
		
		//database 객체에 schema와 model추가----
		//config.js의 line 12
		//curItem.schemaName 이런식은 회사에서 많이 사용.그냥 abc해도 된다
		database[curItem.schemaName] = curSchema;
		database[curItem.modelName] = curModel;
		
	}
	//user.js의 line 26
	app.set("database", database);//db + schema + model
}

module.exports = database;
