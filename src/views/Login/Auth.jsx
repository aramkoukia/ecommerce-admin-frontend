import * as React from "react";
import { Link, Redirect, RouteComponentProps } from "react-router-dom";
import { RoutePaths } from "../../routes/routes";
import AuthService from "../../services/Auth";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
// import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
// import CardFooter from "components/Card/CardFooter.jsx";

// let authStyle = require("../../styles/auth.styl");
let authService = new AuthService();

export class SignIn extends React.Component {
  // refs: {
  //   username;
  //   password;
  // };

  state = {
    initialLoad: true,
    error: null
  };

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ errors: null, initialLoad: false });
    authService
      .signIn(this.refs.username.value, this.refs.password.value)
      .then(response => {
        if (!response.is_error) {
          this.props.history.push(RoutePaths.Contacts);
        } else {
          this.setState({ error: response.error_content.error_description });
        }
      });
  }

  render() {
    const styles = {
      cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
      },
      cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
      }
    };
    const search = this.props.location.search;
    const params = new URLSearchParams(search);

    let initialLoadContent = null;
    if (this.state.initialLoad) {
      if (params.get("confirmed")) {
        initialLoadContent = (
          <div className="alert alert-success" role="alert">
            Your email address has been successfully confirmed.
          </div>
        );
      }

      if (params.get("expired")) {
        initialLoadContent = (
          <div className="alert alert-info" role="alert">
            <strong>Sesion Expired</strong> You need to sign in again.
          </div>
        );
      }

      if (
        this.props.history.location.state &&
        this.props.history.location.state.signedOut
      ) {
        initialLoadContent = (
          <div className="alert alert-info" role="alert">
            <strong>Signed Out</strong>
          </div>
        );
      }
    }
    return (
      <div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <GridContainer>
            <GridItem xs={12} sm={6} md={3} />
            <GridItem xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={styles.cardTitleWhite}>Please Sign In</h4>
                  {initialLoadContent}
                  {this.state.error && (
                    <div className="alert alert-danger" role="alert">
                      {this.state.error}
                    </div>
                  )}
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    {/* <label htmlFor="inputEmail" className="form-control-label sr-only">
            Email address
          </label>
          <input
            type="email"
            id="inputEmail"
            ref="username"
            defaultValue="user@test.com"
            className="form-control form-control-danger"
            placeholder="User Name"
          /> */}
                    <GridItem xs={12} sm={12} md={12}>
                      <CustomInput
                        labelText="User Name"
                        id="username"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      <CustomInput
                        labelText="Password"
                        id="password"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                      {/* <label htmlFor="inputPassword" className="form-control-label sr-only">
            Password
          </label>
          <input
            type="password"
            id="inputPassword"
            ref="password"
            defaultValue="P2ssw0rd!"
            className="form-control"
            placeholder="Password"
          /> */}
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      <Button color="primary">Sign In</Button>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={3} />
          </GridContainer>
        </form>
      </div>
    );
  }
}

export class Register extends React.Component {
  // refs: {
  //   email;
  //   password;
  // };

  state = {
    registerComplete: false,
    errors: ""
  };

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ errors: {} });
    authService
      .register(this.refs.email.value, this.refs.password.value)
      .then(response => {
        if (!response.is_error) {
          this.setState({ registerComplete: true });
        } else {
          this.setState({ errors: response.error_content });
        }
      });
  }

  _formGroupClass(field) {
    var className = "form-group ";
    if (field) {
      className += " has-danger";
    }
    return className;
  }

  render() {
    if (this.state.registerComplete) {
      return <RegisterComplete email={this.refs.email.value} />;
    } else {
      return (
        <div>
          <form onSubmit={e => this.handleSubmit(e)}>
            <h2>Please register for access</h2>
            {this.state.errors.general && (
              <div className="alert alert-danger" role="alert">
                {this.state.errors.general}
              </div>
            )}
            <div className={this._formGroupClass(this.state.errors.username)}>
              <label htmlFor="inputEmail">Email address</label>
              <input
                type="email"
                id="inputEmail"
                ref="email"
                className="form-control"
                placeholder="Email address"
              />
              <div className="form-control-feedback">
                {this.state.errors.username}
              </div>
            </div>
            <div className={this._formGroupClass(this.state.errors.password)}>
              <label htmlFor="inputPassword">Password</label>
              <input
                type="password"
                id="inputPassword"
                ref="password"
                className="form-control"
                placeholder="Password"
              />
              <div className="form-control-feedback">
                {this.state.errors.password}
              </div>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit">
              Sign up
            </button>
          </form>
        </div>
      );
    }
  }
}

export class RegisterComplete extends React.Component {
  render() {
    return (
      <div>
        <div className="alert alert-success" role="alert">
          <strong>Success!</strong> Your account has been created.
        </div>
        <p>
          A confirmation email has been sent to {this.props.email}. You will
          need to follow the provided link to confirm your email address before
          signing in.
        </p>
        <Link className="btn btn-lg btn-primary btn-block" role="button" to="/">
          Sign in
        </Link>
      </div>
    );
  }
}
