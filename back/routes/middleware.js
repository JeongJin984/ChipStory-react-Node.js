const multer = require('multer')
const path = require('path')

exports.isLoggedIn = (req, res ,next) => {
	if(req.isAuthenticated()) {
		next()
	} else {
		res.status(401).send('need LogIn')
	}
}

exports.isLoggedOut = (req, res ,next) => {
	if(!req.isAuthenticated()) {
		next()
	} else {
		res.status(401).send('User cannot access')
	}
}

exports.upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
			const basename = path.basename(file.originalname, ext); // asdf.png, ext===.png, basename===asdf
      done(null, basename + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
})

exports.addProfileImage = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'profileImage');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
			const basename = path.basename(file.originalname, ext); // asdf.png, ext===.png, basename===asdf
      done(null, basename + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
})