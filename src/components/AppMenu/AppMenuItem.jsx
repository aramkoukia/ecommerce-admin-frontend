import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
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

const AppMenuItem = (props) => {
  const {
    item,
    classes,
    color,
    activeRoute,
  } = props;

  const isExpandable = items && items.length > 0;
  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
  }

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

  const MenuItemRoot = (
    <ListItem button className={classes.menuItem} onClick={handleClick}>
      {/* Display an icon if any */}
      <ListItemIcon className={classes.itemIcon + whiteFontClasses}>
        <item.icon />
      </ListItemIcon>
      <ListItemText
        primary={item.sidebarName}
        className={classes.itemText + whiteFontClasses}
        disableTypography
        // inset={!Icon}
      />
      {/* Display the expand menu if the item has children */}
      {isExpandable && !open && <IconExpandMore />}
      {isExpandable && open && <IconExpandLess />}
    </ListItem>
  );

  const MenuItemChildren = isExpandable ? (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Divider />
      <List component="div" disablePadding>
        {item.items.map((item, index) => (
          <AppMenuItem {...item} key={index} />
        ))}
      </List>
    </Collapse>
  ) : null;

  return (
    <>
      {MenuItemRoot}
      {MenuItemChildren}
    </>
    // <NavLink
    //   to={item.path}
    //   className={activePro + classes.item}
    //   activeClassName="active"
    //   key={item.path}
    // >
    //   <ListItem button className={classes.itemLink + listItemClasses}>
    //     <ListItemIcon className={classes.itemIcon + whiteFontClasses}>
    //       <item.icon />
    //     </ListItemIcon>
    //     <ListItemText
    //       primary={item.sidebarName}
    //       className={classes.itemText + whiteFontClasses}
    //       disableTypography
    //     />
    //   </ListItem>
    // </NavLink>
  );
};

AppMenuItem.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']).isRequired,
  item: PropTypes.object.isRequired,
  activeRoute: PropTypes.object.isRequired,
};

export default AppMenuItem;
