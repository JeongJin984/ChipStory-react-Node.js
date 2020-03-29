import { delay, all, call, takeLatest, takeEvery, fork, put, throttle } from 'redux-saga/effects'
import axios from 'axios'

import {
	LOAD_MAIN_POSTS_REQUEST,
	LOAD_MAIN_POSTS_SUCCESS,
	LOAD_MAIN_POSTS_FAILURE,

	ADD_POST_REQUEST,
	ADD_POST_SUCCESS,
	ADD_POST_FAILURE,

	ADD_COMMENT_REQUEST,
	ADD_COMMENT_SUCCESS,
	ADD_COMMENT_FAILURE,

	LOAD_HASHTAG_POSTS_REQUEST,
	LOAD_HASHTAG_POSTS_SUCCESS,
	LOAD_HASHTAG_POSTS_FAILURE,

	LOAD_USER_POSTS_REQUEST,
	LOAD_USER_POSTS_SUCCESS,
	LOAD_USER_POSTS_FAILURE,

	LOAD_COMMENTS_REQUEST,
	LOAD_COMMENTS_SUCCESS,
	LOAD_COMMENTS_FAILURE,

	UPLOAD_IMAGES_REQUEST,
	UPLOAD_IMAGES_SUCCESS,
	UPLOAD_IMAGES_FAILURE,

	LIKE_POST_REQUEST,
	LIKE_POST_SUCCESS,
	LIKE_POST_FAILURE,

	UNLIKE_POST_REQUEST,
	UNLIKE_POST_SUCCESS,
	UNLIKE_POST_FAILURE,
	REMOVE_POST_REQUEST,
	REMOVE_POST_SUCCESS,
	REMOVE_POST_FAILURE,
} from '../reducers/post'

import { ADD_POSTS_TO_ME } from '../reducers/user'

import { limit } from '../reducers/post'

function addPostAPI(postData) {
	return axios.post('/post/', postData, {
		withCredentials: true
	})
}

function* addPost(action) {
	try {
		const response = yield call(addPostAPI, action.data)
		yield put({
			type: ADD_POST_SUCCESS,
			data: response.data
		})
		yield put({
			type: ADD_POSTS_TO_ME,
			data: response.data.id
		})
	} catch (error) {
		console.error(error)
		yield put({
			type: ADD_POST_FAILURE,
			error: error
		})
	}
}
 
function* watchAddPost() {
	yield throttle(1000, ADD_POST_REQUEST, addPost)
}

function addCommentAPI(data) {
	return axios.post(`/post/${data.postid}/comment`,{ content: data.content }, {
		withCredentials: true
	})
	.then(res => {
		return res
	})
	.catch(err => {
		console.error(err)
	})
}

function* addComment(action){
	try {
		const response = yield call(addCommentAPI, action.data)
		console.log(response)
		yield put({
			type: ADD_COMMENT_SUCCESS,
			data: {
				postid: action.data.postid,
				comment: response.data
			}
		})
	} catch (error) {
		console.log(error)
		yield put({
			type: ADD_COMMENT_FAILURE,
			error: error
		})
	}
}

function* watchAddComment(){
	yield takeLatest(ADD_COMMENT_REQUEST,addComment)
}

function loadMainPostsAPI(lastId) {
	return axios.get(`/posts?lastId=${lastId}&limit=${limit}`)
}

function* loadMainPosts(action) {
	try {
			const response = yield call(loadMainPostsAPI, action.lastId)
			yield put({
				type: LOAD_MAIN_POSTS_SUCCESS,
				data: response.data,
				lastId: action.lastId
			})
		} catch (error) {
		yield put({
			type: LOAD_MAIN_POSTS_FAILURE,
			error: error
		})
	}
}

function* watchLoadMainPosts() {
	yield takeEvery(LOAD_MAIN_POSTS_REQUEST ,loadMainPosts)
}

function loadHashtagPostsAPI(action) {
	return axios.get(`/hashtag/${encodeURIComponent(action.data)}?lastId=${action.lastId}&limit=${limit}`)
}
function* loadHashtagPosts(action) {
	try {
		const response = yield call(loadHashtagPostsAPI, action)
		yield put({
			type: LOAD_HASHTAG_POSTS_SUCCESS,
			data: response.data,
			lastId: action.lastId
		})
	} catch (error) {
		yield put({
			type: LOAD_HASHTAG_POSTS_FAILURE,
			error: error 			
		})
	}
}

