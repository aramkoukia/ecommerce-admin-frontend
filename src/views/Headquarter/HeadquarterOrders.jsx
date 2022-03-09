import React from 'react';
import {
  MenuItem,
  CircularProgress,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MaterialTable from 'material-table';
import { StylesProvider, createGenerateClassName } from '@material-ui/styles';
import GridItem from '../../components/Grid/GridItem';
import Button from '../../components/CustomButtons/Button';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import HeadquarterOrderService from '../../services/HeadquarterOrderService';
import BrandService from '../../services/BrandService';
import { Order } from '../Orders/Order';

const generateClassName = createGenerateClassName({
  productionPrefix: 'mt',
  seed: 'mt',
});

function dateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getUTCDate()}`.padStart(2, 0);
  const stringDate = [year, month, day].join('-');
  return stringDate;
}

function ccyFormat(num) {
  return `${num.toFixed(2)} $`;
}

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default class HeadquarterOrders extends React.Component {
  state = {
    orders: [],
    loading: false,
    brandId: 0,
    orderId: 0,
    showOrder: false,
    brands: [
      {
        brandId: 0,
        brandName: 'All',
      },
    ],
    columns: [
      { title: 'BrandName', field: 'brandName' },
      { title: 'Order Id', field: 'orderId' },
      { title: 'Order Date', field: 'orderDate' },
      { title: 'Sub Total', field: 'subTotal' },
      { title: 'Total', field: 'total' },
      {
        title: 'Status',
        field: 'status',
        lookup: {
          Paid: 'Paid', Return: 'Return', Account: 'Account', Quote: 'Quote', OnHold: 'OnHold',
        },
      },
      { title: 'PO Number', field: 'poNumber' },
      { title: 'Paid Amount', field: 'paidAmount' },
      {
        title: 'Payment Type',
        field: 'paymentTypeName',
      },
      { title: 'Due Date', field: 'dueDate' },
      { title: 'Company Name', field: 'companyName' },
      {
        title: 'PST Charged',
        field: 'pstCharged',
        lookup: {
          Yes: 'Yes',
          No: 'No',
        },
      },
      {
        title: 'PST Amount',
        field: 'pstAmount',
        hidden: true,
      },
      {
        title: 'Overdue',
        field: 'overDue',
        hidden: true,
      },
      { title: 'Location', field: 'locationName' },
      { title: 'User', field: 'givenName' },
    ],
    options: {
      paging: true,
      pageSizeOptions: [25, 50, 100],
      pageSize: 25,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      search: true,
      rowStyle: (data) => {
        if (data.overDue === 'Yes') {
          return {
            backgroundColor: '#ffcccc',
          };
        }
      },
    },
  };

  constructor(props) {
    super(props);
    this.rowClicked = this.rowClicked.bind(this);
    this.searchClicked = this.searchClicked.bind(this);
  }

  async componentDidMount() {
    const lastMonthDate = new Date().addHours(-8);
    const fromDate = dateFormat(new Date(lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)));
    const toDate = dateFormat((new Date()).addHours(-8));
    this.setState({
      fromDate,
      toDate,
    });
    await this.getBrands();
    this.ordersList(0, fromDate, toDate);
  }

  async getBrands() {
    const { brands } = this.state;
    BrandService.getBrands()
      .then((results) => this.setState({
        brands: [...brands, ...results],
      }));
  }

  handleClose = () => {
    this.setState({
      showOrder: false,
      orderId: 0,
    });
  };

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleBrandChange = (event) => {
    this.setState({ brandId: event.target.value });
    const { fromDate, toDate } = this.state;
    this.ordersList(event.target.value, fromDate, toDate);
  }

  ordersList(brandId, fromDate, toDate) {
    this.setState({ loading: true });

    HeadquarterOrderService.getOrdersByBrand(brandId, fromDate, toDate)
      .then((data) => this.setState({ orders: data, loading: false }));
  }

  rowClicked(_event, rowData) {
    this.setState({
      showOrder: true,
      orderId: rowData.orderId,
    });
  }

  searchClicked() {
    const { fromDate, toDate, brandId } = this.state;
    this.ordersList(brandId, fromDate, toDate);
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

    const detailPanel = [
      {
        tooltip: 'Details',
        render: (rowData) => (
          <div
            style={{
              width: '60%',
              backgroundColor: '#ccf9ff',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell numeric>Amount</TableCell>
                  <TableCell numeric>Unit Price</TableCell>
                  <TableCell numeric>Discount</TableCell>
                  <TableCell numeric>Total Price (After discount)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowData.orderDetail.map((row) => (
                  <TableRow key={row.productId}>
                    <TableCell>
                      {row.productName}
                      {row.package && (
                        ` ( pkg: ${row.package} ) ${row.amountInMainPackage}x`
                      )}
                    </TableCell>
                    <TableCell numeric align="right">{row.amount}</TableCell>
                    <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                    <TableCell numeric>{ccyFormat(row.totalDiscount)}</TableCell>
                    <TableCell numeric>{ccyFormat(row.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ),
      },
    ];

    const {
      orders,
      loading,
      brands,
      brandId,
      fromDate,
      toDate,
      orderId,
      showOrder,
      columns,
      options,
    } = this.state;

    // const classes = useStyles();

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Brand Orders List</div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem md={4}>
                    <FormControl className={styles.formControl}>
                      <InputLabel htmlFor="brand">Brand</InputLabel>
                      <Select
                        value={brandId}
                        onChange={this.handleBrandChange}
                        style={{
                          minWidth: 300,
                          padding: 5,
                          margin: 5,
                        }}
                        inputProps={{
                          name: 'brand',
                          id: 'brand',
                          width: '300',
                        }}
                      >
                        {brands && (
                          brands.map((l, key) => (
                            <MenuItem
                              name={key}
                              value={l.brandId}
                            >
                              {l.brandName}
                            </MenuItem>
                          )))}
                      </Select>
                    </FormControl>
                  </GridItem>
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
                  <GridItem md={1}>
                    <Button color="info" onClick={this.searchClicked}>Search</Button>
                  </GridItem>
                  <GridItem md={1}>
                    {loading && <CircularProgress />}
                  </GridItem>
                </GridContainer>
                <StylesProvider generateClassName={generateClassName}>
                  <MaterialTable
                    columns={columns}
                    data={orders}
                    detailPanel={detailPanel}
                    options={options}
                    onRowClick={this.rowClicked}
                    title=""
                  />
                </StylesProvider>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Dialog
          fullScreen
          open={showOrder}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          TransitionComponent={Transition}
        >
          <AppBar style={{ position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                <CloseIcon />
                Close
              </IconButton>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <Order orderId={orderId} {...this.props} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
