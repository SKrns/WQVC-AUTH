// notice here I'm requiring my database adapter file
// and not requiring node-postgres directly
const db = require('../db')
const bcrypt = require('bcrypt');
const saltRounds = 5;

module.exports = function(app){
	app.get('/conference', (req, res, next) => {
	  db.query('SELECT * FROM main.conference', [], (err, data) => {
	    if (err) {
	      return next(err)
	    }
	    res.send(data.rows)
	  })
	});

	app.get('/participant/:user_uid', (req, res, next) => {
	  db.query('SELECT A.conference_uid,B.name AS conference_name,B.contents AS conference_contents,B.start_date,B.end_date,B.owner AS owner_uid,C.name AS owner_name,C.email AS owner_email FROM main.participant A JOIN main.conference B ON A.conference_uid = B.uid JOIN main.user C ON B.owner = C.uid WHERE A.user_uid = $1', [req.params.user_uid], (err, data) => {
	    if (err) {
	      return next(err)
	    } else {
	    	res.send(data.rows)
	    }
	    
	  })
	})

	app.get('/participant', (req, res, next) => {
	  db.query('SELECT * FROM main.participant', [], (err, data) => {
	    if (err) {
	      return next(err)
	    } else {
	    	res.send(data.rows)
	    }
	    
	  })
	})


	app.post('/conference/create', (req, res, next) => {
		let name = req.body.name
		let contents = req.body.contents
		let start_date = req.body.start_date
		let end_date = req.body.end_date
		let owner = req.body.owner
		let participants = req.body.participants
		return db.query('INSERT INTO main.conference (name,contents,start_date,end_date,owner,uid) VALUES ($1, $2, $3, $4, $5, uuid_generate_v4()) RETURNING uid', [name,contents,start_date,end_date,owner], (err, data) => {
	    	if (err) {
	    		console.log(err);
	    		res.send({success: false})
	    	} else {
	    		let seq = "";
	    		for (var participant of participants) {
	    			// seq+=`INSERT INTO main.participant (conference_uid,user_uid) VALUES ('${data.rows[0].uid}','${participant}');`
	    			seq+=`INSERT INTO main.participant (conference_uid,user_uid) VALUES ('${data.rows[0].uid}',(SELECT uid FROM main.user WHERE email='${participant}'));`
	    		}
	    		console.log(seq)
	    		return db.query(seq, [], (err, data) => {
	    			if (err) {
	    				console.log(err);
				      	res.send({success: false})
				    } else {
				    	res.send({success: true})
				    }
	    		})
	    		// console.log(data.rows[0].uid)
	    		// res.send({success: true})
	    	}
	    	
	  		})
	})	

	// app.post('/user/login', (req, res, next) => {
	// 	let email = req.body.email
	// 	let password = req.body.password
	//   	db.query('SELECT * FROM main.user WHERE email = $1', [email], (err, data) => {
	//     if (err) {
	//       return next(err)
	//     }
	//     if(data.rowCount==0) {
	//     	res.status(200).json({success: false, msg: '일치하는 계정이 존재하지 않습니다.'})
	//     } else {
	//     	return bcrypt.compare(password, data.rows[0].password, function(err, result) {
	// 		    if (result == true) {
	// 		    	res.status(200).json({success: true})
	// 		    } else {
	// 		    	res.status(200).json({success: false, msg: '비밀번호가 일치하지 않습니다.'})
	// 		    }
	// 		});
	//     } 
	   	
	//   })
	// })
}
