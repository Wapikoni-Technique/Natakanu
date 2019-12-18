import React from 'react'
import logo from './logo.svg';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

import Flow from './Flow.js';
import MainMenu from './Components/MainMenu.js';
import NewProject from './Components/NewProject.js';
import OpenProject from './Components/OpenProject.js';
import OpenLibrary from './Components/OpenLibrary.js';
import ProjectView from './Components/ProjectView.js';

class App extends React.Component 
{
  constructor()
  {
    super();
    this.appFlow = new Flow();
    this.value = true;
    this.state = 
    {
      pageRenderer: this.mainMenuRenderer
    };
  }

  OnNewProject = () =>
  {
    this.setState({pageRenderer:this.newProjectRenderer});
    this.forceUpdate();
  }  

  OnOpenProject = () =>
  {
    this.setState({pageRenderer:this.openProjectRenderer});
    this.forceUpdate();
  }   
  
  OnOpenLibrary = () =>
  {
    this.setState({pageRenderer:this.openLibraryRenderer});
    this.forceUpdate();
  }

  OnCreateNewProject = () =>
  {
    this.setState({pageRenderer:this.projectCreationViewRenderer});
    this.forceUpdate();
  }
  
  mainMenuRenderer = () =>
  {
    return (
      <div className="App">>
        <MainMenu onNewProject={this.OnNewProject} onOpenProject={this.OnOpenProject} onOpenLibrary={this.OnOpenLibrary}/>
      </div>
    );    
  }

  newProjectRenderer = () =>
  {
    return (
      <div className="App">>
        <NewProject onFolderSelected={this.OnCreateNewProject}/>
      </div>
    );    
  }
  
  projectCreationViewRenderer = () =>
  {
    return (
      <div className="App">>
        <ProjectView />
      </div>
    );    
  }

  openProjectRenderer = () =>
  {
    return (
      <div className="App">>
        <OpenProject />
      </div>
    );    
  }  
  
  openLibraryRenderer = () =>
  {
    return (
      <div className="App">>
        <OpenLibrary />
      </div>
    );    
  }   

  render() 
  {
    return this.state.pageRenderer()    
  }
}

export default App;
