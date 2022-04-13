

module.exports = {
		
		serverPort: 3000,
		dbUrl: "mongodb://localhost:27017/shopping",
		
		dbSchemas:[		
		 {file:"./userSchema",collection:"users4",schemaName:"UserSchema",modelName:"UserModel"},
		 {file:'./boardSchema', collection:'board', schemaName:'BoardSchema', modelName:'BoardModel'}
		],
		
		routerInfo:[	 
		 {file:'./board', path:'/process/addboard', method:'addBoard', type:'post'},
		 {file:'./board', path:'/process/showboard/:id', method:'showBoard', type:'get'},
		 {file:'./board', path:'/process/listboard', method:'listBoard', type:'post'},
		 {file:'./board', path:'/process/listboard', method:'listBoard', type:'get'}
		]
		
}