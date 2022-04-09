
var testJade = function(req, res) {
	
	var context = {};//null
	
	req.app.render("jadeTest.jade", context, function(err, html) {
		
		if(err) {throw err;}
		
		res.end(html);
		
	});
};

module.exports.testJade = testJade;
