var user = require("./user5");

function showId(){
	
	return user.getUser().id + "," + user.group.id;
}

function showName(){
	
	return user.getUser().name + "," + user.group.name;
}

console.log("ID: " + showId());
console.log("Name: " + showName());