const multer = require('multer')
const path = require('path')
const AWS = require('aws-sdk')
const multerS3 = require('multer-s3')
const express = require('express')

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
})

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
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'mychipstorybucket',
    key(req, file, cb) {
      cb(null, `original/${+new Date()}${path.basename(file.originalname)}`)
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
})

exports.addProfileImage = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'mychipstorybucket',
    key(req, file, cb) {
      cb(null, `profileImage/${+new Date()}${path.basename(file.originalname)}`)
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
})