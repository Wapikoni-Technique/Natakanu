import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';
import Button from './Button'

import routes from '../constants/routes.json'

import styles from './Account.css'

export default class Account extends Component {

	componentDidMount() {
		const account = this.props.match.params.account
		this.props.loadAccount(account)
	}

	render() {
		const {accountInfo, projects} = this.props;

		if(!accountInfo) return (
			<PageContainer backgroundClass={styles.background}>
				<i className="fas fa-spinner fa-pulise"></i>
			</PageContainer>
		)

		const {name, image, key} = this.props.accountInfo
		const goToCreate = () => this.props.push(`/account/${key}/projects/new/`)

		const headerContent = (
			<Button onClick={goToCreate}>New Project</Button>
		);

		return (
			<PageContainer backgroundClass={styles.background} headerContent={headerContent}>
				<div className={styles.accountInfo}>
					<AccountIcon image={image} />
					<div className={styles.accountName}>{name}</div>
				</div>
				<div className={styles.projects}>
					{projects.map(({key, title}) => (
						<Link className={styles.project} to={`/project/${key}/view/`} key={key}>{title}</Link>
					))}
				</div>
			</PageContainer>
		)
	}
}
