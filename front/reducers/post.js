import produce from 'immer'

export const initialState = {
	mainPosts: [],
	hashtagPosts: [],
	userPosts: [],
	imagePaths: [],
	
	isPostAdding: false,
	isPostAdded: false,
	
	addPostErrorReason: '',

	isCommentAdding: false,
	isCommentAdded: false,

	addCommentErrorReason: '',
	hasMoreMainPosts: true,
	hasMoreHashtagPosts: true,
	hasMoreUserPosts: true,
}

export const limit = 5

export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LOAD_COMMENTS_REQUEST = 'LOAD_COMMENTS_REQUEST';
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS';
export const LOAD_COMMENTS_FAILURE = 'LOAD_COMMENTS_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const POST_LOG_OUT_SUCCESS = 'POST_LOG_OUT_SUCCESS'

export default (state=initialState, action) => {
	return produce(state, (draft) => {
		switch (action.type) {
			case ADD_POST_REQUEST: {
				draft.isPostAdding = true
				draft.isPostAdded = false
				break
			}
			case ADD_POST_SUCCESS: {
				const	data = action.data
				data["User"] = action.data.User
				data['Comments'] = []
				draft.mainPosts.unshift(data) 
				draft.isPostAdding = false
				draft.isPostAdding = false,
				draft.isPostAdded = true,
				draft.imagePaths = []
				break
			}
			case ADD_POST_FAILURE: {
				draft.isPostAdding = false,
				draft.addPostErrorReason = action.error
				break
			}
			case REMOVE_POST_REQUEST: {
				break
			}
			case REMOVE_POST_SUCCESS: {
				const index = draft.mainPosts.findIndex((v, i) => v.id === action.data)
				draft.mainPosts.length === 1 ? draft.mainPosts = [] : draft.mainPosts.splice(index, 1)
				break
			}
			case ADD_COMMENT_REQUEST: {
				draft.isCommentAdding = true
			}
			case ADD_COMMENT_SUCCESS: {
				const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postid)
				console.log(action.data.comment)
				action.data.comment && draft.mainPosts[postIndex].Comments.push(action.data.comment)
				draft.isCommentAdding = false
				draft.isCommentAdded = true
				break
			}
			case ADD_COMMENT_FAILURE: {
				draft.isCommentAdding = false
				draft.addCommentErrorReason = action.error
				break
			}
			case LOAD_COMMENTS_REQUEST: {
				draft.isCommentAdding = true
				break
			}
			case LOAD_COMMENTS_SUCCESS: {
				draft.isCommentAdding = false
				const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postid)
				draft.mainPosts[postIndex].Comments = []
				action.data.comments.forEach(v => draft.mainPosts[postIndex].Comments.push(v))
				break
			}
			case LOAD_COMMENTS_FAILURE: {
				break
			}
			case LOAD_MAIN_POSTS_REQUEST:
			case LOAD_HASHTAG_POSTS_REQUEST:
			case LOAD_USER_POSTS_REQUEST:{
				draft.isPostAdding = true
				break
			}
			case LOAD_HASHTAG_POSTS_SUCCESS: {
				draft.isPostAdding = false
				draft.isPostAdded = true
				action.lastId ? 
					action.data.forEach(v => draft.hashtagPosts.push(v)) : 
					draft.hashtagPosts = action.data
				draft.hasMoreHashtagPosts = (action.data.length === limit)
				break
			}
			case LOAD_USER_POSTS_SUCCESS: {
				draft.isPostAdding = false
				draft.isPostAdded = true
				action.lastId ?
					action.data.forEach(v => draft.userPosts.push(v)) :
					draft.userPosts = action.data
				draft.hasMoreUserPosts = (action.data.length === limit)
				break
			}
			case LOAD_MAIN_POSTS_SUCCESS:{
				draft.isPostAdding = false
				draft.isPostAdded = true
				action.lastId ? 
					action.data.forEach(v => draft.mainPosts.push(v)) : 
					draft.mainPosts = action.data
				draft.hasMoreMainPosts = action.data.length === limit
				break
			}
			case LOAD_MAIN_POSTS_FAILURE:
			case LOAD_HASHTAG_POSTS_FAILURE:
			case LOAD_USER_POSTS_FAILURE:{
				draft.addPostErrorReason = action.error
				break
			}
			case UPLOAD_IMAGES_REQUEST: {
				break
			}
			case UPLOAD_IMAGES_SUCCESS: {
				action.data.forEach((image) => {
					draft.imagePaths.push(image)
				})
				break
			}
			case UPLOAD_IMAGES_FAILURE: {
				draft.uploadImageFailedReason = action.error
				break
			}
			case REMOVE_IMAGE: {
				const index = draft.imagePaths.findIndex((v,i) => i === action.index)
				draft.imagePaths.splice(index, 1)
				break
			}
			case LIKE_POST_REQUEST:{
				break
			}
			case LIKE_POST_SUCCESS:{
				const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId)
				action.data.userId && draft.mainPosts[postIndex].Likers.push({id: action.data.userId})
				break
			}
			case LIKE_POST_FAILURE:{
				break
			}
	
			case UNLIKE_POST_REQUEST:{
				break
			}
			case UNLIKE_POST_SUCCESS:{
				const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId)
				const likerIndex = state.mainPosts[postIndex].Likers.findIndex(v => v.id === action.data.userId)
				draft.mainPosts[postIndex].Likers.splice(likerIndex, 1)
				break
			}
			case UNLIKE_POST_FAILURE:{
				break
			}
			case POST_LOG_OUT_SUCCESS: {
				return initialState
			}
			default: {
				break
			}
		}
	})
}