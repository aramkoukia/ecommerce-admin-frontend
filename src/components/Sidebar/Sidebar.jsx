import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import PropTypes from 'prop-types';
import sidebarStyle from '../../assets/jss/material-dashboard-react/components/sidebarStyle';
import HeaderLinks from '../Header/HeaderLinks';
import AppMenu from '../AppMenu/AppMenu';
import Auth from '../../services/Auth';

const Sidebar = ({ ...props }) => {
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

  const brand = (
    <div>
      { logoText && (
      <div className={classes.logo}>
        <a href="https://lightsandparts.com/" target="_blank" rel="noopenner noreferrer" className={classes.logoLink}>
          <div className={classes.logoImage}>
            <img src={logo} alt="logo" className={classes.img} />
          </div>
          {logoText}
        </a>
      </div>
      )}
      {!logoText && (
      <div className={classes.logoWithoutTitle}>
        <img src={logo} alt="logo" className={classes.imgWithoutTitle} />
      </div>
      )}
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
            <AppMenu
              routes={routes}
              classes={classes}
              color={color}
              {...props}
            />
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
          <div className={classes.sidebarWrapper}>
            <AppMenu
              routes={routes}
              classes={classes}
              color={color}
              {...props}
            />
          </div>
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
  logoText: PropTypes.string.isRequired,
  routes: PropTypes.object.isRequired,
  open: PropTypes.object.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withStyles(sidebarStyle)(Sidebar);
