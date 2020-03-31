import React, { useRef, useCallback } from 'react'

import { Input, Button, Form } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { ADD_PROFILE_IMAGE_REQUEST, REMOVE_PROFILE_IMAGE, MODIFY_PROFILE_REQUEST } from '../reducers/user'
import { backURL } from '../config/config'

const { TextArea } = Input
const prod = (process.env.NODE_ENV === 'production')

const ProfileForm = () => {

	const imageInput = useRef()
	const dispatch = useDispatch()
	const { me, ProfileImages } = useSelector(state => state.user)
	const [form] = Form.useForm()

	const onChangeImages = useCallback(
		(e) => {
			const imageFromData = new FormData()
			const array=[]
			array.forEach.call(e.target.files, f => {
				imageFromData.append('profileImage',f)
			})
			dispatch({
				type: ADD_PROFILE_IMAGE_REQUEST,
				data: imageFromData
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
				type: REMOVE_PROFILE_IMAGE,
				index: index
			})
		},
		[],
	)

	const onFinishTextArea = useCallback(
		(values) => {
			let content = values.introduction
			console.log(content)
			if(!content || !content.trim()) {
				content = '-'
			}
			const formData = new FormData()
			ProfileImages.forEach(i => {
				formData.append('profileImage', i)
			})
			formData.append('introduction', content)
			dispatch({
				type: MODIFY_PROFILE_REQUEST,
				data: formData
			})
			form.resetFields()
		},
		[me && ProfileImages],
	)

	return(
		<div style={{marginTop: 20}}>
		<Form form={form} onFinish={onFinishTextArea} encType="multipart/form-data">
			<Form.Item name={["introduction"]}>
				<TextArea style={{ height: 50 }} placeholder='Input your Introduction'></TextArea>
			</Form.Item>
			<div style={ { display: 'flex', justifyContent:'space-between', marginTop: -20} }>
				<input type="file" multiple hidden ref={imageInput} onChange={onChangeImages}/>
				<Button onClick={onClickImageUpLoadButton}>Image UpLoad</Button>
				<Button type='primary' htmlType="submit">Post</Button>
			</div>
			<div>
				{ProfileImages.map( (v, i) => (
					<div key={v} style={{display: 'inline-block'}}>
						<img src={prod ? `${v}` : `${backURL}/profile/${v}`} style={{width: '200px'}} alt={v} />
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

export default ProfileForm