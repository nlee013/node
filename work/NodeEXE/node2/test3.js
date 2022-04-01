var Calc = require("./calc");

var calc = new Calc();

//emit으로 호출
calc.emit("stop");

console.log(Calc.title);