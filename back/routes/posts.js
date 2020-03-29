const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/', async (req, res, next) => {
  try {
		let where = {}
		if(parseInt(req.query.lastId, 10)) {
			where = {
				id: {
					[db.Sequelize.Op.lt]: parseInt(req.query.lastId,10)
				}
			}
		}
		const posts = await db.Post.findAll({
			where,
			include: [{
				model: db.User,
				attributes: ['id', 'userId']
			}, {
				model: db.Image
			}, {
				model: db.User,
				through: 'Like',
				as: 'Likers',
				attributes: ['id']
			}],
			order: [['createdAt', 'DESC']],
			limit: parseInt(req.query.limit,10)
		})
		res.json(posts)
	} catch (error) {
		next(error)
	}
})

module.exports = router