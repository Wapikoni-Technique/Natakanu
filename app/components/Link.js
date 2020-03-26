import React from 'react'
import {Link as RouterLink} from 'react-router-dom'
import { PROTOCOL_SCHEME } from '../core/urlParser'

const HAS_PROTOCOL = /^[^:]+:/

export default function Link({to='', ...props}) {
	if(to.startsWith(PROTOCOL_SCHEME)) {
		to = to.slice(PROTOCOL_SCHEME.length - 1)
	}

	if(to.match(HAS_PROTOCOL)) return (
		<a href={to} {...props}>{props.children}</a>
	)

	return (
		<RouterLink to={to} {...props} />
	)
}
