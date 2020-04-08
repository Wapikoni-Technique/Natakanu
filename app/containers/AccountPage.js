import React, {Component} from "react"
import {useHistory, useParams} from "react-router-dom"
import getCore from '../core/get'

import Account from '../components/Account';
import AsyncPage from './AsyncPage'

export default function AccountPage(props) {
	const {account} = useParams()
	const {push} = useHistory()

	function onGoCreate() {
		push(`/account/${account}/projects/new`)
	}

	return (
		<AsyncPage promiseFn={loadAccountInfo} account={account} watch={account}>
			{({accountInfo, projects}) => (
				<Account account={account} accountInfo={accountInfo} projects={projects} onGoCreate={onGoCreate} />
			)}
		</AsyncPage>
	)
}

async function loadAccountInfo({account}) {
	const core = await getCore()
	const accountInstance = await core.accounts.get(account)
	const accountInfo = await accountInstance.getInfo();
	const projects = await accountInstance.getProjectsInfo();

	return {
		accountInfo,
		projects
	}
}
