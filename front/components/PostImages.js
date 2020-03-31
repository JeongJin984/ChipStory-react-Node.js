import React, { useState, useEffect, useRef, useCallback } from 'react'
import {LeftCircleOutlined, RightCircleOutlined} from '@ant-design/icons';
import { Carousel } from 'antd'
import PropTypes from 'prop-types'
import { backURL } from '../config/config'

const prod = (process.env.NODE_ENV === 'production')

const PostImages =  ( {images} ) => {

	console.log(prod)
	if(!images) {
		return(
			null
		)
	}
	if(images.length === 1) {
		return (
			<img src={prod ? `${images[0].src}` : `${backURL}/${images[0].src}`}/>
		)
	} else {
		return (
			<Carousel>
				{images.map( (v, i) => (
					<img src={prod ? `${v.src}` : `${backURL}/${v.src}`}/>
				))}
			</Carousel>
		)
	}
}

export default PostImages