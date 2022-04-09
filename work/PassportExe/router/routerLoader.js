
var config = require("../config");//위치 정보
var routerLoader = {};//객체 생성 

routerLoader.init = function(app, router) {
	
	console.log("routerLoader 호출된다..");
	
	return initRouter(app, router);
	
}

function initRouter(app, router){
	
	var infoLen = config.routeInfo.length;//3
	
	for(var i = 0; i < infoLen; i++){
		
		var curItem = config.routeInfo[i];
		
		var curModule = require(curItem.file);//user.js
		
		//라우팅
		if(curItem.type =="get"){
			
			//router.route("/process/login").get(user.login);//app2.js line 23 var user = require("./router/user"); 
			
			//config.js curItem.method 이름
			router.route(curItem.path).get(curModule[curItem.method]);
			
		}else if(curItem.type =="post"){
			
			router.route(curItem.path).post(curModule[curItem.method]);
			
		}else{
			
			router.route(curItem.path).post(curModule[curItem.method]);
		}
		
		
	}
	
	console.log("라우팅 모듈 설정");
	//라우터 객체 등록
	app.use("/", router);
}

module.exports = routerLoader; //외부 등록