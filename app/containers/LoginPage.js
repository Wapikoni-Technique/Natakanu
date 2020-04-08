import React from 'react'
import {useHistory} from 'react-router-dom'

import getCore from '../core/get'

import Login from '../components/Login';

const DEFAULT_ACCOUNT_INFO = {
	name: undefined,
	image: undefined
}

export default function LoginPage() {
	const {push} = useHistory()

	function onLogin({username}) {
		push(`/account/${username}/projects/`)
	}

	return (
		<Login onLogin={onLogin} accountInfo={DEFAULT_ACCOUNT_INFO}/>
	)
}
