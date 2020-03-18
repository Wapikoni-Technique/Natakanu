import React, { Component } from 'react';
import styles from './PageContainer.css';

type Props = {
	contentClass: string,
	backgroundClass: string,
	headerContent: any,
	children: any,
}

export default class PageContainer extends Component<Props> {
	props: Props;

	render() {
		const {contentClass='', backgroundClass='', headerContent, children} = this.props

		return (
			<div className={`${styles.wrapper} ${backgroundClass}`}>
				<header className={styles.header}>{headerContent}</header>
				<main className={`${styles.content} ${contentClass}`}>
					{children}
				</main>
			</div>
		)
	}
}
