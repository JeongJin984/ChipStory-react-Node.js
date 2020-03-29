const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const passport = require('passport')
const { isLoggedIn, addProfileImage } = require('./middleware')
 
router.get('/', async (req, res) => {
	if(!req.user) {
		return res.status(401).send('PLEASE LOGIN FIRST!!!')
	}
	const user = Object.assign({}, req.user.toJSON())
	const fullUser = await db.User.findOne({
		where: { id: user.id},
		include: [{
			model: db.Post,
			as: 'Posts',
			attributes: [ 'id' ]
		}, {
			model: db.User,
			as: 'Followings',
			attributes: [ 'id', 'userId' ]
		}, {
			model: db.User,
			as: 'Followers',
			attributes: [ 'id', 'userId' ]
		}, {
			model: db.ProfileImage,
			attributes: ['src']
		}],
		attributes: ['id', 'name', 'userId', 'introduction']
	})
	res.json(fullUser) 
})
router.post('/', async (req, res) => {
  try {
    const exUser = await db.User.findOne({
      where: {
        email: req.body.email,
      }
    })
    if(exUser) {
      return res.status(403).send('Using Id') 
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    const newUser = await db.User.create({
      name: req.body.name,
      userId: req.body.userId,
			password: hashedPassword,
			email: req.body.email,
			age: req.body.age,
			website: req.body.website,
			introduction: req.body.introduction
		})
    return res.status(200).json(newUser)
  } catch (e) {
    console.error(e)
  }
})
router.get('/:id', async (req, res, next) => {
	const user = await db.User.findOne({
		where: { id: parseInt(req.params.id, 10)},
		attributes: [ 'id', 'userId'],
		include: [{
			model: db.Post,
			as: 'Posts',
			attributes: ['id']
		}, {
			model: db.User,
			as: 'Followings',
			attributes: ['id', 'userId']
		}, {
			model: db.User,
			as: 'Followers',
			attributes: ['id', 'userId']
		}, {
			model: db.User,
			through: 'Like',
			as: 'Likers',
			attributes: ['id']
		}]
	})
	jsonUser = user.toJSON()
	jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0
	jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0
	jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0
	res.json(jsonUser)
})
router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('logout 성공');
})
router.post('/login', (req, res, next) => { 
	passport.authenticate('local', (err, user, info) => {
		if(err) {
			console.log(err)
			return next(err)
		}
		if(info) {
			return res.status(404).send(info.reason)
		}
		return req.login(user, async (loginErr) => {
			try {
				if(loginErr){
					return next(loginErr)
				}
				
				const fullUser = await db.User.findOne({
					where: { id: user.id},
					include: [{
						model: db.Post,
						as: 'Posts',
						attributes: [ 'id' ]
					}, {
						model: db.User,
						as: 'Followings',
						attributes: [ 'id', 'userId' ]
					}, {
						model: db.User,
						as: 'Followers',
						attributes: [ 'id', 'userId' ]
					}, {
						model: db.ProfileImage,
						attributes: ['src']
					}, ],
					attributes: ['id', 'name', 'userId', 'introduction']
				})
				return res.json(fullUser)
			} catch (error) {
				
			}
		})
	})(req, res, next)
})
router.get('/:id/follow', (req, res) => {

})
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
	try {
		const me = await db.User.findOne({ 
			where: { id: req.user.id }
		})
		await me.addFollowing(req.params.id)
		const sendMe = await db.User.findOne({
			where: { id: req.params.id },
			attributes: ['id', 'userId']
		})
		res.json(sendMe)
	} catch (error) {
		console.error(error)
		next(error)
	}

})
router.delete('/:id/unfollow',isLoggedIn, async (req, res, next) => {
	try {
		const me = await db.User.findOne({ 
			where: { id: req.user.id }
		})
		await me.removeFollowing(req.params.id)
		const sendMe = await db.User.findOne({
			where: { id: req.params.id },
			attributes: ['id', 'userId']
		})
		res.json(sendMe)
	} catch (error) {
		console.error(error)
		next(error)
	}
})
router.get('/:id/follow', (req, res) => {
  
})
router.get('/:id/follower', (req, res) => {
  
})
router.get('/:id/posts', async (req, res, next) => {
	try {
		let where = {}
		if(parseInt(req.query.lastId, 10)) {
			where = {
				UserId: parseInt(req.params.id, 10),
				RetweetId: null,
				id: {
					[db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10)
				}
			}
		} else {
			where = {
				UserId: parseInt(req.params.id, 10),
				RetweetId: null,
			}
		}
    const posts = await db.Post.findAll({
      where: where,
      include: [{
        model: db.User,
        attributes: ['id', 'userId'],
      }, {
        model: db.Image,
      }, {
        model: db.User,
        through: 'Like',
        as: 'Likers',
        attributes: ['id'],
			}],
			order: [['createdAt', 'DESC']],
			limit: parseInt(req.query.limit,10)
    });
    res.json(posts);
	} catch (error) {
	}
})
router.post('/images', addProfileImage.array('profileImage'), async (req, res, next) => {
	try {
		res.json(req.files.map(v => v.filename))
	} catch (error) {
		console.error(error)
		next(error)
	}
})
router.post('/profile', isLoggedIn, addProfileImage.none(), async (req, res, next) => {
	try {
		const User = await db.User.findOne({ where: {id: req.user.id }})
		if(!User) {
			return console.error('No User!!!')
		}
		if(req.body.profileImage) {
			if(Array.isArray(req.body.profileImage)) {
				const image = await Promise.all(req.body.profileImage.map(image => {
					return db.ProfileImage.create({src: req.body.profileImage})
				}))
				await User.addProfileImages(image)
			} else {
				const image = await db.ProfileImage.create({src: req.body.profileImage})
				await User.addProfileImage(image)
			}
		}
		User.introduction = req.body.introduction
		await User.save({ fields: ['introduction']})
		res.status(200).json({
			introduction: User.introduction,
			ProfileImages: {src: req.body.profileImage}
		})
	} catch (error) {
		console.error('error',error)
		next(error)
	}
})

module.exports = router