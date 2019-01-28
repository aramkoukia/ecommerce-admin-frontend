import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import headerLinksStyle from '../../assets/jss/material-dashboard-react/components/headerLinksStyle';
import Button from '../CustomButtons/Button';
import Auth from '../../services/Auth';
import Location from '../../stores/Location';
// import LocationService from '../../services/LocationService';

function signOut() {
  Location.removeStoreLocation();
  Auth.signOut();
}

class HeaderLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locationId: 1,
    };
  }

  componentDidMount() {
    const currentLocationId = Location.getStoreLocation();
    const { locationId } = this.state;
    if (currentLocationId && locationId && Number(currentLocationId) !== locationId) {
      this.setState({ locationId: Number(currentLocationId) });
    }
  }

  handleChange = (event) => {
    Location.setStoreLocation(event.target.value);
    this.setState({ locationId: event.target.value });
    window.location.reload();
  };

  render() {
    const { classes, locations } = this.props;
    const { locationId } = this.state;

    return (
      <div>
        {
        Auth.isSignedIn() ? (
          <div>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel htmlFor="location">Location</InputLabel>
              <Select
                value={locationId}
                onChange={this.handleChange}
                inputProps={{
                  name: 'location',
                  id: 'location',
                }}
                input={
                  <OutlinedInput
                    labelWidth="70px"
                    name="location"
                    id="location"
                  />
                }                
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
            <Button onClick={signOut}>
              <PowerSettingsNew />
              &nbsp;
              Sign out
            </Button>
          </div>
        ) : (<div />)}
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
