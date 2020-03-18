import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';

import styles from './Account.css'

export default class Account extends Component {

	componentDidMount() {
		const account = this.props.match.params.account
		console.log('Loading account', this.props, account)
		this.props.loadAccount(account)
	}

	render() {
		const {accountInfo, projects} = this.props;

		if(!accountInfo) return (
			<PageContainer backgroundClass={styles.background}>
				<i className="fas fa-spinner fa-pulise"></i>
			</PageContainer>
		)

		const {name, image} = this.props.accountInfo

		return (
			<PageContainer backgroundClass={styles.background}>
				<AccountIcon image={image} />
				<div>{name}</div>
				{projects.map(({url, name}) => (
					<Link to={url} key={url}>{name}</Link>
				))}
			</PageContainer>
		)
	}
}
