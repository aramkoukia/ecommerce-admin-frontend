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
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridItem from '../../components/Grid/GridItem';
import Snackbar from '../../components/Snackbar/Snackbar';

import UserService from '../../services/UserService';
import RoleService from '../../services/RoleService';

export default class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      openDialog: false,
      selectedRow: null,
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      locations: [
        { locationId: 1, locationName: 'Vancouver' },
        { locationId: 2, locationName: 'Abbotsford' },
      ],
      roles: [],
      roleChecked: [0],
      locationChecked: [0],
    };

    this.rowClicked = this.rowClicked.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this.usersList();
    this.rolesList();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleRoleToggle = value => () => {
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

  handleLocationToggle = value => () => {
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

  async handleUpdate() {
    const {
      selectedRow,
      roleChecked,
      locationChecked,
    } = this.state;

    const userInfo = {
      email: selectedRow[1],
      roleIds: roleChecked.filter(item => item !== 0),
      locationIds: locationChecked.filter(item => item !== 0),
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
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      selectedRow: null,
      roleChecked: [0],
      locationChecked: [0],
    });
  };

  rowClicked(rowData) {
    this.setState({
      openDialog: true,
      selectedRow: rowData,
    });
  }

  usersList() {
    const columns = ['givenName', 'email', 'userName', 'roles', 'locations'];
    UserService.getUsers()
      .then(results => results.map(row => columns.map(column => (row[column] === null ? '' : row[column]))))
      .then(data => this.setState({ users: data }));
  }

  rolesList() {
    RoleService.getRoles()
      .then(data => this.setState({ roles: data }));
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

    const columns = ['Given Name', 'Email', 'User Name', 'Roles', 'Locations'];

    const options = {
      filterType: 'checkbox',
      onRowClick: this.rowClicked,
      rowHover: true,
      resizableColumns: true,
      selectableRows: false,
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
      locationChecked,
      roleChecked,
    } = this.state;

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
                  title="To update the permission and location assignment for each user, click on the user record bellow."
                  data={users}
                  columns={columns}
                  options={options}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Dialog
          open={openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">User Update</DialogTitle>
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
                 {roles.map(role => (
                      <ListItem key={role.id} role={undefined} dense button onClick={this.handleRoleToggle(role.id)}>
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
                  {locations.map(location => (
                    <ListItem key={location.locationId} role={undefined} dense button onClick={this.handleLocationToggle(location.locationId)}>
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
