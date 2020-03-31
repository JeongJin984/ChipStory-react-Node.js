export const initialState = {
	isLoggedIn: false,
	isLoggingIn: false,
	isLoggingOut: false,

	logInErrorReason: '',
	logOutErrorReason: '',
	loadUserErrorReason: '',

	isLoadingData: false,

	isSignedUp: false,
	isSigningUp: false,
	signUpErrorReason: '',
	userChecked: false,

	me: null,
	userInfo: null,
	ProfileImages: []
	
}

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST'
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS'
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE'

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST'
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS'
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE'

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST'
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS'
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE'

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST'
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS'
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE'

export const LOAD_FOLLOW_REQUEST = 'LOAD_FOLLOW_REQUEST'
export const LOAD_FOLLOW_SUCCESS = 'LOAD_FOLLOW_SUCCESS'
export const LOAD_FOLLOW_FAILURE = 'LOAD_FOLLOW_FAILURE'

export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST'
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS'
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE'

export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST'
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS'
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE'

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST'
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS'
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE'

export const ADD_PROFILE_IMAGE_REQUEST = 'ADD_PROFILE_IMAGE_REQUEST'
export const ADD_PROFILE_IMAGE_SUCCESS = 'ADD_PROFILE_IMAGE_SUCCESS'
export const ADD_PROFILE_IMAGE_FAILURE = 'ADD_PROFILE_IMAGE_FAILURE'

export const MODIFY_PROFILE_REQUEST = 'MODIFY_PROFILE_REQUEST'
export const MODIFY_PROFILE_SUCCESS = 'MODIFY_PROFILE_SUCCESS'
export const MODIFY_PROFILE_FAILURE = 'MODIFY_PROFILE_FAILURE'

export const MODIFY_INTRODUCTION_SUCCESS = 'MODIFY_INTRODUCTION_SUCCESS'

export const REMOVE_PROFILE_IMAGE = 'REMOVE_PROFILE_IMAGE'

export const ADD_POSTS_TO_ME = 'ADD_POST_TO_ME'

export const NO_MODIFY_PROFILE = 'NO_MODIFY_PROFILE'

export default (state = initialState, action) => {
	switch(action.type) {
		case LOG_IN_REQUEST: {
			return {
				...state,
				isLoggingIn: true,
			}
		}
		case LOG_IN_SUCCESS: {
			return {
				...state,
				isLoggingIn: false,
				isLoggedIn: true,
				me: action.data,
				isLoadingData: true,
				logInErrorReason: null
			}
		}
		case LOG_IN_FAILURE: {
			return {
				...state,
				isLoggingIn: false,
				logInErrorReason: action.error
			}
		}
		case LOG_OUT_REQUEST: {
			return {
				...state,
				isLoggingout: true,
			}
		}
		case LOG_OUT_SUCCESS: {
			return {
				...state,
				isLoggingOut: false,
				isLoggedIn: false,
				logInErrorReason: null,
				me: null,
			}
		}
		case LOG_OUT_FAILURE: {
			return{
				...state,
				isLoggingOut: false,
				isLoggedOut: false,
				logOutErrorReason: action.error
			}
		}
		case SIGN_UP_REQUEST: {
			return {
				...state,
				isSigningUp: true
			}
		}
		case SIGN_UP_SUCCESS: {
			return {
				...state,
				isSigningUp: false,
				isSignedUp: true,
				userChecked: true
			}
		}
		case SIGN_UP_FAILURE: {
			return {
				...state,
				isSigningUp: false,
				signUpErrorReason: action.error
			}
		}
		case LOAD_USER_REQUEST: {
			return {
				...state,
				isLoggingIn: true
			}
		}
		case LOAD_USER_SUCCESS: {
			if(action.me) {
				return {
					...state,
					isLoggingIn: false,
					isLoggedIn: true,
					me: action.data
				}
			} return {
				...state,
				userInfo: action.data
			}
			
		}
		case LOAD_USER_FAILURE: {
			return {
				...state,
				isLoggingIn: false,
				isLoggedIn: false,
				loadUserErrorReason: action.error
			}
		}
		case FOLLOW_USER_REQUEST:{
			return {
				...state,
			}
		}
		case FOLLOW_USER_SUCCESS:{
			return {
				...state,
				me: {
					...state.me,
					Followings: [
						...state.me.Followings, {
							id:action.data.userid,
							userId: action.data.userId
						}
					]
				}
			}
		}
		case FOLLOW_USER_FAILURE:{
			return {
				...state,
			}
		}

		case UNFOLLOW_USER_REQUEST:{
			return {
				...state,
			}
		}
		case UNFOLLOW_USER_SUCCESS:{
			return {
				...state,
				me: {
          ...state.me,
          Followings: state.me.Followings.filter(v => v.id !== action.data.userid),
        }
			}
		}
		case UNFOLLOW_USER_FAILURE:{
			return {
				...state,
				unfollowErrorReason: action.error
			}
		}
		case ADD_POSTS_TO_ME: {
			return {
				...state,
				me: {
					...state.me,
					Posts: [{ id: action.data }, ...state.me.Posts]
				}
			}
		}
		case ADD_PROFILE_IMAGE_REQUEST: {
			return{
				...state,
			}
		}
		case ADD_PROFILE_IMAGE_SUCCESS: {
			return{
				...state,
				ProfileImages: [action.data,...state.ProfileImages]
			}
		}
		case ADD_PROFILE_IMAGE_FAILURE: {
			return{
				...state,
				error: action.error
			}
		}
		case REMOVE_PROFILE_IMAGE: {
			return{
				...state,
				ProfileImages: state.ProfileImages.filter((v, i) => i !== action.index)
			}
		}
		case MODIFY_PROFILE_REQUEST: {
			return {
				...state,
				modifyProfile: false
			}
		}
		case MODIFY_PROFILE_SUCCESS: {
			return {
				...state,
				me: {
					...state.me,
					ProfileImages: [...state.me.ProfileImages,action.data.ProfileImages,],
				},
				modifyProfile: true,
				ProfileImages:[]
			}
		}
		case MODIFY_INTRODUCTION_SUCCESS: {
			return {
				...state,
				me:{
					...state.me,
					introduction: action.data.introduction
				},
				modifyProfile: true,
				ProfileImages:[]
			}
		}
		case MODIFY_PROFILE_FAILURE: {
			return {
				...state,
				modifyProfile: true
			}
		}
		default: {
			return{
				...state
			}
		}
	}
}