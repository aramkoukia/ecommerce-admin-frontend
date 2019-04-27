import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MaterialTable from 'material-table';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import OrderService from '../../services/OrderService';
import LocationService from '../../services/LocationService';

export default class Orders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      showAllOrders: false,
      loading: false,
      locationId: 0,
      locations: [
        {
          locationId: 0,
          locationName: 'All',
        },
      ],
    };

    this.rowClicked = this.rowClicked.bind(this);
  }

  async componentDidMount() {
    await this.getLocations();
    this.ordersList(0);
  }

  async getLocations() {
    const { locations } = this.state;
    LocationService.getLocationsForUser()
      .then(results => this.setState({
        locations: [...locations, ...results],
      }));
  }

  handleChange = name => (event) => {
    this.setState({ [name]: event.target.checked });
    this.ordersList();
  };

  handleLocationChange = (event) => {
    this.setState({ locationId: event.target.value });
    this.ordersList(event.target.value);
  }

  ordersList(locationId) {
    const { showAllOrders } = this.state;
    this.setState({ loading: true });

    OrderService.getOrdersByLocation(locationId, showAllOrders)
      .then(data => this.setState({ orders: data, loading: false }));
  }

  rowClicked(_event, rowData) {
    window.open(`/order/${rowData.orderId}`, "_blank")
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
      formControl: {
        margin: 10,
        padding: 10,
        minWidth: 300,
      },
      selectEmpty: {
        marginTop: 10 * 2,
      },
    };

    const columns = [
      { title: 'Location', field: 'locationName' },
      { title: 'Order Id', field: 'orderId' },
      { title: 'Order Date', field: 'orderDate' },
      { title: 'Sub Total', field: 'subTotal' },
      { title: 'Total', field: 'total' },
      {
        title: 'Status',
        field: 'status',
        lookup: {
          Paid: 'Paid', Return: 'Return', Account: 'Account', Draft: 'Draft', OnHold: 'OnHold',
        },
      },
      { title: 'PO Number', field: 'poNumber' },
      { title: 'Paid Amount', field: 'paidAmount' },
      { title: 'User', field: 'givenName' },
      {
        title: 'Payment Type',
        field: 'paymentTypeName',
        // lookup: {
        //   'Credit Card / Debit': 'Credit Card / Debit', Cash: 'Cash', Cheque: 'Cheque', 'Store Credit': 'Store Credit', 'Paypal and Amazon + USD Account': 'Paypal and Amazon + USD Account',
        // },
      },
      { title: 'Due Date', field: 'dueDate' },
      {
        title: 'Over Due',
        field: 'overDue',
        hidden: true,
      },
      { title: 'Company Name', field: 'companyName' },
    ];

    const options = {
      paging: true,
      pageSizeOptions: [25, 50, 100],
      pageSize: 25,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      rowStyle: data => {
        if (data.overDue === 'Yes') {
          return {
            backgroundColor: '#ffcccc',
          }
        }
      }
    };

    const {
      orders, showAllOrders, loading, locations, locationId,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Orders List</div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem md={4}>
                    <FormControl className={styles.formControl}>
                      <InputLabel htmlFor="location">Location</InputLabel>
                      <Select
                        value={locationId}
                        onChange={this.handleLocationChange}
                        style={{
                          minWidth: 300,
                          padding: 5,
                          margin: 5,
                        }}
                        inputProps={{
                          name: 'location',
                          id: 'location',
                          width: '300',
                        }}
                      >
                        {locations && (
                          locations.map((l, key) => (<MenuItem name={key} value={l.locationId}>{l.locationName}</MenuItem>)))
                        }
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem md={3}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={showAllOrders}
                          onChange={this.handleChange('showAllOrders')}
                          name="showAllOrders"
                          value="showAllOrders"
                          color="primary"
                        />
                      )}
                      label="Load orders older than 3 month"
                    />
                  </GridItem>
                  <GridItem md={1}>
                    {loading && <CircularProgress />}
                  </GridItem>
                </GridContainer>
                <MaterialTable
                  columns={columns}
                  data={orders}
                  options={options}
                  onRowClick={this.rowClicked}
                  title=""
                  // title="Click on each order to navigate to the order details"
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
