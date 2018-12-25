import * as React from "react";
// import { Link, Redirect, RouteComponentProps } from "react-router-dom";
// import { RoutePaths } from "../../routes/routes";
// import { PropTypes } from "proprtypes";
import AuthService from "../../services/Auth";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
// import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import LinearProgress from '@material-ui/core/LinearProgress';
// import CardFooter from "components/Card/CardFooter.jsx";
// import dashboardPath from "../../routes/dashboard";
// let authStyle = require("../../styles/auth.styl");
let authService = new AuthService();

export class SignIn extends React.Component {
  // refs: {
  //   username;
  //   password;
  // };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      initialLoad: true,
      userInfo: {
        username: "",
        password: ""
      },
      error: null
    };

    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    if (AuthService.isSignedIn()) {
      return this.props.history.push("reports");
    }
  }

  // static get contextTypes() {
  //   return {
  //     router: PropTypes.object.isRequired,
  //   };
  // }

  handleSignIn(event) {
    this.setState({ errors: null, initialLoad: false, loading: true });
    authService
      .signIn(this.state.userInfo.username, this.state.userInfo.password)
      .then(response => {
        if (!response.is_error) {
          this.props.history.push("reports");
        } else {
          this.setState({ error: response.error_content.error_description });
        }
        this.setState({ loading: false });
      });
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    let userInfoUpdates = {
      [name]: value
    };
    //const { state } = this.state.userInfo;
    this.setState({
      userInfo: Object.assign(this.state.userInfo, userInfoUpdates)
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
    const { loading } = this.state;
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
        <GridContainer justify="center" alignItems="center">
          <GridItem >
            <Card>
              <CardHeader color="primary">
                <h4 className={styles.cardTitleWhite}>
                  Lights and Parts - Sign In
                </h4>
                {initialLoadContent}
                {this.state.error && (
                  <div className="alert alert-danger" role="alert">
                    {this.state.error}
                  </div>
                )}
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      value={this.state.userInfo.username}
                      labelText="User Name"
                      id="username"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleInputChange,
                        name: "username"
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      value={this.state.userInfo.password}
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleInputChange,
                        name: "password",
                        type: "password"
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <Button color="primary" onClick={this.handleSignIn}>
                      Sign In
                    </Button>
                  </GridItem>
                  
                </GridContainer>
              </CardBody>
            </Card>
            { loading && ( <LinearProgress /> ) }
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
