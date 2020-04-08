import React from 'react'
import {useHistory} from 'react-router-dom'
import Async from 'react-async'

import getCore from '../core/get'

import routes from "../constants/routes.json";
import Home from '../components/Home';

export default function HomePage () {
	const history = useHistory()
	const {push} = useHistory()

	return (
		<Async promiseFn={load} push={push}>
			<Async.Pending>
				<Home/>
			</Async.Pending>
			<Async.Rejected>
				{error => (
					<div>
						{error.stack}
					</div>
				)}
			</Async.Rejected>
		</Async>
	)
}

function renderHome() {
	return (
		<Home />
	)
}

async function load({push}) {
	await getCore()
	push(routes.LOGIN)
}
