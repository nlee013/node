/*
GeoSpatial Schema Definition
 
Geometry
	'type': {type: String, enum: ["Point", "MultiPoint", "LineString",
	"MultiLineString", "Polygon", "MultiPolygon"] },
	coordinates: []
  
Point
	'type': {type: String, 'default': "Point"},
	coordinates: [{type: "Number"}]
  
MultiPoint
	'type': {type: String, default: "MultiPoint"},
	coordinates: [{type: "Array"}]
  
MultiLineString
	'type': {type: String, default: "MultiLineString"},
	coordinates: [{type: "Array"}]
 
Polygon
	'type': {type: String, default: "Polygon"},
	coordinates: [{type: "Array"}]
 
MultiPolygon
	'type': {type: String, default: "MultiPolygon"},
	coordinates: [{type: "Array"}]
  
GeometryCollection
	'type': {type: String, default: "GeometryCollection"},
	geometries: [Geometry]
  
Feature
	id: {type: "String"},
	'type': {type: String, default: "Feature"},
	geometry: Geometry,
	properties: {type: "Object"}
  
FeatureCollection
	'type': {type: String, default: "FeatureCollection"},
	features: [Feature]
 
*/

var Schema = {};

Schema.createSchema = function(mongoose){
	
	var CoffeeShopSchema = mongoose.Schema({
		
		name : {type:String, index:"hashed"},//몽고디비는 name에다가 index를 만든다
		addr:{type:String},
		tel:{type:String},
		geometry:{
			
			type:{type:String, "default" : "point"},//위치 정보 유형 정리
			coordinates:[{type:"Number"}]//위도, 경도 좌표 정보 저장(2개값을 저장하기에 배열로 만듦)
			
		},
		created:{type:Date, "default":Date.now}
	
	});
	
	//geometry에 indexing(공간 인덱싱)을 만들면 속도가 빨라진다.
	//그래서 위치 좌표는 2d sphere 타입이다.
	CoffeeShopSchema.index({geometry:"2dsphere"});
	
	//Schema에 method 추가 (static 형식으로 가장 많이 사용함)
	//method 함수 종류 : findAll(모두), findNear(근처), findWithin(특정좌표범위), findCircle
	
	//모든 스타벅스 조회
	CoffeeShopSchema.static("findAll", function(callback) {
		
		console.log("findAll 호출된다..");
		return this.find({}, callback);
		
	});
	
	//가장 가까운 스타벅스 조회
	//maxDistance : 기준점으로부터 최대 거리
	//limit() : 조회한 결과 갯수 제한 - limit(1) 1개
	CoffeeShopSchema.static("findNear", function(longitude, latitude, maxDistance, callback) {
		
		console.log("findNear 호출된다..");
		
		//find().where(속성이름).near(조회조건)
		this.find().where("geometry").near({center:{type:"Point",
									coordinates:[parseFloat(longitude),parseFloat(latitude)]},
									maxDistance:maxDistance}).limit(1).exec(callback);//1개 표시

	});
	
	CoffeeShopSchema.static("findNear2", function(longitude, latitude, maxDistance, callback) {
		
		console.log("findNear2 호출된다..");
		
		//find().where(속성이름).near(조회조건)
		this.find().where("geometry").near({center:{type:"Point",
									coordinates:[parseFloat(longitude),parseFloat(latitude)]},
									maxDistance:maxDistance}).limit(1).exec(callback);//1개 표시

	});
	
	//일정 범위내 스타벅스 조회하기
	
	CoffeeShopSchema.static("findWithin",
			function(topleft_longitude,topleft_latitude,bottomright_longtitude,
					bottomright_latitude,callback){
		
		console.log("findWithin 호출됨")
		
		this.find().where("geometry")
		.within({box:[[parseFloat(topleft_longitude),parseFloat(topleft_latitude)],
		[parseFloat(bottomright_longtitude),parseFloat(bottomright_latitude)]]}).exec(callback);		
		
	});
	
	//반경 내 스타벅스 조회하기
	CoffeeShopSchema.static("findCircle",
			function(center_longitude,center_latitude,radius,callback){
		
		console.log("findCircle 호출됨")
		
		//change radius : 1/6371 :1km
		this.find().where("geometry")
		.within({center:[parseFloat(center_longitude),parseFloat(center_latitude)],
		              radius:parseFloat(radius/6371000),
		              unique:true,
		              spherical:true}).exec(callback);
		             
	});
	
	console.log("CoffeeShopSchema 정의함");
	
	return CoffeeShopSchema;
	
	
}

module.exports = Schema;

