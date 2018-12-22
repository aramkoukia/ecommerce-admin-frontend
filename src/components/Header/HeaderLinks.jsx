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

  render() {
    const { classes } = this.props;

    return (
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
        <Button>
          <Person />
          Sign out
        </Button>
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
