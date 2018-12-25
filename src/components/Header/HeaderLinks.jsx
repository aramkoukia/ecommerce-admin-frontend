import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
// core components
import Button from "components/CustomButtons/Button.jsx";
import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.jsx";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
// import ReactDOM from 'react-dom';
import FormControl from '@material-ui/core/FormControl';
import AuthService from "../../services/Auth";
import Location from "../../stores/Location";

const authService = new AuthService();

class HeaderLinks extends React.Component {
  state = {
    location: '1',
  };

  componentDidMount() {
    this.setState({
       location: "1",
    });
    Location.setStoreLocation("1");
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    Location.setStoreLocation(event.target.value);
  };

  signOut() {
    Location.removeStoreLocation();
    authService.signOut();
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        {
        AuthService.isSignedIn() ? (
        <div>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="location">Location</InputLabel>
          <Select
            value={this.state.location}
            onChange={this.handleChange}
            inputProps={{
              name: 'location',
              id: 'location',
            }}
          >
            <MenuItem value="1">Vancouver</MenuItem>
            <MenuItem value="2">Abbotsford</MenuItem>
          </Select>
        </FormControl>
        &nbsp;&nbsp;&nbsp;&nbsp;
        Hello { AuthService.getUser() }!
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={this.signOut}>
          <Person />
          Sign out
        </Button>
        </div>
        ) : (<div></div>)}
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
