import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import Auth from '../../services/Auth';

const AppMenu = (props) => {
  const {
    routes,
    classes,
    color,
    activeRoute,
  } = props;

  return (
    <List className={classes.list}>
      {routes.map((item, index) => {
        if (item.redirect || item.sidebarName === '') {
          return null;
        }
        if (!Auth.userHasPermission(item.permission)) {
          return null;
        }
        const activePro = ' ';
        const listItemClasses = classNames({
          [` ${classes[color]}`]: activeRoute(item.path),
        });
        const whiteFontClasses = classNames({
          [` ${classes.whiteFont}`]: activeRoute(item.path),
        });
        return (
          <NavLink
            to={item.path}
            className={activePro + classes.item}
            activeClassName="active"
            key={item.path}
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
              <ListItemIcon className={classes.itemIcon + whiteFontClasses}>
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primary={item.sidebarName}
                className={classes.itemText + whiteFontClasses}
                disableTypography
              />
            </ListItem>
          </NavLink>
        );
      })}
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
