module.exports = {
		
		serverPort:3000,
		dbUrl:"mongodb://localhost:27017/shopping",//app2.js의 line23
		
		//schemaName: ./database/userSchem.js 참조
		//modelName: ./router/user.js 참조
		
		dbSchemas:[
		          //지금은 1개의 data지만 여러개 가능
		           {file:"./userSchema", collection:"users4",
		        	schemaName:"UserSchema", modelName:"UserModel"}
		           
		          ],
		      
		routeInfo:[
		           
		           
		          ]



}
