import React, { useCallback, useEffect, useState, useRef } from 'react'

import { Input, Button, Form } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post'
import { backURL } from '../config/config'

const { TextArea } = Input



const postForm = ( key, post ) => {

	const [text, setText] = useState('')
	const { isPostAdded, imagePaths } = useSelector(state => state.post)
	const dispatch = useDispatch()
	const imageInput = useRef()
	const [form] = Form.useForm()

	const onChangeImages = useCallback(
		(e) => {
			const imageFormData = new FormData()
			const array = []
			array.forEach.call(e.target.files, (f) => {
				imageFormData.append('image', f)
			})
			dispatch({
				type: UPLOAD_IMAGES_REQUEST,
				data: imageFormData
			})
		},
		[],
	)

	const onClickImageUpLoadButton = useCallback(
		() => { 
			imageInput.current.click()
		},
		[imageInput.current],
	) 
	
	const onClickRemoveImage = useCallback(
		(index) => () => {
			dispatch({
				type: REMOVE_IMAGE,
				index: index
			})
		},
		[],
	)

	const onFinishTextArea = useCallback(
		(value) => {
			const content = value.content
			if(!content || !content.trim()) {
				alert('Write Post!!!')
			} else {
				const formData = new FormData()
				imagePaths.forEach((i) => {
					formData.append('image', i)
				})
				formData.append('content', content)
				dispatch({
					type: ADD_POST_REQUEST,
					data: formData 
				})
			}
			form.resetFields()
		},
		[imagePaths, form],
	)
	return(
		<div>
			<Form form={form} onFinish={onFinishTextArea} encType="multipart/form-data" initialValues>
				<Form.Item name={["content"]}>
					<TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요?"/>
				</Form.Item>
				<div style={ { display: 'flex', justifyContent:'space-between', marginTop: -20} }>
					<input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
					<Button onClick={onClickImageUpLoadButton}>Image UpLoad</Button>
					<Button type='primary' htmlType="submit">Post</Button>
				</div>
				<div>
					{imagePaths.map( (v, i) => (
						<div key={v} style={{display: 'inline-block'}}>
							<img src={`${backURL}/${v}`} style={{width: '200px'}} alt={v} />
							<div>
								<Button onClick={onClickRemoveImage(i)}>Remove</Button>
							</div>
						</div>
					))}
				</div>
			</Form>
		</div>
	)
}

export default postForm