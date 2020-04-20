import React from 'react';
import MUIDataTable from 'mui-datatables';
import Check from '@material-ui/icons/Check';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Portal from '@material-ui/core/Portal';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridItem from '../../components/Grid/GridItem';
import Snackbar from '../../components/Snackbar/Snackbar';
import CustomInput from '../../components/CustomInput/CustomInput';
import UserService from '../../services/UserService';
import RoleService from '../../services/RoleService';
import Auth from '../../services/Auth';

export default class Users extends React.Component {
  state = {
    users: [],
    openDialog: false,
    openUserEditDialog: false,
    selectedRow: null,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    newPassword: '',
    locations: Auth.getUserLocations(),
    roles: [],
    roleChecked: [0],
    locationChecked: [0],
  };

  constructor(props) {
    super(props);

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.editClicked = this.editClicked.bind(this);
    this.permissionsClicked = this.permissionsClicked.bind(this);
  }

  componentDidMount() {
    this.usersList();
    this.rolesList();
  }

  getUserRoles(email) {
    const { roles } = this.state;
    const assignedRoles = [];
    UserService.getUserRoles(email)
      .then((data) => {
        data.forEach((item) => {
          roles.forEach((r) => {
            if (r.name === item) {
              assignedRoles.push(r.id);
            }
          });
        });
        this.setState({ roleChecked: assignedRoles });
      });
  }

  getUserLocations(email) {
    UserService.getUserLocations(email)
      .then((data) => {
        this.setState({ locationChecked: data.map((l) => l.locationId) });
      });
  }

