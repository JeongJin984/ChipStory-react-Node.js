import { all, fork } from 'redux-saga/effects'
import user from './user'
import post from './post'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3065/api'

export default function* rootSaga() {
	yield all ([
		fork(user),
		fork(post)
	])
}