// notice here I'm requiring my database adapter file
// and not requiring node-postgres directly
const db = require('../db')
const bcrypt = require('bcrypt');
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

const saltRounds = 5;

module.exports = function(app){


	// /*로그인 성공시 사용자 정보를 Session에 저장한다*/
	// passport.serializeUser(function (user, done) {
	//   done(null, user)
	// });

	// /*인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.*/
	// passport.deserializeUser(function (user, done) {
	//   done(null, user);
	// });

	// passport.use('local-login', new LocalStrategy({
	//   usernameField: 'email',
	//   passwordField: 'password',
	//   passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
	// }, function (req, email, password, done) {
	//   db.query('SELECT * FROM main.user WHERE email = $1', [email], (err, data) => {
	//   			console.log("야");
	// 	    if (err) {
	// 	      return done(false, null);
	// 	    }
	// 	    if(data.rowCount==0) {
	// 	    	return done(false, null);
	// 	    } else {
	// 	    	return bcrypt.compare(password, data.rows[0].password, function(err, result) {
	// 			    if (result == true) {
	// 			    	return done(null, {
	// 			    		name: data.rows[0].name,
	//             			email: data.rows[0].email,
	//            				password: data.rows[0].password
	//          			});
	// 			    } else {
	// 			    	 return done(false, null);
	// 			    }
	// 			});
	// 	    } 
		   	
	// 	  })
	// }));

	app.get("/logout", function(req, res) {
  		req.session.destroy();
  		res.clearCookie('sid');
		res.redirect("/")
	})

	app.post('/login', function (req, res) {
		let email = req.body.email
		let password = req.body.password
		let msg = ''

	  	return db.query('SELECT * FROM main.user WHERE email = $1', [email], (err, data) => {
		    if (err) {
		      return next(err)
		    }
		    if(data.rowCount==0) {
		    	msg = '일치하는 계정이 존재하지 않습니다.'
		    	res.redirect('/');
		    } else {
		    	return bcrypt.compare(password, data.rows[0].password, function(err, result) {
				    if (result == true) {
				    	console.log(data)
				    	req.session.email = email;
				    	req.session.uid = data.rows[0].uid
				    	req.session.name = data.rows[0].name

				    	res.redirect('/');
				    } else {
				    	msg = '비밀번호가 일치하지 않습니다.'
				    	res.redirect('/');
				    }
				});
		    } 
		   	
		  }) 
	});

	// app.post('/login', passport.authenticate('local-login', {failureRedirect: '/', failureFlash: true}), // 인증실패시 401 리턴, {} -> 인증 스트레티지
 //  		function (req, res) {
 //    	res.redirect('/main');
 //  	});

 //  	/*Log out*/
	// app.get('/logout', function (req, res) {
	//   req.logout();
	//   res.redirect('/');
	// });



	app.get('/user', (req, res, next) => {
	  db.query('SELECT * FROM main.user', [], (err, data) => {
	    if (err) {
	      return next(err)
	    }
	    res.send(data.rows)
	  })
	})

	app.get('/user/:id', (req, res, next) => {
	  db.query('SELECT (id,name,email,created_date) FROM main.user WHERE id = $1', [req.params.id], (err, data) => {
	    if (err) {
	      return next(err)
	    } else {
	    	res.send({success: true})
	    }
	    
	  })
	})

	app.post('/user/signup', (req, res, next) => {
		let name = req.body.name
		let email = req.body.email
		let password = req.body.password
		// TODO : 비밀번호 6자 이상만 허용
		bcrypt.hash(password, saltRounds, function(err, hash) {
   			db.query('INSERT INTO main.user (name,email,password,created_date,uid) VALUES ($1, $2, $3,CURRENT_TIMESTAMP, uuid_generate_v4())', [name,email,hash], (err, data) => {
	    	if (err) {
	    		if(err.code == '23505') {
	    			res.send({success: false, msg : '이미 존재하는 계정입니다.'})
	    		} else {
	    			res.send({success: false, msg: '알 수 없는 오류입니다. 관리자에게 문의하세요.'})
	    		}
	    	} else {
	    		res.send({success: true})
	    	}
	    	
	  		})
		});  
	})	

	app.post('/user/modify', async(req, res, next) => {
		let email = req.body.email
		let name = req.body.name
		let password = req.body.password
		let passwordCheck = req.body.passwordCheck
		let passwordSeq = ''
		if (password) {
			if (password == passwordCheck) {
				let hashPassword = await bcrypt.hash(password, saltRounds)
				passwordSeq = `,password = '${hashPassword}'`
			} else {
				passwordSeq = 'err'
			}
		}
		let seq = `UPDATE main.user SET name = '${name}' ${passwordSeq} WHERE email = '${email}'`

		if (passwordSeq !='err') {
			db.query(seq, [], (err, data) => {
	    	if (err) {
	    		res.send({success: false, msg : '알 수 없는 오류입니다. 관리자에게 문의하세요.'})
	    	} else {
	    		req.session.email = email;
				req.session.name = name
	    		res.send({success: true})
	    	}
	    	
	  		}) 
		} else {
			res.send({success: false, msg : '비밀번호 오류입니다.'})
		}
		
	})	

	app.post('/user/delete', (req, res, next) => {
		let uid = req.body.uid

		db.query('DELETE FROM main.user WHERE uid = $1', [uid], (err, data) => {
			console.log(err)
			console.log(data)

	    	if (err) {
	    		res.send({success: false, msg : '알 수 없는 오류입니다. 관리자에게 문의하세요.'})
	    	} else {
	    		res.send({success: true})
	    	}
	    	
	  	}) 
		
	})	


	app.post('/user/login', (req, res, next) => {
		console.log(req.body)
		let email = req.body.email
		let password = req.body.password
	  	db.query('SELECT * FROM main.user WHERE email = $1', [email], (err, data) => {
	    if (err) {
	      return next(err)
	    }
	    if(data.rowCount==0) {
	    	res.status(200).json({success: false, msg: '일치하는 계정이 존재하지 않습니다.'})
	    } else {
	    	return bcrypt.compare(password, data.rows[0].password, function(err, result) {
			    if (result == true) {
			    	res.status(200).json({success: true})
			    } else {
			    	res.status(200).json({success: false, msg: '비밀번호가 일치하지 않습니다.'})
			    }
			});
	    } 
	   	
	  })
	})
}