import * as React from "react";
//import * as ReactDOM from "react-dom";
import { Route, Redirect, Switch } from "react-router-dom";
import { SignIn } from "../views/Login/Auth";
//import AuthService from "../services/Auth.js";
import { ErrorPage } from "../views/Error/Error";
// import { Contacts } from "./Contacts";
import { Order } from "../views/Orders/Order";

export class RoutePaths {
  static Contacts = "/contacts";
  static ContactEdit = "/contacts/edit/:id";
  static ContactNew = "/contacts/new";
  static SignIn = "/";
  static Order = "/order/:id";
  // static Register = "/register/";
}

export default class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path={RoutePaths.SignIn} component={SignIn} />
        <Route path={RoutePaths.Order} component={Order} />
        {/*<Route path={RoutePaths.Register} component={Register} />
        <DefaultLayout exact path={RoutePaths.Contacts} component={Contacts} />
        <DefaultLayout path={RoutePaths.ContactNew} component={ContactForm} /> */}
        
        <Route path="/error/:code?" component={ErrorPage} />
      </Switch>
    );
  }
}

// const DefaultLayout = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={props =>
//       AuthService.isSignedIn() ? (
//         <div>
//           {/* <Header {...props} /> */}
//           <div className="container">
//             <Component {...props} />
//           </div>
//         </div>
//       ) : (
//         <Redirect
//           to={{
//             pathname: RoutePaths.SignIn,
//             state: { from: props.location }
//           }}
//         />
//       )
//     }
//   />
// );
