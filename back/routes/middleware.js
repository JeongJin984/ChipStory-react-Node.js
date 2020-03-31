const multer = require('multer')
const path = require('path')
const AWS = require('aws-sdk')
const multerS3 = require('multer-s3')
const express = require('express')

const prod = process.env.NODE_ENV === 'production'

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

const uploadMulter = prod ? {
    storage: multerS3({
      s3: new AWS.S3(),
      bucket: 'mychipstorybucket',
      key(req, file, cb) {
        cb(null, `original/${+new Date()}${path.basename(file.originalname)}`)
      }
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
  } : {
    storage: multer.diskStorage({
      destination(req, file, done) {
        done(null, 'uploads');
      },
      filename(req, file, done) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext); // asdf.png, ext===.png, basename===asdf
        done(null, basename + new Date().valueOf() + ext);
      }
    })
  }

  const profileMulter = prod ? {
    storage: multerS3({
      s3: new AWS.S3(),
      bucket: 'mychipstorybucket',
      key(req, file, cb) {
        cb(null, `profileImage/${+new Date()}${path.basename(file.originalname)}`)
      }
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
  }
  : {
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
  } 

exports.upload = multer(
  uploadMulter
)

exports.addProfileImage = multer(
  profileMulter
)