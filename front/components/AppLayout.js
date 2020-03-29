import React, { useCallback, useState, useEffect} from 'react'
import Link from 'next/link' 
import { Row, Col, Menu, Input } from 'antd'
import { HomeFilled } from '@ant-design/icons'

import LoginForm from './LoginForm'
import UserProfile from './UserProfile'
import Followers from './Followers'
import { useSelector, useDispatch } from 'react-redux'
import { LOAD_USER_REQUEST } from '../reducers/user'

export const useInput = (initialValue = null) => {
	const [value, setValue] = useState(initialValue)
	const handler = useCallback(
		(e) => {
			setValue(e.target.value)
		},
		[],
	)
	return [value, handler]
}

const AppLayout = ({ children }) => {
	const { isLoggedIn, me } = useSelector(state => state.user)

	return(
		<div>
			<Menu mode="horizontal">
				<Menu.Item key="Logo"><Link href='/'><a>Chip Story</a></Link></Menu.Item>
				<Menu.Item key="search" style={{ marginLeft: 250}}>
					<Input.Search style={{ verticalAlign: 'Middle', width:450}}></Input.Search>
				</Menu.Item>
				{isLoggedIn ?
					<Menu.Item key="home" style={{ marginLeft: 250 }}><Link href='/'><a><HomeFilled/></a></Link></Menu.Item>:
					null
				}
				{isLoggedIn ? 
					<Menu.Item key="profile"><Link href='/profile' prefetch><a>Profile</a></Link></Menu.Item> :
					null
				}
			</Menu>
			<Row gutter={8}>
				<Col span={5}>
					{isLoggedIn ? 
						<Followers/>:
						null}
				</Col>
				<Col span={11} style={{ padding: 25 }}>
					{children}
				</Col>
				<Col span={8} style={{ padding: 3 }}> 
					{isLoggedIn ? 
						<UserProfile/> :
						null}
				</Col>
			</Row>
		</div>
	)
}

export default AppLayout