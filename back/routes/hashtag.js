const express = require('express')
const db = require('../models')
const { isLoggedIn } = require('./middleware.js') 

const router = express.Router()

router.get('/:tag', async (req, res, next) => {
	try {
		let where = {}
		if(parseInt(req.query.lastId, 10)) {
			console.log('active')
			where = {
				id: {
					[db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10)
				}
			}
		}
		const posts = await db.Post.findAll({
			where: where,
			include: [{
				model: db.Hashtag,
				where: {
					name: decodeURIComponent(req.params.tag),
				}
      }, {
        model: db.User,
        attributes: ['id', 'userId'],
			}, {
				model: db.Image
			}, {
				model: db.User,
				through: 'Like',
				as: 'Likers',
				attributes: ['id']
			}],
			order: [['createdAt', 'DESC']],
			limit: parseInt(req.query.limit, 10)
		})
		console.log('qwer',posts)
		res.json(posts)
	} catch (error) {
		console.error(error)
		next(error) 
	}
})

module.exports=router