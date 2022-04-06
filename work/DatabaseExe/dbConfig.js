//Oracle DB 연결하는 방법*****
//npm install oracledb --save

//말 그대로 config
module.exports = {
		
	user			:process.env.NODE_ORACLEDB_USER || "suzi",
	password		:process.env.NODE_ORACLEDB_PASSWORD  || "a123",
	connectString	:process.env.NODE_ORACLEDB_CONNECTIONSTRING  || "localhost:1521/xe",
	externalAuth	:process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false //외부 인증
			
};
