/* eslint-disable no-useless-constructor */
import React from 'react';
// import Button from 'react-bootstrap/Button'

class OpenProject extends React.Component {
  constructor(props) {
    super(props);
  }

  OnSelectProject = () => {
    console.log('Open project!');
  };

  render() {
    return (
      <header className="App-header">
        <p>Ouvrir mes projets</p>
      </header>
    );
  }
}

export default OpenProject;
