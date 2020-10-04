import React, { forwardRef } from 'react';
import ListItem from '@material-ui/core/ListItem';
import { NavLink, NavLinkProps } from 'react-router-dom';

const AppMenuItemComponent = (props) => {
  const {
    className, onClick, link, children,
  } = props;

  // If link is not set return the orinary ListItem
  if (!link || typeof link !== 'string') {
    return (
      <ListItem
        button
        className={className}
        onClick={onClick}
      >
        {children}
      </ListItem>
    );
  }

  // Return a LitItem with a link component
  return (
    // <NavLink
    //   to={link}
    //   className={className}
    //   activeClassName="active"
    //   key={link}
    // >
    //   {children}
    // </NavLink>
    <ListItem
      button
      className={className}
      component={forwardRef((props, ref) => <NavLink exact {...props} innerRef={ref} />)}
      to={link}
    >
      {children}
    </ListItem>
  );
};

export default AppMenuItemComponent;
