/* eslint-disable no-useless-constructor */
import React from 'react';

import PageContainer from './PageContainer'

import styles from './ProjectView.css'

export default class ProjectView extends React.Component {
	componentDidMount() {
		console.log(this.props)
		const {match, loadProject} = this.props;
		const {project} = match.params;

		loadProject(project)
	}

  render() {
		const {projectInfo, files=[]} = this.props

		if(!projectInfo) return (
			<i class="fa fa-spinner fa-pulse"></i>
		)

  	const {title,description, author, community, nation} = projectInfo

    return (
    	<PageContainer backgroundClass={styles.background} contentClass={styles.content}>
				<div className={styles.files}>
					<h3>{title}</h3>
					{files.map(({stat, name}) => {
						const isDirectory = stat.isDirectory();
						const endSlash = isDirectory ? '/' : '';
						const icon = isDirectory ? '📁' : '📃';

						return (
							<button className={styles.file}>{`${icon} /${name}${endSlash}`}</button>
						);
					})}
				</div>
				<div className={styles.info}>
					<dl>
						<dt>Author</dt><dd>{author}</dd>
						<dt>Community</dt><dd>{community}</dd>
						<dt>Nation</dt><dd>{nation}</dd>
						<dt>Credits</dt><dd>{description}</dd>
					</dl>
				</div>
    	</PageContainer>
    );
  }
}
