import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";

import Registration from "./pages/Registration/index";
import Welcome from "./pages/Welcome/index";
import Login from "./pages/Login/index";
import Messages from "./pages/Messages/index";
import Accounts from "./pages/Accounts/index";



const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <App >
        <Switch>
          <Route path="/accounts">
            <Accounts/>
          </Route>
          <Route path="/registration">
            <Registration />
          </Route>
          <Route path="/login">
              <Login/>
          </Route>
          <Route path="/messages">
              <Messages/>
          </Route>
          <Route path="/">
            <Welcome />
          </Route>
        </Switch>
      </App>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
