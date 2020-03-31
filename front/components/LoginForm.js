import React, { useCallback } from 'react'
import Link from 'next/link'

import { Button, Form, Input } from 'antd';
import styled from 'styled-components'
const LoginError = styled.div`
	color: red;
`;

import { useDispatch, useSelector } from 'react-redux';

import { useInput } from './AppLayout'
import { LOG_IN_REQUEST } from '../reducers/user';

const loginForm = () => {
	const layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
	};
	const tailLayout = {
		wrapperCol: { offset: 8, span: 16 },
	};

	const dispatch = useDispatch()
	
	const { isLoggingIn, logInErrorReason} = useSelector(state => state.user)

	const onSubmitForm = useCallback(
		(values) => {
			dispatch({
				type: LOG_IN_REQUEST,
				data: {
					userId: values.userId,
					password: values.password
				}
			})
		},
		[],
	)

	return(
		<div style={{ paddingLeft: 200 }}>
			<img src="https://tobaccobusiness.com/wp-content/uploads/2017/10/chip-logofc.jpg" style={{ marginLeft: -155 }}/>
			<Form
				onFinish={onSubmitForm}
    	>
				<Form.Item
					label="Username"
					name="userId"
					rules={[
						{ required: true, message: 'Please input your username!' },
					]}
				>
					<Input style={{ width: 350}}/>
				</Form.Item>
				<Form.Item
					label="Password"
					name="password"
					rules={[{ required: true, message: 'Please input your password!' }]}
				>
					<Input.Password style={{ width: 354}}/>
				</Form.Item>
				<Form.Item {...tailLayout} style={{ marginLeft: -60}}>
					<Button type="primary" htmlType="submit" style={ {marginRight: '15px' } }>
						Submit
					</Button>
					<Link href="/signup"><a><Button>SignUp</Button></a></Link>
				</Form.Item>
				<LoginError style={{ color: 'red', marginLeft: 100, marginTop: -20 }}>{logInErrorReason}</LoginError>
			</Form>
		</div>
	)
}

export default loginForm