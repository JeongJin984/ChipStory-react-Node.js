const express = require('express')
const router = express.Router()
const db = require('../models')
const { isLoggedIn, upload }  = require('./middleware')
const multer = require('multer')
const path = require('path')
// ->/api/post

const prod = process.env.NODE_ENV === 'production' 

router.post('/', isLoggedIn, upload.none(), async (req, res) => {
	try {
		const hashtags = req.body.content.match(/#[^\s]+/g)
	  const newPost =	await db.Post.create({
			content: req.body.content,
			UserId: req.user.id
		})
		if (hashtags) {
			const result = await Promise.all( 
				hashtags.map( tag => db.Hashtag.findOrCreate({
					where: { name: tag.slice(1).toLowerCase() }
				}))
			)
			await newPost.addHashtags(result.map( r => r[0] ))
		}
		if(req.body.image) {
			if(Array.isArray(req.body.image)) { // 	multer => image: [1,2,3] or image: 1
				const image = await Promise.all(req.body.image.map((image) => {
					return db.Image.create({src: image})
				}))
				await newPost.addImages(image)
			} else {
				const image = await db.Image.create({src: req.body.image})
				console.log('zxcv',newPost)
				await newPost.addImage(image)
			}
		}
		const fullPost = await db.Post.findOne({
			where: { id: newPost.id },
			include: [{
				model: db.User
			}, {
				model: db.Image
			}]
		})
		res.json(fullPost)
	} catch (error) {
		console.log(error)
	}
})

router.post('/images', upload.array('image'), (req, res) => {
	console.log(req.files)
	res.json(req.files.map(v => prod ? v.location : v.filename))
})
router.get('/:id/comments', async (req, res, next) => {
	try {
		const post = await db.Post.findOne({ where: { id: req.params.id }})
		if(!post) {
			return res.status(404).send('No Post')
		}
		const comment = await db.Comment.findAll({
			where: {
				PostId: req.params.id
			},
			order: [['createdAt', 'ASC']],
			include: [{
				model: db.User,
				attributes: ['id', 'userId']
			}]
		})
		return res.json(comment)
	} catch (error) {
		return next(error)
	}
})
router.post('/:id/comment', isLoggedIn, async (req, res ,next) => {
	try {
		if(!req.user) {
			return res.status(401).send('PLZ LOGIN!!')
		}
		const post = await db.Post.findOne({
			where: { id: req.params.id }
		})
		if(!post) {
			return res.status(404).send('No Post')
		}
		const newComment = await db.Comment.create({
			PostId: post.id,
			UserId: req.user.id,
			content: req.body.content
		})
		await post.addComment(newComment.id) 
		const comment = await db.Comment.findOne({
			where: {
				id: newComment.id,
			},
			include: [{
				model:db.User,
				attributes: ['id', 'userId']
			}]
		})
	 	return res.json(comment)
	} catch (error) {
		console.log(error)
		return next(error)
	}
})

router.post('/:id/like', isLoggedIn, async (req, res , next) => {
	try {
		const post = await db.Post.findOne({ where: { id: req.params.id }})
		if(!post) {
			return res.status(401).send('no Post!!')
		}
		await post.addLiker(req.user.id)
		res.json({ userId: req.user.id })
	} catch (error) {
		console.error(error)
		next(error)
	}
})

router.delete('/:id/unlike', isLoggedIn, async (req, res , next) => {
	try {
		const post = await db.Post.findOne({ where: { id: req.params.id }})
		 if(!post) {
			 return res.status(401).send('no Post!!')
		 }
		 await post.removeLiker(req.user.id)
		 res.json({ userId: req.user.id })
	} catch (error) {
		console.error(error)
		next(error)
	}
})

router.delete('/:id/remove', isLoggedIn, async (req, res, next) => {
	try {
		const post = await db.Post.findOne({ 
			where: { id: req.params.id },
			include: [{
				model: db.Image
			}, {
				model: db.Comment
			}]
		})
		await Promise.all(post.Images.map(image => image.destroy())) 
		await Promise.all(post.Comments.map(comment => comment.destroy()))
		await post.destroy()
		res.send(req.params.id)
	} catch (error) {
		console.error(error)
		next(error)
	}
})
module.exports = router