import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch /*, Redirect */} from "react-router-dom";

import "assets/css/material-dashboard-react.css?v=1.5.0";

import indexRoutes from "routes/index.jsx";
import AuthService from "./services/Auth";
// import RoutePaths from "./routes/routes";

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      {indexRoutes.map((prop, key) => {
        if (AuthService.isSignedIn())
          return (
            <Route path={prop.path} component={prop.component} key={key} />
          );
        return;
        // <Route path={prop.path} component={prop.component} key={key} />
        //return <Redirect from={prop.path} to={RoutePaths.SignIn} key={key} />;
      })}
    </Switch>
  </Router>,
  document.getElementById("root")
);
