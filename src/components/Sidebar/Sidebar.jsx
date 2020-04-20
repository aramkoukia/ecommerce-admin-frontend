import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import sidebarStyle from '../../assets/jss/material-dashboard-react/components/sidebarStyle';
import HeaderLinks from '../Header/HeaderLinks';
import Auth from '../../services/Auth';

const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return props.location.pathname.indexOf(routeName) > -1;
  }
  const {
    classes,
    color,
    logo,
    image,
    logoText,
    routes,
    open,
    handleDrawerToggle,
  } = props;

  const links = (
    <List className={classes.list}>
      {routes.map((prop) => {
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
            key={prop.path}
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
  const locations = Auth.getUserLocations();

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
            && (<HeaderLinks locations={locations} location={locations[0]} />)}
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

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.object.isRequired,
  logo: PropTypes.object.isRequired,
  image: PropTypes.object.isRequired,
  logoText: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  open: PropTypes.object.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

export default withStyles(sidebarStyle)(Sidebar);
