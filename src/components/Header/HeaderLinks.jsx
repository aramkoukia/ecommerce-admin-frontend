import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// @material-ui/icons
import Person from '@material-ui/icons/Person';
// core components
import Button from 'components/CustomButtons/Button';
import headerLinksStyle from 'assets/jss/material-dashboard-react/components/headerLinksStyle.jsx';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
// import ReactDOM from 'react-dom';
import FormControl from '@material-ui/core/FormControl';
import AuthService from '../../services/Auth';
import Location from '../../stores/Location';
import LocationService from '../../services/LocationService';

function signOut() {
  Location.removeStoreLocation();
  AuthService.signOut();
}

class HeaderLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: 1,
      locations: [],
    };
  }

  componentWillMount() {
    if (AuthService.isSignedIn()) {
      this.locationsList();
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    Location.setStoreLocation(event.target.value);
  };

  locationsList() {
    LocationService.getLocations()
      .then((data) => {
        this.setState({
          locations: data,
          location: data[0].locationId,
        });
        Location.setStoreLocation(data[0].locationId);
      });
  }

  render() {
    const { classes } = this.props;
    const { location, locations } = this.state;
    return (
      <div>
        {
        AuthService.isSignedIn() ? (
          <div>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="location">Location</InputLabel>
              <Select
                value={location}
                onChange={this.handleChange}
                inputProps={{
                  name: 'location',
                  id: 'location',
                }}
              >
                {
                  locations.map(l => (<MenuItem value={l.locationId}>{l.locationName}</MenuItem>))
                }
              </Select>
            </FormControl>
        &nbsp;&nbsp;&nbsp;&nbsp;
        Hello&nbsp;
            { AuthService.getUser() }
              !
        &nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={signOut}>
              <Person />
              Sign out
            </Button>
          </div>
        ) : (<div />)}
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
