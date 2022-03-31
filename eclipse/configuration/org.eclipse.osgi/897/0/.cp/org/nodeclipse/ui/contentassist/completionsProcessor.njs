// Author: Paul Verest
// process completions.json file

var fs = require('fs');

var curfolder = __dirname;

var filename = './completions.json';
var filename2 = './completions2.json';

var completionsJson = require(filename);
var completionsArray = completionsJson.completions;

var counterEQ =0;
var counterNQ =0;

for (var i = 0; i < completionsArray.length; i++) {
	var entry = completionsArray[i];
	if (entry.trigger === entry.contents ){
		counterEQ++;
		delete entry.contents;
	} else{
		counterNQ++;
	}
}

console.log("counterEQ="+counterEQ+" counterNQ="+counterNQ);


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
var completionsJsonString = JSON.stringify(completionsJson,null,"\t"); 

fs.writeFile(filename2, completionsJsonString, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The "+filename2+" file was written.");
    }
});
