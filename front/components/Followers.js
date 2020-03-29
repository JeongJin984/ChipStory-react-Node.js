import React from 'react'
import { List, Typography } from 'antd';
import { useSelector } from 'react-redux';
import Link from 'next/link'

const followers = () => {
	const { me } = useSelector(state => state.user)
	const followings = me.Followings.map((v) => v['userId'])
	return(
		<div style={{ position: "fixed", marginLeft:25, marginTop:25, width:'250px'}}>
			<List
				size="small"
				header={<div style={{ fontWeight:'bold', marginLeft: 6}}>Followings</div>}
				bordered
				dataSource={followings}
				renderItem={item => (
					<Link 
						href={{
							pathname:'/user',
							query: { id: me.Followings.find( v => v.userId === item).id }
						}}>
						<List.Item style={{ marginLeft: 6, cursor:'pointer'}}>
							{item}
						</List.Item>
					</Link>
				)}
    	/>
		</div>
	)
}

export default followers