import React from 'react';
import PropTypes from 'prop-types';
import { List } from '@material-ui/core';
import AppMenuItem from './AppMenuItem';

const AppMenu = (props) => {
  const {
    routes,
    classes,
    activeRoute,
    color,
  } = props;

  return (
    <List className={classes.list}>
      {routes.map((item) => (
        <AppMenuItem
          key={item.path}
          item={item}
          color={color}
          classes={classes}
          activeRoute={activeRoute}
        />
      ))}
    </List>
  );
};

AppMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']).isRequired,
  routes: PropTypes.object.isRequired,
  activeRoute: PropTypes.object.isRequired,
};


export default AppMenu;
