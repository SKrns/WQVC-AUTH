module.exports = function(app){
	
	app.get('/',function(req,res){
		let session = req.session;
		if(session.email) {
			res.render('main',{
        	session : session
   			})
		} else {
			res.render('index')
		}
		
	})

	// app.get('/main',function(req,res){
	// 	console.log(req.user)
	// 	res.render('main')
	// })
}