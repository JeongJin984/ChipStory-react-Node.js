import React from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import AppLayout from '../components/AppLayout'
import axios from 'axios'

import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducer from '../reducers'
import rootSaga from '../sagas'
import { LOAD_USER_REQUEST } from '../reducers/user'

const NodeBird = ({ Component, store, pageProps}) => {
	return(
		<Provider store={store}>
			<Head>
				<title>My Bird</title>
				<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/antd/4.0.1/antd.css'/>
				<link href="https://fonts.googleapis.com/css?family=Fredoka+One&display=swap" rel="stylesheet"/>
			</Head>
			<AppLayout>
				<Component {...pageProps}/>
			</AppLayout>
		</Provider>
	)
}

NodeBird.propTypes = {
	store: PropTypes.object.isRequired,
	pageProps: PropTypes.object.isRequired
}

NodeBird.getInitialProps = async ( context ) => {
	const { ctx, Component } = context
	let pageProps = {} 
	const state = ctx.store.getState()
	const cookie = ctx.isServer ? ctx.req.headers.cookie : ''
	axios.defaults.headers.Cookie = '';
	if(ctx.isServer && cookie) {
		axios.defaults.headers.Cookie = cookie
	}
	if(!state.user.me) {
		ctx.store.dispatch({
			type: LOAD_USER_REQUEST
		})
	}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx) || {};
  }
	return { pageProps }
}

const configurStore = (initialState, options) => {
	const sagaMiddleware = createSagaMiddleware()
	const middlewares = [sagaMiddleware]
	const enhancer = process.env.NODE_ENV === 'production'
	? compose(applyMiddleware(...middlewares))
	: compose(
		applyMiddleware(...middlewares),
		!options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
	);
	const store = createStore(reducer, initialState, enhancer);
	store.sagaTask = sagaMiddleware.run(rootSaga)
	return store
}

export default withRedux(configurStore)(withReduxSaga(NodeBird))
