import React from 'react';
import classNames from 'classnames';
// import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';
import Auth from '../../services/Auth';
import AppMenuItemComponent from './AppMenuItemComponent';

const useStyles = makeStyles((theme) => createStyles({
  menuItem: {
    color: 'white',
    '& .MuiListItem-root': {
      'padding-bottom': '0',
      'padding-top': '0',
    },
    '& .MuiListItemIcon-root': {
      'min-width': '40px',
    },
    '&.active': {
      background: 'rgba(0,172,193, 0.20)',
      '& .MuiListItemIcon-root': {
        color: '#00acc1',
      },
    },
  },
  menuItemIcon: {
    color: '#fff',
  },
}));

const AppMenuItem = (props) => {
  const classes = useStyles();
  const {
    sidebarName,
    navbarName,
    permission,
    path,
    Icon,
    items = [],
  } = props;

  const isExpandable = items && items.length > 0;
  const userHasPermission = () => (path !== undefined
                                   && Auth.userHasPermission(permission)) || path === undefined;
  const isNavigation = sidebarName !== '';
  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
  }

  const MenuItemRoot = isNavigation && (
    <AppMenuItemComponent className={classes.menuItem} link={path} onClick={handleClick}>
      <ListItem button className={classes.menuItem} onClick={handleClick}>
        {/* Display an icon if any */}
        {!!Icon && (
          <ListItemIcon className={classes.menuItemIcon}>
            <Icon />
          </ListItemIcon>
        )}
        <ListItemText
          primary={sidebarName}
          className={classes.menuItem}
          disableTypography
        />
        {/* Display the expand menu if the item has children */}
        {isExpandable
          && !open
          && <IconExpandMore className={classes.itemIcon} />}
        {isExpandable
          && open
          && <IconExpandLess className={classes.itemIcon} />}
      </ListItem>
    </AppMenuItemComponent>
  );

  const MenuItemChildren = userHasPermission()
    && isExpandable
    ? (
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Divider />
        <List component="div" style={{ padding: 0, margin: 0 }}>
          {items.map((menu, index) => (
            <AppMenuItem {...menu} key={index} />
          ))}
        </List>
      </Collapse>
    ) : null;

  return (
    <>
      {MenuItemRoot}
      {MenuItemChildren}
    </>
  );
};

AppMenuItem.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
  history: PropTypes.object.isRequired,
  items: PropTypes.object,
  sidebarName: PropTypes.object,
  permission: PropTypes.object,
  path: PropTypes.object,
  Icon: PropTypes.object,
};

export default AppMenuItem;
