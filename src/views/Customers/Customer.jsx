import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Print from '@material-ui/icons/Print';
import Email from '@material-ui/icons/Email';
import Money from '@material-ui/icons/Money';
import Edit from '@material-ui/icons/Edit';
import MUIDataTable from 'mui-datatables';
import TextField from '@material-ui/core/TextField';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Button from '../../components/CustomButtons/Button';
import OrderService from '../../services/OrderService';
import CustomerInfo from '../Orders/CustomerInfo';
import CustomerOrderSummary from './CustomerOrderSummary';
import CustomerService from '../../services/CustomerService';

function dateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getUTCDate()}`.padStart(2, 0);
  const stringDate = [year, month, day].join('-');
  return stringDate;
}

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

export default class Customer extends React.Component {
  state = {
    orders: [],
    customer: {},
    fromDate: '',
    toDate: '',
  };

  constructor(props) {
    super(props);
    this.rowClicked = this.rowClicked.bind(this);
    this.editCustomer = this.editCustomer.bind(this);
    this.printStatement = this.printStatement.bind(this);
    this.emailStatement = this.emailStatement.bind(this);
    this.storeCredit = this.storeCredit.bind(this);
  }

  async componentDidMount() {
    const { match } = this.props;
    const customerId = match.params.id;
    const customer = await CustomerService.getCustomer(customerId);
    const customerOrderSummary = await CustomerService.getCustomerOrderSummary(customerId);
    const lastMonthDate = new Date().addHours(-8);
    const fromDate = dateFormat(new Date(lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)));
    const toDate = dateFormat((new Date()).addHours(-8));

    this.setState({
      customer,
      customerOrderSummary,
      loading: false,
      fromDate,
      toDate,
    });

    this.ordersList(customerId);
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  editCustomer() {
    const { match, history } = this.props;
    return history.push(`/editcustomer/${match.params.id}`);
  }

  storeCredit() {
    const { match, history } = this.props;
    return history.push(`/customerstorecredit/${match.params.id}`);
  }

  async printStatement() {
    const { match } = this.props;
    const customerId = match.params.id;
    const { fromDate, toDate } = this.state;
    this.setState({ loading: true });
    await CustomerService.printStatement(customerId, fromDate, toDate);
    this.setState({ loading: false });
  }

  async emailStatement() {
    const { match } = this.props;
    const customerId = match.params.id;
    const { fromDate, toDate } = this.state;
    this.setState({ loading: true });
    await CustomerService.emailStatement(customerId, fromDate, toDate);
    this.setState({ loading: false });
  }

  ordersList(customerId) {
    const columns = ['locationName', 'orderId', 'orderDate', 'subTotal', 'total', 'status', 'poNumber', 'paidAmount', 'givenName'];
    this.setState({ loading: true });
    OrderService.getCustomerOrders(customerId)
      .then((results) => results.map((row) => columns.map((column) => row[column] || '')))
      .then((data) => this.setState({ orders: data, loading: false }));
  }

  rowClicked(rowData) {
    const { history } = this.props;
    history.push({
      pathname: `/order/${rowData[1]}`,
      state: { orderId: rowData[1] },
    });
  }

  render() {
    const styles = {
      cardCategoryWhite: {
        '&,& a,& a:hover,& a:focus': {
          color: 'rgba(255,255,255,.62)',
          margin: '0',
          fontSize: '14px',
          marginTop: '0',
          marginBottom: '0',
        },
        '& a,& a:hover,& a:focus': {
          color: '#FFFFFF',
        },
      },
      cardTitleWhite: {
        color: '#FFFFFF',
        marginTop: '0px',
        minHeight: 'auto',
        fontWeight: '300',
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: '3px',
        textDecoration: 'none',
        '& small': {
          color: '#777',
          fontSize: '65%',
          fontWeight: '400',
          lineHeight: '1',
        },
      },
    };

    const columns = [
      'Location',
      {
        name: 'Order Number',
        options: {
          filter: false,
        },
      },
      {
        name: 'Order Date',
        options: {
          filter: false,
        },
      },
      {
        name: 'Sub Total',
        options: {
          filter: false,
        },
      },
      {
        name: 'Total',
        options: {
          filter: false,
        },
      },
      'Status',
      {
        name: 'PO Number',
        options: {
          filter: false,
        },
      },
      {
        name: 'Paid Amount',
        options: {
          filter: false,
        },
      },
      'Created By'];

    const options = {
      filterType: 'checkbox',
      onRowClick: this.rowClicked,
      rowHover: true,
      resizableColumns: false,
      selectableRows: false,
      rowsPerPageOptions: [25, 50, 100],
      rowsPerPage: 25,
    };

    const {
      orders,
      customer,
      customerOrderSummary,
      loading,
      fromDate,
      toDate,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <CustomerInfo customer={customer} />
          </GridItem>
          <GridItem xs={10}>
            <CustomerOrderSummary customerOrderSummary={customerOrderSummary} />
          </GridItem>
          <GridItem xs={2}>
            <Button color="primary" onClick={this.editCustomer}>
              <Edit />
              Edit
            </Button>
            <Button color="info" onClick={this.storeCredit}>
              <Money />
              Store Credit
            </Button>
            {loading && <CircularProgress />}
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardBody>
                <GridContainer>
                  <GridItem md={2}>
                    <TextField
                      onChange={this.handleChange('fromDate')}
                      id="date"
                      label="From Date"
                      type="date"
                      value={fromDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </GridItem>
                  <GridItem md={2}>
                    <TextField
                      onChange={this.handleChange('toDate')}
                      id="date"
                      label="To Date"
                      type="date"
                      value={toDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </GridItem>
                  <GridItem>
                    <Button color="secondary" onClick={this.printStatement}>
                      <Print />
                      Print Statement
                    </Button>
                  </GridItem>
                  <GridItem>
                    <Button color="secondary" onClick={this.emailStatement}>
                      <Email />
                      Email Statement
                    </Button>
                  </GridItem>
                  <GridItem md={1}>
                    {loading && <CircularProgress />}
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Customer Orders</div>
              </CardHeader>
              <CardBody>
                <MUIDataTable
                  title="Click on each order to navigate to the order details"
                  data={orders}
                  columns={columns}
                  options={options}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
