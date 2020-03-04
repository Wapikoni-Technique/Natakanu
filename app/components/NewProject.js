import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';

type Props = {
  onFolderSelected: () => void
};

class NewProject extends Component<Props> {
  render() {
    const { onFolderSelected } = this.props;
    return (
      <header className="App-header">
        <p>
          <Button variant="danger" size="lg" onClick={onFolderSelected}>
            Choisir un dossier
          </Button>
        </p>
        <p>
          <Link to={routes.HOME}>Main Menu</Link>
        </p>
      </header>
    );
  }
}

export default NewProject;
