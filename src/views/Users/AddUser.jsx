import React from 'react';
import Check from '@material-ui/icons/Check';
import SchemaForm from 'jsonschema-form-for-material-ui';
import ReactTimeout from 'react-timeout';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Card from '../../components/Card/Card';
import Snackbar from '../../components/Snackbar/Snackbar';
import UserService from '../../services/UserService';

class AddUser extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: 'info',
      userName: '',
      email: '',
      givenName: '',
      passwordHash: '',
    };
  }

  async componentDidMount() {
    this.setState({
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: 'info',
    });
  }

  async onSubmit(form) {
    const { history, setTimeout } = this.props;
    // eslint-disable-next-line camelcase
    const {
      userName, email, givenName, passwordHash,
    } = form.formData;

    if (userName === ''
      || email === ''
      || givenName === ''
      || passwordHash === '') {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Please enter all the information!',
        snackbarColor: 'danger',
      });
    }

    this.setState({
      userName,
      email,
      givenName,
      passwordHash,
    });

    const { is_error, error_content, content } = await UserService.addUser(form.formData);
    // eslint-disable-next-line no-extra-boolean-cast
    // eslint-disable-next-line camelcase
    if (is_error) {
      if (error_content) {
        this.setState({
          openSnackbar: true,
          snackbarMessage: error_content.join('\r\n'),
          snackbarColor: 'danger',
        });
      } else {
        this.setState({
          openSnackbar: true,
          snackbarMessage: 'Oops, somthing went wrong!',
          snackbarColor: 'danger',
        });
      }
    } else {
      if (content.id) {
        this.setState({
          openSnackbar: true,
          snackbarMessage: 'New user is saved!',
          snackbarColor: 'success',
        });
        return setTimeout(history.push('/users', 2000));
      }
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Oops, somthing went wrong!',
        snackbarColor: 'danger',
      });
    }
  }

  render() {
    const { openSnackbar, snackbarMessage, snackbarColor } = this.state;
    const styles = {
      field: {
        display: 'grid',
      },
      root: {
        display: 'grid',
      },
    };

    const schema = {
      type: 'object',
      required: [
        'userName',
        'email',
        'givenName',
      ],
      properties: {
        userName: {
          type: 'string',
          title: 'User Name',
        },
        email: {
          type: 'string',
          title: 'Email',
        },
        givenName: {
          type: 'string',
          title: 'Full Name',
        },
        passwordHash: {
          type: 'password',
          title: 'Password',
        },
      },
    };

    const uiSchema = {
      userName: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      email: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      givenName: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      password: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
    };

    const {
      userName, email, givenName, passwordHash,
    } = this.state;

    const initialFormData = {
      userName,
      email,
      givenName,
      password: passwordHash,
      passwordHash,
    };

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={9}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>New User</div>
              </CardHeader>
              <CardBody>
                <SchemaForm
                  classes={styles}
                  schema={schema}
                  uiSchema={uiSchema}
                  formData={initialFormData}
                  onSubmit={this.onSubmit}
                />

              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Snackbar
          place="tl"
          color={snackbarColor}
          icon={Check}
          message={snackbarMessage}
          open={openSnackbar}
          closeNotification={() => this.setState({ openSnackbar: false })}
          close
        />
      </div>
    );
  }
}

export default ReactTimeout(AddUser);