function* watchLoadHashtagPosts() {
	yield takeEvery(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts)
}

function loadUserPostsAPI(action) {
  return axios.get(`/user/${action.data}/posts?lastId=${action.lastId}&limit=${limit}`);
}

function* loadUserPosts(action) {
  try {
		const response = yield call(loadUserPostsAPI, action)
		if(response) {
			yield put({
				type: LOAD_USER_POSTS_SUCCESS,
				data: response.data,
				lastId: action.lastId
			});
		}
  } catch (e) {
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserPosts() {
	yield takeEvery(LOAD_USER_POSTS_REQUEST, loadUserPosts)
}

function loadCommentsAPI(postid) {
	return axios.get(`/post/${postid}/comments`)
	.then(res => {
		return res
	})
	.catch(err => {
		console.error(err); 
	})
}

function* loadComments(action) {
	try {
		const response = yield call(loadCommentsAPI, action.data)
		console.log(response)
		yield put({
			type: LOAD_COMMENTS_SUCCESS,
			data: {
				postid: action.data,
				comments: response.data
			}
		})
	} catch (error) {
		yield put({
			type: LOAD_COMMENTS_FAILURE,
			error: error
		})
	}
}

function* watchLoadComments() {
	yield takeEvery(LOAD_COMMENTS_REQUEST, loadComments)
}

function upLoadImagesAPI(images) {
	return axios.post('/post/images',images, {
		withCredentials: true
	})
	.then(res => {
		console.log(res)
		return res
	})
	.catch(err => {
		console.error(err); 
	})
}

function* upLoadImages(action) {
	try {
		const response = yield call(upLoadImagesAPI,action.data)
		yield put({
			type: UPLOAD_IMAGES_SUCCESS,
			data: response.data
		})
	} catch (error) {
		yield put({
			type: UPLOAD_IMAGES_FAILURE,
			error: error
		})
	}

}

function* watchUpLoadImages() {
	yield takeLatest(UPLOAD_IMAGES_REQUEST, upLoadImages)
}

function likePostAPI(postId) {
	return axios.post(`/post/${postId}/like`, {}, {
		withCredentials: true
	})
}

function* likePost(action) {
	try {
		const response = yield call(likePostAPI, action.data);
		yield put({
			type: LIKE_POST_SUCCESS,
			data: {
				postId: action.data,
				userId: response.data.userId
			}
		})
	} catch (error) {
		yield put({
			type: LIKE_POST_FAILURE,
			error: error
		})
	}
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function unlikePostAPI(postId) {
	return axios.delete(`/post/${postId}/unlike`,{
		withCredentials: true
	})
}

function* unlikePost(action) {
	try {
		const response = yield call(unlikePostAPI, action.data)
		yield put({
			type: UNLIKE_POST_SUCCESS,
			data: {
				postId: action.data,
				userId: response.data.userId
			}
		})	
	} catch (error) {
		yield put({
			type: UNLIKE_POST_FAILURE,
			error: error
		})
	}
}

function* watchUnlikePost() {
	yield takeLatest(UNLIKE_POST_REQUEST, unlikePost)
}

function removePostAPI(postId) {
	return axios.delete(`/post/${postId}/remove`, {
		withCredentials: true
	})
}

function* removePost(action) {
	try {
		const response = yield call(removePostAPI, action.data)
		console.log(response.data)
		yield put({
			type: REMOVE_POST_SUCCESS,
			data: response.data
		})
	} catch (error) {
		yield put({
			type: REMOVE_POST_FAILURE,
			error: error
		})
	}
}

function* watchRemovePost() {
	yield takeLatest(REMOVE_POST_REQUEST, removePost)
}

export default function* postSaga() {
	yield all([
		fork(watchAddPost),
		fork(watchAddComment),
		fork(watchLoadMainPosts),
		fork(watchLoadHashtagPosts),
		fork(watchLoadUserPosts),
		fork(watchLoadComments),
		fork(watchUpLoadImages),
		fork(watchLikePost),
		fork(watchUnlikePost),
		fork(watchRemovePost)
	])
}