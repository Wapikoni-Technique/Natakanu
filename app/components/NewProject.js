/* eslint-disable no-useless-constructor */
import React from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';

class NewProject extends React.Component 
{
    constructor(props)
    {
        super(props);
    }
    
    render() 
    {
        return (
            <header className="App-header">
            <p>
            <Button variant="danger" size="lg" onClick={this.props.onFolderSelected}>Choisir un dossier</Button>
            </p>
            <p>
			<Link to={routes.HOME}>Main Menu</Link>
            </p>			
            </header>
        )
    }
}

export default NewProject;