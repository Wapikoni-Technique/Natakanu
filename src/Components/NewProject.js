/* eslint-disable no-useless-constructor */
import React from 'react';
import Button from 'react-bootstrap/Button'

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
            </header>
        )
    }
}

export default NewProject;