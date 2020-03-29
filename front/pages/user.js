import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post'

import { Skeleton, Switch, Card, Avatar, Button } from 'antd'
import { StarOutlined, CreditCardOutlined, SmileOutlined } from '@ant-design/icons'
const { Meta } = Card;

import { useDispatch, useSelector } from 'react-redux'
import { LOAD_USER_REQUEST } from '../reducers/user'

import PostCard from '../components/PostCard'

const IconText = ({ icon, text }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);

const user = ({ id }) => {
	const dispatch = useDispatch()
	const { userPosts, hasMoreUserPosts } = useSelector(state => state.post)
	const { userInfo } = useSelector(state => state.user)

	const onScroll = () => {
		let temp = window.scrollY + document.documentElement.clientHeight === document.documentElement.scrollHeight
		const lastid = userPosts.length - 1
		if(temp && hasMoreUserPosts) {
			console.log('active')
			dispatch({
				type: LOAD_USER_POSTS_REQUEST,
				data: id,
				lastId: userPosts[lastid].id
			})
		} 
	}

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [userPosts.length, hasMoreUserPosts]);

	return(
		<div>
			{userInfo ? 
				<div style={ {alignContent:"center", padding: 20} }>
					<Card
						actions={[
							<IconText icon={CreditCardOutlined} text={userInfo.Posts+' posts'} key="post"></IconText>,
							<IconText icon={StarOutlined} text={userInfo.Followings+' following'} key="following"></IconText>,
							<IconText icon={SmileOutlined} text={userInfo.Followers+' follower'} key="follower"></IconText>
						]}>
						<Skeleton loading={false} avatar active>
							<Meta
								avatar={
									<Avatar src={userInfo.userId[0]}/>
								}
								title={userInfo.userId}
								description={userInfo.introduction}
							/>
						</Skeleton>
					</Card>
				</div> :
				null}
			{userPosts.map(c => (
				<PostCard key={c.createdAt} post={c}/>
			))}
		</div>
	) 
}

user.propTypes = {
	id: PropTypes.number.isRequired
}

user.getInitialProps = async (context) => {
	const id = parseInt(context.query.id, 10)
	context.store.dispatch({
		type: LOAD_USER_REQUEST,
		data: id
	})
	context.store.dispatch({ 
		type: LOAD_USER_POSTS_REQUEST,
		data: id,
		lastId: 0
	})
	return { id: id } 
}

export default user