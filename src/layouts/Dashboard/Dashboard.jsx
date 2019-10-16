import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/Sidebar/Sidebar';
import dashboardRoutes from '../../routes/dashboard';
import dashboardStyle from '../../assets/jss/material-dashboard-react/layouts/dashboardStyle';
import image from '../../assets/img/sidebar-2.jpg';
import logo from '../../assets/img/logo.png';
import Auth from '../../services/Auth';
import AddOrder from '../../views/Orders/AddOrder';
import { Return } from '../../views/Orders/Return';

function requireAuth(nextState, replace) {
  if (!Auth.isSignedIn) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      permissionsChanged: false,
    };
    this.resizeFunction = this.resizeFunction.bind(this);
    this.permissionsChanged = this.permissionsChanged.bind(this);
  }

  permissionsChanged() {
    this.setState({ permissionsChanged: true });
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  getRoute() {
    return this.props.location.pathname !== '/maps';
  }

  isLogin() {
    return this.props.location.pathname === '/login';
  }

  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeFunction);
  }

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFunction);
  }

  render() {
    const { classes, ...rest } = this.props;
    const { permissionsChanged } = this.state;

    const switchRoutes = (
      <Switch>
        {dashboardRoutes.map((prop, key) => {
          if (prop.redirect) {
            return <Redirect from={prop.path} to={prop.to} key={key} />;
          }

          if (prop.path === '/neworder/:id') {
            return <Route path={prop.path} key={key} onEnter={requireAuth} render={props => (<AddOrder {...props} permissionsChanged={this.permissionsChanged} />)} />;
          }

          if (prop.path === '/return/:id') {
            return <Route path={prop.path} key={key} onEnter={requireAuth} render={props => (<Return {...props} permissionsChanged={this.permissionsChanged} />)} />;
          }

          return <Route path={prop.path} component={prop.component} key={key} onEnter={requireAuth} />;
        })}
      </Switch>
    );

    return (
      <div className={classes.wrapper}>

        { !this.isLogin() ? (
          <Sidebar
            routes={dashboardRoutes}
            permissionsChanged={permissionsChanged}
            logoText="Lights and Parts"
            logo={logo}
            image={image}
            handleDrawerToggle={this.handleDrawerToggle}
            open={this.state.mobileOpen}
            color="blue"
            {...rest}
          />
        ) : <div />
        }

        <div className={classes.mainPanel} ref="mainPanel">

          <Header
            routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />

          {/* On the /maps route we want the map to be on full screen -
          this is not possible if the content and conatiner
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
};

export default withStyles(dashboardStyle)(App);
