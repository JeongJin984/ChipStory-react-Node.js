import { call, all, fork, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'
import axios from 'axios'

import {
	LOG_IN_REQUEST,
	LOG_IN_SUCCESS,
	LOG_IN_FAILURE,

	SIGN_UP_REQUEST,
	SIGN_UP_SUCCESS,
	SIGN_UP_FAILURE,

	LOG_OUT_SUCCESS,
	LOG_OUT_FAILURE,
	LOG_OUT_REQUEST,

	LOAD_USER_SUCCESS,
	LOAD_USER_FAILURE,
	LOAD_USER_REQUEST,

	FOLLOW_USER_REQUEST,
	FOLLOW_USER_SUCCESS,
	FOLLOW_USER_FAILURE,
	
	UNFOLLOW_USER_REQUEST,
	UNFOLLOW_USER_SUCCESS,
	UNFOLLOW_USER_FAILURE,

	ADD_PROFILE_IMAGE_REQUEST,
	ADD_PROFILE_IMAGE_SUCCESS,
	ADD_PROFILE_IMAGE_FAILURE,

	MODIFY_PROFILE_REQUEST,
	MODIFY_PROFILE_SUCCESS,
	MODIFY_PROFILE_FAILURE,
	MODIFY_INTRODUCTION_SUCCESS,
	NO_MODIFY_PROFILE
}	from '../reducers/user'

function loginAPI(loginData) {
	return axios.post('/user/login', loginData, {
		withCredentials: true 
	})
}

function* login(action) {
	try {
		const response = yield call(loginAPI, action.data)
		yield put({
			type: LOG_IN_SUCCESS,
			data: response.data
		})
	} catch (error) {
		yield put({
			type: LOG_IN_FAILURE,
			error: error.response.data
		})
	}
}

function* watchLogin() {
	yield takeLatest(LOG_IN_REQUEST, login)
}

function signUpAPI(signUpData) {
	return axios.post('/user/', signUpData)
}

function* signUp(action) {
	try {
		const response = yield call(signUpAPI, action.data)
		console.dir(response)
		yield put({
			type: SIGN_UP_SUCCESS
		})
	} catch (error) {
		yield put({
			type: SIGN_UP_FAILURE,
			error: response.data.error
		})		
	}
}

function* watchSignUp() {
	yield takeLatest(SIGN_UP_REQUEST, signUp)
}

function logoutAPI() {
	return axios.post('/user/logout', {}, {
		withCredentials: true
	})
}

function* logout() {
	try {
		yield call(logoutAPI)	
		yield put({
			type: LOG_OUT_SUCCESS
		})
	} catch (error) {
		yield put({
			type: LOG_OUT_FAILURE,
			error: error
		})
	}
}

function* watchLogout() {
	yield takeLatest(LOG_OUT_REQUEST, logout)
}

function loadUserAPI(userId) {
	return axios.get( userId ? `/user/${userId}` : '/user/', {
		withCredentials: true
	})
}

function* loadUser(action) {
	try {
		const response = yield call(loadUserAPI, action.data)
		yield put({
			type:LOAD_USER_SUCCESS,
			data: response.data,
			me: !action.data
		})
	} catch (error) {
		yield put({
			type: LOAD_USER_FAILURE,
			error: error
		})
	}
}

function* watchLoadUser() {
	yield takeLatest(LOAD_USER_REQUEST, loadUser)
}

function followUserAPI(userid) {
	return axios.post(`/user/${userid}/follow`, {}, {
		withCredentials: true
	})
}

function* followUser(action) {
	try {
		const response = yield call(followUserAPI, action.data)
		console.log(response)
		yield put({
			type: FOLLOW_USER_SUCCESS,
			data: {
				userid: response.data.id,
				userId: response.data.userId
			}
		})
	} catch (error) {
		yield put({
			type: FOLLOW_USER_FAILURE,
			error: error
		})
	}
}

function* watchFollowUser() {
	yield takeLatest(FOLLOW_USER_REQUEST, followUser)
}

function unfollowUserAPI(userid) {
	return axios.delete(`/user/${userid}/unfollow`, {
		withCredentials: true
	})
}

function* unfollowUser(action) {
	try {
		const response = yield call(unfollowUserAPI, action.data)
		console.log(response)
		yield put({
			type: UNFOLLOW_USER_SUCCESS,
			data: {
				userid: response.data.id,
				userId: response.data.userId
			}
		})
	} catch (error) {
		yield put({
			type: UNFOLLOW_USER_FAILURE,
			error: error
		})
	}
}

function* watchUnfollowUser() {
	yield takeLatest(UNFOLLOW_USER_REQUEST, unfollowUser)
}

function addProfileImageAPI(images) {
	return axios.post(`/user/images`, images, {
		withCredentials: true
	})
}

function* addProfileImage(action) {
	try {
		const response = yield call(addProfileImageAPI, action.data)
		yield put({
			type: ADD_PROFILE_IMAGE_SUCCESS,
			data: response.data
		})
	} catch (error) {
		yield put({
			type: ADD_PROFILE_IMAGE_FAILURE,
			error: error
		})
	}
}

function* watchAddProfileImage() {
	yield takeLatest(ADD_PROFILE_IMAGE_REQUEST, addProfileImage)
}

function modifyProfileAPI(profileData) {
	return axios.post(`/user/profile`, profileData, {
		withCredentials: true
	})
}

function* modifyProfile(action) {
	try {
		const response = yield call(modifyProfileAPI, action.data)
		console.log(Object.keys(response.data.ProfileImages).length)
		if(Object.keys(response.data.ProfileImages).length !== 0) {
			yield put({
				type: MODIFY_PROFILE_SUCCESS,
				data: {
					ProfileImages: response.data.ProfileImages
				}
			})
		}
		if(response.data.introduction !== '-') {
			yield put({
				type: MODIFY_INTRODUCTION_SUCCESS,
				data: {
					introduction: response.data.introduction,
				}
			})
		}
	} catch (error) {
		yield put({
			type: MODIFY_PROFILE_FAILURE,
			error: error
		})
	}
}

function* watchModifyProfile() {
	yield takeLatest(MODIFY_PROFILE_REQUEST, modifyProfile)
}

export default function* userSaga() {
	yield all([
		fork(watchLoadUser),
		fork(watchLogin),
		fork(watchSignUp),
		fork(watchLogout),
		fork(watchFollowUser),
		fork(watchUnfollowUser),
		fork(watchAddProfileImage),
		fork(watchModifyProfile)
	])
}