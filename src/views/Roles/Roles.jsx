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

import RoleService from '../../services/RoleService';

export default class Roles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roles: [],
      openDialog: false,
      selectedRow: null,
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      permissions: [],
      permissionsChecked: [0],
    };

    this.rowClicked = this.rowClicked.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this.rolesList();
    this.permissionsList();
  }

  getRolePermissions(email) {
    const { permissions } = this.state;
    const assignedPermissions = [];
    RoleService.getRolePermissions(email)
      .then((data) => {
        data.forEach((item) => {
          permissions.forEach((p) => {
            if (p === item) {
              assignedPermissions.push(p);
            }
          });
        });
        this.setState({ permissionsChecked: assignedPermissions });
      });
  }

  handlePermissionToggle = (value) => () => {
    const { permissionsChecked } = this.state;
    const currentIndex = permissionsChecked.indexOf(value);
    const newChecked = [...permissionsChecked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      permissionsChecked: newChecked,
    });
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      selectedRow: null,
      permissionsChecked: [0],
    });
  };

  async handleUpdate() {
    const {
      selectedRow,
      permissionsChecked,
    } = this.state;

    const roleInfo = {
      roleName: selectedRow[0],
      claims: permissionsChecked.filter((item) => item !== 0),
    };

    const result = await RoleService.updateRolePermissions(roleInfo);
    if (result && result.roleName) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Role\'s permissions were successfully updated!',
        snackbarColor: 'success',
      });
    }

    this.setState({
      openDialog: false,
      selectedRow: null,
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  rowClicked(rowData) {
    this.getRolePermissions(rowData[0]);
    this.setState({
      openDialog: true,
      selectedRow: rowData,
    });
  }

  rolesList() {
    const columns = ['name'];
    RoleService.getRoles()
      .then((results) => results.map((row) => columns.map((column) => (row[column] === null ? '' : row[column]))))
      .then((data) => this.setState({ roles: data }));
  }

  permissionsList() {
    RoleService.getPermissions()
      .then((data) => this.setState({ permissions: data }));
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

    const columns = ['Role Name'];

    const options = {
      filterType: 'checkbox',
      onRowClick: this.rowClicked,
      rowHover: true,
      resizableColumns: false,
      selectableRows: false,
      rowsPerPageOptions: [25, 50, 100],
      rowsPerPage: 25,
    };

    const {
      roles,
      permissions,
      selectedRow,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      openDialog,
      permissionsChecked,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Roles List</div>
              </CardHeader>
              <CardBody>
                <MUIDataTable
                  title="To update the access of each role, click on each record bellow."
                  data={roles}
                  columns={columns}
                  options={options}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        { permissionsChecked && (
          <Dialog
            open={openDialog}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Role Update</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Role Name:
                {' '}
                { selectedRow && (selectedRow[0]) }
                <br />
              </DialogContentText>
              <GridContainer>
                <GridItem>
                  <Card>
                    <CardHeader color="info">
                      <div>Permissions</div>
                    </CardHeader>
                    <CardBody>
                      { permissions && (
                      <List>
                        {permissions.map((permission) => (
                          <ListItem key={permission} permission={undefined} dense button onClick={this.handlePermissionToggle(permission)}>
                            <Checkbox
                              checked={permissionsChecked.includes(permission)}
                              tabIndex={-1}
                              disableRipple
                            />
                            <ListItemText primary={permission} />
                          </ListItem>
                        ))}
                      </List>
                      )}
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
