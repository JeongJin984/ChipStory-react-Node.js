import React, { useState, useEffect, useRef, useCallback } from 'react'
import {LeftCircleOutlined, RightCircleOutlined} from '@ant-design/icons';
import { Carousel } from 'antd'
import PropTypes from 'prop-types'

const PostImages =  ( {images} ) => {
	
	const [imageIndex, setImageIndex] = useState(0)
	

	const onClickImage = useCallback(
		(direction) => (e) => {
			e.preventDefault()
			console.log(direction)
			console.log()
			if(direction) {
				if(imageIndex !== 0) {
					setImageIndex(prev => prev - 1)
				}
			} else {
				if(imageIndex !== images.length - 1) {
					setImageIndex(prev => prev + 1)
				}
			}
		},
		[imageIndex],
	)

	if(!images) {
		return(
			null
		)
	}
	if(images.length === 1) {
		return (
			<img src={`${images[0].src}`}/>
		)
	} else {
		return (
			<Carousel>
				{images.map( (v, i) => (
					<img src={`${v.src}`}/>
				))}
			</Carousel>
				
		)
	}
}

export default PostImages