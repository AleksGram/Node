import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      loginResponse: ""
    }
  }

  render(){
    const { children } = this.props;
    return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    {children}
    </div>
  );
  } 
}

export default App;
