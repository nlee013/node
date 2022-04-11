
module.exports = function(router, passport){
	
	console.log("userPassport 호출된다..");
	

	/*
	클라이언트요청	웹서버		뷰템플릿

	홈화면조회		/(get)				홈화면(index.ejs)
	로그인화면		/login(get)		로그인화면(login.ejs)  
	로그인요청		/login(post)	로그인처리(함수)       
	회원가입화면	/signup(get)	회원가입화면(signup.ejs) created.jsp
	회원가입요청	/signup(post)	회원가입처리(함수)       created_ok.jsp
	사용자프로필	/profile(get)	프로필화면(profile.ejs)
	로그아웃요청	/logout(get)	로그아웃처리(함수)
	*/

	//홈화면
	router.route("/").get(function(req,res){
		res.render("index.ejs");
	});

	//로그인화면
	router.route("/login").get(function(req,res){
		res.render("login.ejs",{message:req.flash("loginMessage")});
	});

	//로그인요청
	router.route("/login").post(passport.authenticate("local-login",{
		
		successRedirect : "/profile", //성공
		failureRedirect : "/login",	//실패
		fallureFlash : true	//실패 메세지
		
	}));

	//회원가입 화면
	router.route("/signup").get(function(req,res){
		res.render("signup.ejs",{message:req.flash("signupMessage")});
	});

	//회원가입
	router.route("/signup").post(passport.authenticate("local-signup",{
		
		successRedirect : "/profile", //성공
		failureRedirect : "/signup",//실패
		fallureFlash : true	//실패 메세지
		
	}));


	//프로파일
	router.route("/profile").get(function(req,res){
		
		//인증실패
		if(!req.user){
			
			console.log("사용자 인증이 안된 상태");
			
			res.redirect("/");
			return;
			
		}
		
		//인증 성공
		console.log("사용자 인증된 상태");
		
		if(Array.isArray(req.user)){
			res.render("profile.ejs",{user:req.user[0]._doc});
		}else{
			res.render("profile.ejs",{user:req.user});
		}	
		
	});

	//로그아웃
	router.route("/logout").get(function(req,res){
		
		req.logout();
		res.redirect("/");
		
	});

	
}