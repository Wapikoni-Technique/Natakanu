/* eslint-disable no-useless-constructor */
import React from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default class ProjectView extends React.Component 
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
            <Form>
                <Form.Group controlId="formProjectTitle">
                    <Form.Control type="project_title" placeholder="Titre du projet" />
                </Form.Group>
                <Form.Group controlId="formProjectAuthor">
                    <Form.Control type="project_author" placeholder="Auteur" />
                </Form.Group>
                <Form.Group controlId="formProjectCredits">
                    <Form.Control type="project_credits" placeholder="Credits..." as="textarea"/>
                </Form.Group>
                <Form.Group controlId="formProjectPublic">
                    <Form.Check type="checkbox" label="Publique"/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Créer
                </Button>                                                          
            </Form>
            </p>
            </header>
        )
    }    
}