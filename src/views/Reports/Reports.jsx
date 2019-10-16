import React from 'react';
import PropTypes from 'prop-types';
import ChartistGraph from 'react-chartist';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Icon from '@material-ui/core/Icon';
import Store from '@material-ui/icons/Store';
import DateRange from '@material-ui/icons/DateRange';
import LocalOffer from '@material-ui/icons/LocalOffer';
import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from '../../variables/charts';
import dashboardStyle from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardIcon from '../../components/Card/CardIcon';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import ReportService from '../../services/ReportService';

class Reports extends React.Component {
  constructor(props) {
    super(props);

    this.state = { monthlySummary: {}, loading: false };
  }

  componentDidMount() {

    this.setState({ loading: true });

    ReportService.getMonthlySummary()
      .then(result => this.setState({ monthlySummary: result[0] }));


    ReportService.getMonthlySales()
      .then((result) => {
        const monthlySalesData = {
          labels: result.map(item => item.label),
          series: [result.map(item => item.value)],
        };
        this.setState({ monthlySalesData, loading: false });
      });

    ReportService.getMonthlyPurchases()
      .then((result) => {
        const monthlyPurchaseData = {
          labels: result.map(item => item.label),
          series: [result.map(item => item.value)],
        };
        this.setState({ monthlyPurchaseData });
      });

    ReportService.getDailySales()
      .then((result) => {
        const dailySalesData = {
          labels: result.map(item => item.label),
          series: [result.map(item => item.value)],
        };
        this.setState({ dailySalesData });
      });
  }

  render() {
    const { classes } = this.props;
    const {
      monthlySummary, dailySalesData, monthlySalesData, monthlyPurchaseData, loading,
    } = this.state;
    return (
      <div>
        { monthlySummary && (
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Store />
                </CardIcon>
                <p className={classes.cardCategory}>Monthly Orders (Paid only)</p>
                <h3 className={classes.cardTitle}>
$
                  {monthlySummary.monthlyPaidOrders}
                                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <DateRange />
                  This Month
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Store />
                </CardIcon>
                <p className={classes.cardCategory}>Monthly Orders (Paid/Account)</p>
                <h3 className={classes.cardTitle}>
$
                  {monthlySummary.monthlyPaidAccountOrders}
                                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <DateRange />
                  This Month
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <Icon>info_outline</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Monthly Purchases</p>
                <h3 className={classes.cardTitle}>
$
                  {monthlySummary.monthlyPurchases}
                                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <LocalOffer />
                  This Month
                </div>
              </CardFooter>
            </Card>
          </GridItem>

          {/* <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>New Customer</p>
                <h3 className={classes.cardTitle}>+245</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  This Month
                </div>
              </CardFooter>
            </Card>
          </GridItem> */}
        </GridContainer>
        )}
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={dailySalesData}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Daily Sales (/1000$)</h4>
                <p className={classes.cardCategory}>
                  {/* <span className={classes.successText}>
                     <ArrowUpward className={classes.upArrowCardCategory} />
                    {' '}
                    55%

                  {' '}
                  increase in today sales. */}
                  Paid and Account order statuses (all locations)
                </p>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart>
              <CardHeader color="warning">
                <ChartistGraph
                  className="ct-chart"
                  data={monthlySalesData}
                  type="Bar"
                  options={emailsSubscriptionChart.options}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Sales by Month (/1000$)</h4>
                <p className={classes.cardCategory}>
                  Paid and Account order statuses (all locations)
                </p>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart>
              <CardHeader color="danger">
                <ChartistGraph
                  className="ct-chart"
                  data={monthlyPurchaseData}
                  type="Bar"
                  options={completedTasksChart.options}
                  listener={completedTasksChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Purchase by Month (/1000$)</h4>
                <p className={classes.cardCategory}>
                  All purchase statuses
                </p>
              </CardBody>
            </Card>
            { loading && (<LinearProgress />) }
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Reports.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(Reports);
