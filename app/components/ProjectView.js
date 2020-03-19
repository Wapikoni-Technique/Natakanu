/* eslint-disable no-useless-constructor */
import React from 'react';

import PageContainer from './PageContainer'

export default class ProjectView extends React.Component {
	componentDidMount() {
		console.log(this.props)
		const {match, loadProject} = this.props;
		const {project} = match.params;

		loadProject(project)
	}

  render() {
	const {projectInfo, files=[]} = this.props
  	console.log(projectInfo, files)

	if(!projectInfo) return (
		<i class="fa fa-spinner fa-pulse"></i>
	)

  	const {title, author, community, nation} = projectInfo

    return (
    	<PageContainer>
    		<div>
				{title} by {author}
			</div>
			<ul>
				{files.map(({stat, name}) => (
					<li>{`/${name}${stat.isDirectory() ? '/' : '' }`}</li>
				))}
			</ul>
    	</PageContainer>
    );
  }
}
