import React, { useEffect } from 'react'

import { Form, Input, InputNumber, Button } from 'antd';
import { useInput } from '../components/AppLayout';
import { useDispatch, useSelector } from 'react-redux';
import { SIGN_UP_REQUEST } from '../reducers/user';
import Router from 'next/router';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: 'This field is required!',
  types: {
    email: 'Not a validate email!',
    number: 'Not a validate number!',
  },
  number: {
    range: 'Must be between ${min} and ${max}',
  },
};

const signUp = () => {
	
	const dispatch = useDispatch()
	const { me } = useSelector(state => state.user)

	const onFinish = values => {
		if(values.user.password === values.passwordCheck) {
			dispatch({
				type: SIGN_UP_REQUEST,
				data: values.user
			})
			alert('SignUp Completed!!!')
			Router.push('/')
		}
		else {
			alert('Not same password!!!')
		}
	}
	useEffect(() => {
		if(me) {
			alert('Already LogIned!!!')
			Router.push('/')
		}
		return () => {
		}
	}, [])

	return(
		<div style={{ marginTop: 30}}>
			<img src="https://tobaccobusiness.com/wp-content/uploads/2017/10/chip-logofc.jpg" style={{ width: 300, height: 100, marginLeft: 250}}></img>
			<Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
				<Form.Item 
					name={['user', 'name']} 
					label="Name" 
					rules={[{ required: true, message: 'Please input your name!'}]}>
					<Input />
				</Form.Item>
				<Form.Item
					label="ID"
					name={['user', 'userId']} 
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Password"
					name={['user', 'password']}
					rules={[{ required: true, message: 'Please input your password!' }]}
				>
					<Input.Password/>
				</Form.Item>
				<Form.Item
					label="Password-Check"
					name="passwordCheck"
					rules={[{ required: true, message: 'Please input your password!' }]}
				>
					<Input.Password/>
				</Form.Item>
				<Form.Item 
					name={['user', 'email']} 
					label="Email" 
					rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
					>
					<Input />
				</Form.Item>
				<Form.Item name={['user', 'age']} label="Age" rules={[{ type: 'number', min: 0, max: 99 }]}>
					<InputNumber />
				</Form.Item>
				<Form.Item name={['user', 'website']} label="Website">
					<Input />
				</Form.Item>
				<Form.Item name={['user', 'introduction']} label="Introduction">
					<Input.TextArea />
				</Form.Item>
				<Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default signUp