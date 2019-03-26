import * as React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import CustomInput from '../../components/CustomInput/CustomInput';
import Button from '../../components/CustomButtons/Button';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Auth from '../../services/Auth';

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      initialLoad: true,
      userInfo: {
        username: '',
        password: '',
      },
      error: null,
    };

    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    if (Auth.isSignedIn()) {
      return this.props.history.push('neworder/:id');
      // return this.props.history.push('reports');
    }
  }

  handleSignIn() {
    this.setState({ errors: null, initialLoad: false, loading: true });
    Auth
      .signIn(this.state.userInfo.username, this.state.userInfo.password)
      .then((response) => {
        if (!response.is_error) {
          this.props.history.push('neworder/:id');
          //this.props.history.push('reports');
        } else {
          this.setState({ error: response.error_content.error_description });
        }
        this.setState({ loading: false });
      });
  }

  handleKeyPress(event) {
    if (event.key == 'Enter') {
      this.handleSignIn();
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const userInfoUpdates = {
      [name]: value,
    };
    // const { state } = this.state.userInfo;
    this.setState({
      userInfo: Object.assign(this.state.userInfo, userInfoUpdates),
    });
  }

  render() {
    const styles = {
      cardCategoryWhite: {
        color: 'rgba(255,255,255,.62)',
        margin: '0',
        fontSize: '14px',
        marginTop: '0',
        marginBottom: '0',
      },
      cardTitleWhite: {
        color: '#FFFFFF',
        marginTop: '0px',
        minHeight: 'auto',
        fontWeight: '300',
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: '3px',
        textDecoration: 'none',
      },
      backGround: {
        backgroundColor: 'red',
      },
    };
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const { loading } = this.state;
    let initialLoadContent = null;
    if (this.state.initialLoad) {
      if (params.get('confirmed')) {
        initialLoadContent = (
          <div className="alert alert-success" role="alert">
            Your email address has been successfully confirmed.
          </div>
        );
      }

      if (params.get('expired')) {
        initialLoadContent = (
          <div className="alert alert-info" role="alert">
            <strong>Sesion Expired</strong>
            You need to sign in again.
          </div>
        );
      }

      if (
        this.props.history.location.state
        && this.props.history.location.state.signedOut
      ) {
        initialLoadContent = (
          <div className="alert alert-info" role="alert">
            <strong>Signed Out</strong>
          </div>
        );
      }
    }
    return (
      <div className={styles.backGround}>
        <GridContainer justify="center" alignItems="center">
          <GridItem>
            <Card>
              <CardHeader color="primary">
                <h4 className={styles.cardTitleWhite}>
                  {/* <img src="../logo.png" alt="Lights and Parts" /> */}
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
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: this.handleInputChange,
                        name: 'username',
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      value={this.state.userInfo.password}
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: this.handleInputChange,
                        onKeyPress: this.handleKeyPress,
                        name: 'password',
                        type: 'password',
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
            { loading && (<LinearProgress />) }
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
