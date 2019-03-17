import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Print from '@material-ui/icons/Print';
import Email from '@material-ui/icons/Email';
import Money from '@material-ui/icons/Money';
import Edit from '@material-ui/icons/Edit';
import MUIDataTable from 'mui-datatables';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Button from '../../components/CustomButtons/Button';
import OrderService from '../../services/OrderService';
import CustomerInfo from '../Orders/CustomerInfo';
import CustomerService from '../../services/CustomerService';

function dateFormat(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()}`;
}

export default class Customer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      customer: {},
    };
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
    this.setState({
      customer,
      loading: false,
    });

    this.ordersList(customerId);
  }

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
    this.setState({ loading: true });
    await CustomerService.printStatement(customerId);
    this.setState({ loading: false });
  }

  async emailStatement() {
    const { match } = this.props;
    const customerId = match.params.id;
    this.setState({ loading: true });
    await CustomerService.emailStatement(customerId);
    this.setState({ loading: false });
  }

  ordersList(customerId) {
    const columns = ['locationName', 'orderId', 'orderDate', 'subTotal', 'total', 'status', 'poNumber', 'paidAmount', 'givenName'];
    this.setState({ loading: true });
    OrderService.getCustomerOrders(customerId)
      .then(results => results.map(row => columns.map((column) => {
        if (column === 'orderDate') {
          return dateFormat(row[column]);
        }
        return row[column] || '';
      })))
      .then(data => this.setState({ orders: data, loading: false }));
  }

  rowClicked(rowData) {
    const { history } = this.props;
    history.push(`/order/${rowData[1]}`);
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
      resizableColumns: true,
      selectableRows: false,
      rowsPerPageOptions: [25, 50, 100],
      rowsPerPage: 25,
    };

    const { orders, customer, loading } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={10}>
            <CustomerInfo customer={customer} />
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
            <Button color="secondary" onClick={this.printStatement}>
              <Print />
              Print Statement
            </Button>
            <Button color="secondary" onClick={this.emailStatement}>
              <Email />
              Email Statement
            </Button>
            {loading && <CircularProgress />}
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
