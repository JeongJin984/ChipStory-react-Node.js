import React, { useEffect } from 'react'
import { useDispatch, useSelector} from 'react-redux'

import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import LoginForm from '../components/LoginForm';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';

const Home = () => {
	const { mainPosts, hasMoreMainPosts } = useSelector(state => state.post) 
	const { isLoggedIn } = useSelector(state => state.user)
	const dispatch = useDispatch()

	const onScroll = () => {
		let temp = window.scrollY + document.documentElement.clientHeight === document.documentElement.scrollHeight
		if(temp && hasMoreMainPosts) {
			console.log('active')
			dispatch({
				type: LOAD_MAIN_POSTS_REQUEST,
				lastId: mainPosts[mainPosts.length-1].id
			})
		} 
	}

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length, hasMoreMainPosts]);

	return(
		<div>
			{isLoggedIn ? 
				<PostForm/> :
				<LoginForm/>
			}
			{isLoggedIn && mainPosts.map( (c) => {
				return (
					<PostCard key={c.createdAt} post={c}/>
				)
			})}
		</div>
	)
}

Home.getInitialProps = async (context) => {
	context.store.dispatch({
		type: LOAD_MAIN_POSTS_REQUEST,
		lastId: 0
	})
}

export default Home

