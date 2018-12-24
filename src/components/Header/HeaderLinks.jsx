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

const authService = new AuthService();

class HeaderLinks extends React.Component {
  state = {
    location: 'Vancouver',
  };

  componentDidMount() {
    this.setState({
       location: "Vancouver",
    });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  signOut() {
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
            <MenuItem value="Vancouver">Vancouver</MenuItem>
            <MenuItem value="Abbotsford">Abbotsford</MenuItem>
          </Select>
        </FormControl>
        &nbsp;&nbsp;&nbsp;&nbsp;
        { AuthService.getUser() }
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
