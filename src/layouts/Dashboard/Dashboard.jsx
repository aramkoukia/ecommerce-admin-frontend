/* eslint-disable react/no-string-refs */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/Sidebar/Sidebar';
import { dashboardRoutes, headQuarterRoutes, loginRoutes } from '../../routes/dashboard';
import dashboardStyle from '../../assets/jss/material-dashboard-react/layouts/dashboardStyle';
import Auth from '../../services/Auth';
import AddOrder from '../../views/Orders/AddOrder';
import { Return } from '../../views/Orders/Return';
import { RMA } from '../../views/Orders/RMA';
import PortalSettingsService from '../../services/PortalSettingsService';
import Api from '../../services/ApiConfig';
import image from '../../assets/img/sidebar-2.jpg';
import logo from '../../assets/img/logo.png';

function requireAuth(nextState, replace) {
  if (!Auth.isSignedIn) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
}

function flattenRoutes(isHeadQuarterStore) {
  let routes = [];
  if (isHeadQuarterStore) {
    routes = dashboardRoutes.concat(headQuarterRoutes).concat(loginRoutes);
  } else {
    routes = dashboardRoutes.concat(loginRoutes);
  }
  const result = routes.map((prop) => {
    if (prop.items && prop.items.length > 0) {
      return prop.items;
    }
    return prop;
  });
  return result.flat();
}

class App extends React.Component {
  state = {
    mobileOpen: false,
    permissionsChanged: false,
    portalSettings: {},
    mergedRoutes: [],
    routes: [],
  };

  constructor(props) {
    super(props);
    this.resizeFunction = this.resizeFunction.bind(this);
    this.permissionsChanged = this.permissionsChanged.bind(this);
  }

  async componentDidMount() {
    window.addEventListener('resize', this.resizeFunction);
    const portalSettings = await PortalSettingsService.getPortalSettings();
    const mergedRoutes = portalSettings.isHeadQuarterStore
      ? dashboardRoutes.concat(headQuarterRoutes).concat(loginRoutes)
      : dashboardRoutes.concat(loginRoutes);
    const routes = flattenRoutes(portalSettings.isHeadQuarterStore);
    this.setState({
      portalSettings,
      mergedRoutes,
      routes,
    });
    document.title = portalSettings.portalTitle;
  }

  componentDidUpdate(e) {
    const { mobileOpen } = this.state;
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (mobileOpen) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ mobileOpen: false });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFunction);
  }

  getRoute() {
    const { location } = this.props;
    return location.pathname !== '/maps';
  }

  handleDrawerToggle = () => {
    const { mobileOpen } = this.state;
    this.setState({ mobileOpen: !mobileOpen });
  }

  permissionsChanged() {
    this.setState({ permissionsChanged: true });
  }

  isLogin() {
    const { location } = this.props;
    return location.pathname === '/login';
  }

  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }

  render() {
    const { classes, color, ...rest } = this.props;
    const {
      permissionsChanged,
      portalSettings,
      mobileOpen,
      mergedRoutes,
      routes,
    } = this.state;
    const logoImageUrl = portalSettings ? `${Api.apiRoot}/${portalSettings.logoImageUrl}` : logo;
    const sidebarImageUrl = portalSettings ? `${Api.apiRoot}/${portalSettings.sidebarImageUrl}` : image;
    const sideBarTitle = portalSettings.ShowTitleOnSideBar ? portalSettings.portalTitle : '';

    const switchRoutes = (
      <Switch>
        {routes.map((prop, index) => {
          if (prop.redirect) {
            return <Redirect from={prop.path} to={prop.to} key={index.toString()} />;
          }

          if (prop.path === '/neworder/:id') {
            return (
              <Route
                path={prop.path}
                key={index.toString()}
                onEnter={requireAuth}
                render={(props) => (
                  <AddOrder {...props} permissionsChanged={this.permissionsChanged} />)}
              />
            );
          }

          if (prop.path === '/return/:id') {
            return (
              <Route
                path={prop.path}
                key={index.toString()}
                onEnter={requireAuth}
                render={(props) => (
                  <Return {...props} permissionsChanged={this.permissionsChanged} />)}
              />
            );
          }

          if (prop.path === '/rma/:id') {
            return (
              <Route
                path={prop.path}
                key={index.toString()}
                onEnter={requireAuth}
                render={(props) => (
                  <RMA {...props} permissionsChanged={this.permissionsChanged} />)}
              />
            );
          }

          return (
            <Route
              path={prop.path}
              component={prop.component}
              key={index.toString()}
              onEnter={requireAuth}
            />
          );
        })}
      </Switch>
    );

    return (
      <div className={classes.wrapper}>

        { !this.isLogin() ? (
          <Sidebar
            routes={mergedRoutes}
            permissionsChanged={permissionsChanged}
            logoText={sideBarTitle}
            logo={logoImageUrl}
            image={sidebarImageUrl}
            handleDrawerToggle={this.handleDrawerToggle}
            open={mobileOpen}
            color="blue"
            {...rest}
          />
        ) : <div />}

        <div className={classes.mainPanel} ref="mainPanel">
          { !this.isLogin() ? (
            <Header
              handleDrawerToggle={this.handleDrawerToggle}
              classes={classes}
              color={color}
            />
          ) : <div />}
          {/* On the /maps route we want the map to be on full screen -
          this is not possible if the content and container
          classes are present because they have some
          paddings which would make the map smaller */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{switchRoutes}</div>
          )}
          {this.getRoute() ? <Footer /> : null}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(App);
