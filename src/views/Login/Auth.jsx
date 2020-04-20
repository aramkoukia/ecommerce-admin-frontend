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
import PortalSettingsService from '../../services/PortalSettingsService';

export default class SignIn extends React.Component {
  state = {
    loading: false,
    initialLoad: true,
    userInfo: {
      username: '',
      password: '',
    },
    error: null,
    portalSettings: {},
  };

  constructor(props) {
    super(props);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    const { history } = this.props;
    if (Auth.isSignedIn()) {
      return history.push('neworder/:id');
    }
  }

  async componentDidMount() {
    const portalSettings = await PortalSettingsService.getPortalSettings();
    this.setState({
      portalSettings,
    });
  }

  handleSignIn() {
    const { userInfo } = this.state;
    const { history } = this.props;
    this.setState({ initialLoad: false, loading: true });
    Auth
      .signIn(userInfo.username, userInfo.password)
      .then((response) => {
        if (!response.is_error) {
          history.push('neworder/:id');
        } else {
          this.setState({ error: response.error_content.error_description });
        }
        this.setState({ loading: false });
      });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleSignIn();
    }
  }

  handleInputChange(event) {
    const { target } = event;
    const { name } = target;
    const { value } = target;
    const userInfoUpdates = {
      [name]: value,
    };
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
    const { location } = this.props;
    const { search } = location;
    const params = new URLSearchParams(search);
    const {
      loading, portalSettings, error, initialLoad,
      userInfo,
    } = this.state;

    let initialLoadContent = null;
    if (initialLoad) {
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
        location.state
        && location.state.signedOut
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
                  {portalSettings.portalTitle}
                  &nbsp;
                  - Sign In
                </h4>
                {initialLoadContent}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      value={userInfo.username}
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
                      value={userInfo.password}
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
