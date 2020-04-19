import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import {
  HashRouter, Route, Switch,
} from 'react-router-dom';
import './assets/css/material-dashboard-react.css';
import indexRoutes from './routes/index';
import Auth from './services/Auth';

const hist = createBrowserHistory();

function permissionsChanged() {
  // console.log('permissionsChanged');
}

ReactDOM.render(
  <HashRouter history={hist}>
    <Switch>
      {indexRoutes.map((prop) => {
        if (Auth.isSignedIn()) {
          return (
            <Route
              path={prop.path}
              component={prop.component}
              key={prop.path}
              permissionsChanged={permissionsChanged}
            />
          );
        }
        return (
          <Route
            path={prop.path}
            component={prop.component}
            key={prop.path}
            permissionsChanged={permissionsChanged}
          />
        );
        // return <Redirect from={prop.path} to="/login" key={key} />;
      })}
    </Switch>
  </HashRouter>,
  document.getElementById('root'),
);