  handleRoleToggle = (value) => () => {
    const { roleChecked } = this.state;
    const currentIndex = roleChecked.indexOf(value);
    const newChecked = [...roleChecked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      roleChecked: newChecked,
    });
  }

  handleLocationToggle = (value) => () => {
    const { locationChecked } = this.state;
    const currentIndex = locationChecked.indexOf(value);
    const newChecked = [...locationChecked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      locationChecked: newChecked,
    });
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      openUserEditDialog: false,
      selectedRow: null,
      roleChecked: [0],
      locationChecked: [0],
    });
  };

  editClicked(tableMeta) {
    const { users } = this.state;
    const user = users[tableMeta.rowIndex];
    setTimeout(() => {
      this.setState({
        openUserEditDialog: true,
        selectedRow: user,
        givenName: user[0],
        userName: user[2],
        email: user[1],
      });
    }, 1000);
  }

  permissionsClicked(tableMeta) {
    const { users } = this.state;
    const user = users[tableMeta.rowIndex];
    this.getUserRoles(user[1]);
    this.getUserLocations(user[1]);
    setTimeout(() => {
      this.setState({
        openDialog: true,
        selectedRow: user,
      });
    }, 1000);
  }

  async handleUpdateUser() {
    const {
      email,
      userName,
      givenName,
    } = this.state;

    const userInfo = {
      email,
      userName,
      givenName,
    };

    const result = await UserService.UpdateUser(userInfo);
    if (result && result.email) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Users\'s Information was successfully updated!',
        snackbarColor: 'success',
      });
    }

    this.setState({
      openUserEditDialog: false,
      selectedRow: null,
    });
    window.location.reload();
  }

  async handleUpdate() {
    const {
      selectedRow,
      roleChecked,
      locationChecked,
    } = this.state;

    const userInfo = {
      email: selectedRow[1],
      roleIds: roleChecked.filter((item) => item !== 0),
      locationIds: locationChecked.filter((item) => item !== 0),
    };

    const result = await UserService.UpdateUserRolesAndLocations(userInfo);
    if (result && result.email) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Users\'s Roles and assigned locations were successfully updated!',
        snackbarColor: 'success',
      });
    }

    this.setState({
      openDialog: false,
      selectedRow: null,
    });

    window.location.reload();
  }

  async handleResetPassword() {
    const {
      selectedRow,
      newPassword,
    } = this.state;

    if (newPassword === '') {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Password cannot be empty!',
        snackbarColor: 'danger',
      });
    }

    const passwordResetInfo = {
      email: selectedRow[1],
      newPassword,
    };

    const result = await UserService.ResetPassword(passwordResetInfo);
    if (result && result.succeeded) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Users\'s password was successfully updated!',
        snackbarColor: 'success',
      });
    } else {
      const message = result.errors.map((error) => error.description).join('. ');

      this.setState({
        openSnackbar: true,
        snackbarMessage: message,
        snackbarColor: 'danger',
      });
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  usersList() {
    const columns = ['givenName', 'email', 'userName', 'roles', 'locations', 'authCode'];
    UserService.getUsers()
      .then((results) => results.map((row) => columns.map((column) => (row[column] === null ? '' : row[column]))))
      .then((data) => this.setState({ users: data }));
  }

  rolesList() {
    RoleService.getRoles()
      .then((data) => this.setState({ roles: data }));
  }

  render() {
    const styles = {
      cardCategoryWhite: {
        '&,& a,& a:hover,& a:focus': {
          color: 'rgba(255,255,255,.62)',
          margin: '0',
          fontSize: '14px',
          marginTop: '0',
          marginBottom: '0',
        },
        '& a,& a:hover,& a:focus': {
          color: '#FFFFFF',
        },
      },
      cardTitleWhite: {
        color: '#FFFFFF',
        marginTop: '0px',
        minHeight: 'auto',
        fontWeight: '300',
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: '3px',
        textDecoration: 'none',
        '& small': {
          color: '#777',
          fontSize: '65%',
          fontWeight: '400',
          lineHeight: '1',
        },
      },
    };

    const columns = ['Given Name', 'Email', 'User Name', 'Roles', 'Locations', 'Pass Code',
      {
        name: 'edit',
        options: {
          filter: true,
          customBodyRender: (value, tableMeta) => (
            <Button
              color="primary"
              index={tableMeta.columnIndex}
              onClick={(event) => {
                this.editClicked(tableMeta, tableMeta.columnIndex, value, event);
              }}
            >
              Edit
            </Button>
          ),
        },
      },
      {
        name: 'permission',
        options: {
          filter: true,
          customBodyRender: (value, tableMeta) => (
            <Button
              color="primary"
              index={tableMeta.columnIndex}
              onClick={(event) => this.permissionsClicked(
                tableMeta, tableMeta.columnIndex, value, event,
              )}
            >
              Permissions
            </Button>
          ),
        },
      },
    ];

    const options = {
      filterType: 'checkbox',
      // onRowClick: this.rowClicked,
      rowHover: true,
      resizableColumns: false,
      selectableRows: false,
      rowsPerPageOptions: [25, 50, 100],
      rowsPerPage: 25,
    };

    const {
      users,
      locations,
      roles,
      selectedRow,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      openDialog,
      openUserEditDialog,
      locationChecked,
      roleChecked,
      newPassword,
      givenName,
      email,
    } = this.state;


    users.forEach((u) => {
      u.push('edit');
      u.push('permissions');
    });

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Users List</div>
              </CardHeader>
              <CardBody>
                <MUIDataTable
                  title=""
                  data={users}
                  columns={columns}
                  options={options}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        { roleChecked && locationChecked && (
        <Dialog
          open={openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">User Permissions</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Given Name:
              {' '}
              { selectedRow && (selectedRow[0]) }
              {' '}
              <br />
              Email:
              {' '}
              { selectedRow && (selectedRow[1]) }
              {' '}
              <br />
            </DialogContentText>
            <GridContainer>
              <GridItem xs={6}>
                <Card>
                  <CardHeader color="info">
                    <div>Roles</div>
                  </CardHeader>
                  <CardBody>
                    { roles && (
                    <List>
                      {roles.map((role) => (
                        <ListItem
                          key={role.id}
                          role={undefined}
                          dense
                          button
                          onClick={this.handleRoleToggle(role.id)}
                        >
                          <Checkbox
                            checked={roleChecked.indexOf(role.id) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText primary={role.name} />
                        </ListItem>
                      ))}
                    </List>
                    )}
                  </CardBody>
                </Card>

              </GridItem>
              <GridItem xs={6}>
                <Card>
                  <CardHeader color="info">
                    <div>Location</div>
                  </CardHeader>
                  <CardBody>
                    <List>
                      {locations.map((location) => (
                        <ListItem
                          key={location.locationId}
                          role={undefined}
                          dense
                          button
                          onClick={this.handleLocationToggle(location.locationId)}
                        >
                          <Checkbox
                            checked={locationChecked.indexOf(location.locationId) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText primary={location.locationName} />
                        </ListItem>
                      ))}
                    </List>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader color="info">
                    <div>Reset Password</div>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                      labelText="New Password"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: this.handleChange,
                        name: 'newPassword',
                        value: newPassword,
                      }}
                    />
                    <Button onClick={this.handleResetPassword} color="primary">
                      Reset
                    </Button>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button onClick={this.handleUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
        )}

        <Dialog
          open={openUserEditDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">User Update</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Given Name:
              {' '}
              {selectedRow && (selectedRow[0])}
              {' '}
              <br />
              Email:
              {' '}
              {selectedRow && (selectedRow[1])}
              {' '}
              <br />
            </DialogContentText>
            <GridContainer>
              <GridItem xs={12}>
                <Card>
                  <CardHeader color="info">
                    <div>User Info</div>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                      labelText="Given Name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: this.handleChange,
                        name: 'givenName',
                        value: givenName,
                      }}
                    />
                    <CustomInput
                      labelText="Email"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: this.handleChange,
                        name: 'email',
                        value: email,
                      }}
                    />
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button onClick={this.handleUpdateUser} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Portal>
          <Snackbar
            place="tl"
            color={snackbarColor}
            icon={Check}
            message={snackbarMessage}
            open={openSnackbar}
            closeNotification={() => this.setState({ openSnackbar: false })}
            close
          />
        </Portal>
      </div>
    );
  }
}
