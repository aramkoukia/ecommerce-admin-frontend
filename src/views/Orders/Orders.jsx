import React from 'react';
import MUIDataTable from 'mui-datatables';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import OrderService from '../../services/OrderService';
import Location from '../../stores/Location';

const orderService = new OrderService();


function dateFormat(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()}`;
}

export default class Orders extends React.Component {
  constructor(props) {
    super(props);

    this.state = { orders: [] };
    this.rowClicked = this.rowClicked.bind(this);
  }

  componentDidMount() {
    this.ordersList();
  }

  ordersList() {
    const columns = ['locationName', 'orderId', 'orderDate', 'subTotal', 'total', 'status', 'poNumber', 'paidAmount', 'createdByUserId'];
    const locationId = Location.getStoreLocation();
    orderService.getOrdersByLocation(locationId)
      .then(results => results.map(row => columns.map((column) => {
        if (column === 'orderDate') {
          return dateFormat(row[column]);
        }
        return row[column] || '';
      })))
      .then(data => this.setState({ orders: data }));
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
    };

    const { orders } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Orders List</div>
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

// export default withStyles(styles)(Customers);
