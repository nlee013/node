//파일에 데이터 쓰기
var fs = require("fs");

fs.writeFile("./odd.txt", "오늘은 금요일~", function(err) {
	
	if(err){
		
		console.log("error 발생: " + err);
	}
	
	console.log("쓰기 완료!");
	
} );
