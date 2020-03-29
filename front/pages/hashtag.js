import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import fetch from 'node-fetch'
import { useDispatch, useSelector } from 'react-redux'
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post'
import PostCard from '../components/PostCard'

const hashtag = ({ tag }) => {
	const dispatch = useDispatch()
	const { hashtagPosts, hasMoreHashtagPosts } = useSelector(state => state.post) 

	const onScroll = () => {
		let temp = window.scrollY + document.documentElement.clientHeight === document.documentElement.scrollHeight
		const lastid = hashtagPosts.length-1
		if(temp && hasMoreHashtagPosts) {
			dispatch({
				type: LOAD_HASHTAG_POSTS_REQUEST,
				data: tag,
				lastId: hashtagPosts[lastid].id
			})
		} 
	}

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hashtagPosts.length, hasMoreHashtagPosts]);


	return(
		<div>
			{hashtagPosts.map( (c) => {
				return (
					<PostCard key={c.createdAt} post={c}/>
				)
			})}
		</div>
	)
}

hashtag.propTypes = {
	tag: PropTypes.string.isRequired
}

hashtag.getInitialProps = async ( context ) => {
	const tag = context.query.tag 
	context.store.dispatch({
		type: LOAD_HASHTAG_POSTS_REQUEST,
		data: tag,
		lastId: 0
	})
	return { tag: tag }
}

export default hashtag