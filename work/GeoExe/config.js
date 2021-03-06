module.exports = {
		
		serverPort:3000,
		dbUrl:"mongodb://localhost:27017/shopping",//app2.js의 line23
		
		//schemaName: ./database/userSchem.js 참조
		//modelName: ./router/user.js 참조
		
		dbSchemas:[
		          //지금은 1개의 data지만 여러개 가능
		           {file:"./userSchema", collection:"users4",
		        	schemaName:"UserSchema", modelName:"UserModel"},
		        	
		        	{file:"./coffeeshopSchema", collection:"starbucks",
		        		schemaName:"CoffeeShopSchema", modelName:"CoffeeShopModel"}
		           
		          ],
		      
		routeInfo:[
		           {file:"./coffeeShop", path:"/process/addCoffeeShop", method:"add", type:"post"},
		           {file:"./coffeeShop", path:"/process/listCoffeeShop", method:"list", type:"post"},
		           {file:"./coffeeShop", path:"/process/nearCoffeeShop", method:"findNear", type:"post"},
		           {file:"./coffeeShop", path:"/process/withinCoffeeShop", method:"findWithin", type:"post"},
		           {file:"./coffeeShop", path:"/process/circleCoffeeShop", method:"findCircle", type:"post"},
		           {file:"./coffeeShop", path:"/process/nearCoffeeShop2", method:"findNear2", type:"post"}
		          ]



}
