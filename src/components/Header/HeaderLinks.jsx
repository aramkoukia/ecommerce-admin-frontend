import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import InputLabel from '@material-ui/core/InputLabel';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Check from '@material-ui/icons/Check';
import Popper from '@material-ui/core/Popper';
import FormControl from '@material-ui/core/FormControl';
import Person from '@material-ui/icons/Person';
import Lock from '@material-ui/icons/Lock';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import SettingsBackupRestore from '@material-ui/icons/SettingsBackupRestore';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Portal from '@material-ui/core/Portal';
import GridItem from '../Grid/GridItem';
import GridContainer from '../Grid/GridContainer';
import Card from '../Card/Card';
import CardHeader from '../Card/CardHeader';
import CardBody from '../Card/CardBody';
import headerLinksStyle from '../../assets/jss/material-dashboard-react/components/headerLinksStyle';
import Button from '../CustomButtons/Button';
import Auth from '../../services/Auth';
import Location from '../../stores/Location';
import UserService from '../../services/UserService';
import Snackbar from '../Snackbar/Snackbar';

class HeaderLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locationId: 1,
      openPasscodeDialog: false,
      openPasswordDialog: false,
    };

    this.resetPasscode = this.resetPasscode.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.handlePasswordReset = this.handlePasswordReset.bind(this);
    this.handlePasscodeReset = this.handlePasscodeReset.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const currentLocationId = Location.getStoreLocation();
    const { locationId } = this.state;
    if (currentLocationId && locationId && Number(currentLocationId) !== locationId) {
      this.setState({ locationId: Number(currentLocationId) });
    }

    this.setState({
      openPasscodeDialog: false,
      openPasswordDialog: false,
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLocationChange = (event) => {
    Location.setStoreLocation(event.target.value);
    this.setState({ locationId: event.target.value });
    window.location.reload();
  }

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  }

  handleClose = (event) => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  }

  signOut() {
    Location.removeStoreLocation();
    Auth.signOut();
  }

  resetPassword() {
    this.setState({
      openPasswordDialog: true,
    });
  }

  resetPasscode() {
    this.setState({
      openPasscodeDialog: true,
    });
  }

  async handlePasswordReset() {
    const {
      newPassword,
      newPasswordRepeat,
    } = this.state;

    if (newPassword === '') {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Password cannot be empty!',
        snackbarColor: 'danger',
      });
      return;
    }

    if (newPassword !== newPasswordRepeat) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Passwords don\'t match!',
        snackbarColor: 'danger',
      });
      return;
    }

    const passwordResetInfo = {
      userName: Auth.getUser(),
      newPassword,
    };

    const result = await UserService.ResetPassword(passwordResetInfo);
    if (result && result.succeeded) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Your password was successfully updated!',
        snackbarColor: 'success',
        openPasswordDialog: false,
      });
    } else {
      const message = result.errors.map((error) => {
        return error.description;
      }).join('. ');

      this.setState({
        openSnackbar: true,
        snackbarMessage: message,
        snackbarColor: 'danger',
      });
    }
  }

  async handlePasscodeReset() {
    const {
      newPasscode,
      newPasscodeRepeat,
    } = this.state;

    if (newPasscode === '') {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Passcode cannot be empty!',
        snackbarColor: 'danger',
      });
      return;
    }

    if (newPasscode !== newPasscodeRepeat) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Passcodes don\'t match!',
        snackbarColor: 'danger',
      });
      return;
    }

    const passcodeResetInfo = {
      userName: Auth.getUser(),
      newPasscode,
    };

    const result = await UserService.ResetPasscode(passcodeResetInfo);
    if (result && result.succeeded) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Your passcode was successfully updated!',
        snackbarColor: 'success',
        openPasscodeDialog: false,
      });
    } else {
      const message = result.errors.map((error) => {
        return error;
      }).join('. ');

      this.setState({
        openSnackbar: true,
        snackbarMessage: message,
        snackbarColor: 'danger',
      });
    }
  }


  render() {
    const { classes, locations } = this.props;
    const { 
      locationId, open, openPasscodeDialog, openPasswordDialog, newPassword, newPasswordRepeat, newPasscode, newPasscodeRepeat,
      snackbarColor,
      snackbarMessage,
      openSnackbar,
    } = this.state;

    return (
      <div>
        {
        Auth.isSignedIn() ? (
          <div>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel htmlFor="location">Location</InputLabel>
              <Select
                value={locationId}
                onChange={this.handleLocationChange}
                inputProps={{
                  name: 'location',
                  id: 'location',
                }}
                input={(
                  <OutlinedInput
                    labelWidth="70px"
                    name="location"
                    id="location"
                  />
                )}
              >
                { locations && (
                  locations.map((l, key) => (<MenuItem name={key} value={l.locationId}>{l.locationName}</MenuItem>)))
              }
              </Select>
            </FormControl>
        &nbsp;&nbsp;&nbsp;&nbsp;
        Hello&nbsp;
            { Auth.getUser() }
              !
        &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              buttonRef={(node) => {
            this.anchorEl = node;
          }}
              aria-owns={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={this.handleToggle}
            >
              <Person />
            Profile
            </Button>
            <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
              {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      <MenuItem onClick={this.resetPassword}>
                        <ListItemIcon>
                            <Lock />
                          </ListItemIcon>
                          Reset Password
                      </MenuItem>
                      <MenuItem onClick={this.resetPasscode}>
                        <ListItemIcon>
                        <SettingsBackupRestore />
                      </ListItemIcon>
                      Reset Passcode
                      </MenuItem>
                      <MenuItem onClick={this.signOut}>
                        <ListItemIcon>
                        <PowerSettingsNew />
                      </ListItemIcon>
                        Logout
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
            </Popper>
            <Dialog open={openPasswordDialog}>
            <DialogContent>
            <Card>
              <CardHeader color="info">
                <div>Reset your login Password</div>
              </CardHeader>
              <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                <TextField
                  name="newPassword"
                  label="New Password"
                  type="password"
                  onChange={this.handleChange}
                  value={newPassword}
                />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                <TextField
                  name="newPasswordRepeat"
                  label="Repeat Password"
                  type="password"
                  onChange={this.handleChange}
                  value={newPasswordRepeat}
                />                                
                </GridItem>
              </GridContainer>
              </CardBody>
            </Card>
          </DialogContent>
            <DialogActions>
            <Button onClick={this.handlePasswordReset} color="primary">
              Reset
            </Button>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>            
          </DialogActions>
          </Dialog>

          <Dialog open={openPasscodeDialog}>
            <DialogContent>
            <Card>
              <CardHeader color="info">
                <div>Reset your Passcode</div>
              </CardHeader>
              <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                <TextField
                  name="newPasscode"
                  label="New Passcode"
                  type="password"
                  onChange={this.handleChange}
                  value={newPasscode}
                />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                <TextField
                  name="newPasscodeRepeat"
                  label="Repeat Passcode"
                  type="password"
                  onChange={this.handleChange}
                  value={newPasscodeRepeat}
                />                                
                </GridItem>
              </GridContainer>
              </CardBody>
            </Card>
          </DialogContent>
            <DialogActions>
            <Button onClick={this.handlePasscodeReset} color="primary">
              Reset
            </Button>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
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
        ) : (<div />)}
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
