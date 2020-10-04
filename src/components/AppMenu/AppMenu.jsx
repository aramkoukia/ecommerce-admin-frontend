import React from 'react';
import PropTypes from 'prop-types';
import { List } from '@material-ui/core';
import AppMenuItem from './AppMenuItem';

const AppMenu = (props) => {
  const {
    routes,
    classes,
  } = props;

  return (
    <List className={classes.list} style={{ width: '100%' }}>
      {routes.map((item, index) => (
        <AppMenuItem
          key={index}
          {...item}
          {...props}
        />
      ))}
    </List>
  );
};

AppMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']).isRequired,
  routes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};


export default AppMenu;
