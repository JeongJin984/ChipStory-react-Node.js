import React, { useState, useCallback, memo } from 'react'
import { useInput } from './AppLayout'
import Link from 'next/link'

import { Card, Button, Avatar, Form, Input, List, Comment, Carousel } from 'antd';
import { HeartOutlined, TwitterOutlined, MessageOutlined, HeartTwoTone } from '@ant-design/icons'

import { useDispatch, useSelector } from 'react-redux';
import { ADD_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST, UNLIKE_POST_REQUEST, LIKE_POST_REQUEST, REMOVE_POST_REQUEST } from '../reducers/post';

import PostImages from './PostImages'
import { UNFOLLOW_USER_REQUEST, FOLLOW_USER_REQUEST } from '../reducers/user';

const postCard = memo( ({ post }) => {
	const dispatch = useDispatch()
	const [commentFormOpened, setCommentFormOpened] = useState(false)

	const onClickOpenCommentButton = useCallback(
		() => {
			setCommentFormOpened(prev => !prev)
			if(!commentFormOpened) { 
				dispatch({
					type: LOAD_COMMENTS_REQUEST,
					data: post.id
				})
			}
		},
		[commentFormOpened],
	)

	const { me } = useSelector(state => state.user)

	const onSubmitCommentForm = useCallback(
		(value) => {
			console.log('value: ', value)
			dispatch({
				type: ADD_COMMENT_REQUEST,
				data: {
					postid: post.id,
					content: value.content 
				}
			})
		},
		[me && me.id],
	)

	const liked = post.Likers && post.Likers.find(v => v.id === me.id)

	const onClickToggleLike = useCallback(
		() => {
			if(!me) {
				return alert('PLZ LOG IN!!!')
			} 
			if(liked) {
				dispatch({
					type: UNLIKE_POST_REQUEST,
					data: post.id
				})
			} else {
				dispatch({
					type: LIKE_POST_REQUEST,
					data: post.id
				})
			}
		},
		[me && 	me.id, post && post.id, liked],
	)

	const followed = me.Followings && me.Followings.find(v => v.id === post.User.id)

	const onClickFollowButton = useCallback(
		() => {
			if(!me) {
				return alert('PLZ LOG IN!!!')
			}
			if(followed) {
				dispatch({
					type: UNFOLLOW_USER_REQUEST,
					data: post.User.id
				})
			} else {
				dispatch({
					type: FOLLOW_USER_REQUEST,
					data: post.User.id
				})
			}
		},
		[followed, post && post.User.id, me && me.Followings],
	)

	const onClickRemoveButton = useCallback(
		() => {
			dispatch({
				type: REMOVE_POST_REQUEST,
				data: post.id
			})
		},
		[],
	)

	return(
		<div>
			<Card
				key={+post.createdAt}
				style={{ marginTop: '10px' }}
				cover={ post.Images[0] &&
					<PostImages images={post.Images} index={0}/>
				}
				title={<span style={{ fontFamily: 'Fredoka One, cursive', fontSize: 20 }}>{post.User.userId}</span>}
				actions={[
					<TwitterOutlined type="retweet" key="retweet" />,
					liked ? 
						<HeartTwoTone twoToneColor="#eb2f96" onClick={onClickToggleLike}/> :
						<HeartOutlined type="heart" key="heart" onClick={onClickToggleLike} />
          ,	
          <MessageOutlined type="message" key="message" onClick={onClickOpenCommentButton}/>
				]}
				extra={ post.User.id === me.id ?
									<Button onClick={onClickRemoveButton}>Remove</Button> :
									followed ?
										<Button onClick={onClickFollowButton} >UnFollow</Button> :
										<Button onClick={onClickFollowButton}>Follow</Button>}>
        <Card.Meta
					avatar={<Link 
										href={{ pathname:'/user', query:{ id: post.User.id } }}   
									>
										<a><Avatar>{post.User.userId[0]}</Avatar></a>
									</Link> }
          title={post.User.userId}
          description={<span>{post.content.split(/(#[^\s]+)/g).map( v => {
						if(v.match(/#[^\s]+/)) {
							return (
								<Link 
									key={v} 
									href={{ pathname: '/hashtag', query: {tag: v.slice(1)} }} 
									as={`/hashtag/${v.slice(1)}`}
								>
									<a>{v}</a>
								</Link>
							)
						} return v 
					})}</span>}
        />
			</Card>
			{commentFormOpened &&  
				<div>
					<Form onFinish={onSubmitCommentForm}>
						<Form.Item noStyle name='content' >
							<div style={{display:'flex', justifyContent: 'sapce-between', border: '1px solid #dfe6e9'}}>
								<Input placeholder="input with clear icon" allowClear style={ {border: 'none'}}/>	
								<Button type="link" htmlType="submit">Post</Button>
							</div>
						</Form.Item>
					</Form>

					<List
						header={`${post.Comments ? post.Comments.length : 0} 댓글`}
						itemLayout="horizontal"
						dataSource={post.Comments || []}
						renderItem={item => (
							<li>
								<Comment
									author={item.User.userId}
									avatar={<Link 
														href={{ pathname:'/user', query:{id: item.User.id}}}
													>
														<a><Avatar>{item.User.userId[0]}</Avatar></a>
													</Link>}
									content={item.content}
								/>
							</li>
						)}
					/>
				</div>
			}
		</div>
	)
})

export default postCard