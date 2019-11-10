import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import {
  Router, Route, Switch,
} from 'react-router-dom';

import './assets/css/material-dashboard-react.css';
import indexRoutes from './routes/index';
import Auth from './services/Auth';

const hist = createBrowserHistory();

function permissionsChanged() {
  // console.log('permissionsChanged');
}

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      {indexRoutes.map((prop, key) => {
        if (Auth.isSignedIn()) {
          return (
            <Route path={prop.path} component={prop.component} key={key}  permissionsChanged={permissionsChanged} />
          );
        }
        return <Route path={prop.path} component={prop.component} key={key} permissionsChanged={permissionsChanged} />;
        // return <Redirect from={prop.path} to="/login" key={key} />;
      })}
    </Switch>
  </Router>,
  document.getElementById('root'),
);
