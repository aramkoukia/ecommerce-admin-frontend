import React from 'react';
import classNames from 'classnames';
// import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import sidebarStyle from '../../assets/jss/material-dashboard-react/components/sidebarStyle';
import HeaderLinks from '../Header/HeaderLinks';
import Auth from '../../services/Auth';
// import LocationService from '../../services/LocationService';

const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return props.location.pathname.indexOf(routeName) > -1;
  }
  const {
    classes, color, logo, image, logoText, routes, open, handleDrawerToggle,
  } = props;

  function getLocations() {
    return [
      {
        locationId: 1,
        locationName: 'Vancouver',
      },
      {
        locationId: 2,
        locationName: 'Abbotsford',
      },
      {
        locationId: 3,
        locationName: 'Victoria',
      },
    ];
    // return LocationService.getLocationsForUser();
  }

  // async function getLocations() {
  //   if (Auth.isSignedIn()) {
  //     LocationService.getLocationsForUser()
  //       .then(results => this.setState({
  //         locations: results,
  //         isLoading: false,
  //       }));
  //   }
  // }

  const links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        // todo: check permissions here ...
        if (prop.redirect || prop.sidebarName === '') {
          return null;
        }
        if (!Auth.userHasPermission(prop.permission)) {
          return null;
        }
        const activePro = ' ';
        const listItemClasses = classNames({
          [` ${classes[color]}`]: activeRoute(prop.path),
        });
        const whiteFontClasses = classNames({
          [` ${classes.whiteFont}`]: activeRoute(prop.path),
        });
        return (
          <NavLink
            to={prop.path}
            className={activePro + classes.item}
            activeClassName="active"
            key={key}
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
              <ListItemIcon className={classes.itemIcon + whiteFontClasses}>
                {typeof prop.icon === 'string' ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <prop.icon />
                )}
              </ListItemIcon>
              <ListItemText
                primary={prop.sidebarName}
                className={classes.itemText + whiteFontClasses}
                disableTypography
              />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );
  const brand = (
    <div className={classes.logo}>
      <a href="https://lightsandparts.com/" target="_blank" rel="noopenner noreferrer" className={classes.logoLink}>
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </a>
    </div>
  );
  const locations = getLocations();

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="right"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {locations
            && (<HeaderLinks locations={locations} location={locations[0]} />)
            }
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: `url(${image})` }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor="left"
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: `url(${image})` }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
};

// Sidebar.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(sidebarStyle)(Sidebar);
