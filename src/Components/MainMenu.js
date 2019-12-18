/* eslint-disable no-useless-constructor */
import React from 'react';
import Button from 'react-bootstrap/Button'

class MainMenu extends React.Component 
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
            <Button variant="primary" size="lg" onClick={this.props.onNewProject}>Nouveau projet</Button>
            </p>
            <p>
            <Button variant="warning" size="lg" onClick={this.props.onOpenProject}>Ouvrir mes projets</Button>
            </p>
            <p>
            <Button variant="danger" size="lg" onClick={this.props.onOpenLibrary}>Bibliothèque</Button>
            </p>
            </header>
        )
    }
}

export default MainMenu;
