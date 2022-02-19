import React from 'react';
import MUIDataTable from 'mui-datatables';
import MaterialTable from 'material-table';
import {
  CircularProgress,
  LinearProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Print from '@material-ui/icons/Print';
import Search from '@material-ui/icons/Search';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Button from '../../components/CustomButtons/Button';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import { Order } from '../Orders/Order';
import ReportService from '../../services/ReportService';

function dateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getUTCDate()}`.padStart(2, 0);
  const stringDate = [year, month, day].join('-');
  return stringDate;
}

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

export default class SalesReport extends React.Component {
  state = {
    fromDate: '',
    toDate: '',
    loading: false,
    showOrder: false,
    orderId: 0,
    materialTableOptions: {
      paging: true,
      pageSizeOptions: [25, 50, 100],
      pageSize: 25,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      search: true,
      addRowPosition: 'first',
    },
  };

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.print = this.print.bind(this);
  }

  componentDidMount() {
    const fromDate = dateFormat((new Date()).addHours(-8));
    const toDate = dateFormat((new Date()).addHours(-8));
    this.setState({
      fromDate,
      toDate,
    });
  }

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          fontSize: '15px',
        },
      },
      MUIDataTable: {
        responsiveScroll: {
          maxHeight: 'none',
        },
      },
      MUIDataTableToolbar: {
        titleText: {
          fontSize: '12px',
          'margin-top': '45px',
          position: 'relative',
        },
      },
    },
  })

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClose = () => {
    this.setState({
      showOrder: false,
      orderId: 0,
    });
  };

  search() {
    const { fromDate, toDate } = this.state;
    this.setState({ loading: true });
    const salesColumns = ['locationName', 'status', 'transactions', 'gst', 'pst', 'otherTax', 'discount', 'subTotal', 'total'];
    ReportService.getSales(fromDate, toDate)
      .then((results) => results.map((row) => salesColumns.map((column) => row[column] || '')))
      .then((data) => this.setState({ reportData: data, loading: false }));

    ReportService.getSalesOrders(fromDate, toDate)
      .then((data) => this.setState({ orderData: data, loading: false }));
  }

  print() {
    const { fromDate, toDate } = this.state;
    this.setState({ loading: true });
    ReportService.getSalesPdf(fromDate, toDate)
      .then(() => this.setState({ loading: false }));
  }

  showDetails(orderId) {
    this.setState({
      orderId,
      showOrder: true,
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
      {
        name: 'Location',
      },
      {
        name: 'Status',
      },
      {
        name: 'Transactions',
      },
      {
        name: 'GST ($)',
      },
      {
        name: 'PST ($)',
      },
      {
        name: 'Other Tax ($)',
      },
      {
        name: 'Discount ($)',
      },
      {
        name: 'Sub Total ($)',
      },
      {
        name: 'Total ($)',
      }];

    const orderColumns = [
      {
        title: 'Order Number',
        field: 'orderId',
      },
      {
        title: 'Order Date',
        field: 'orderDate',
      },
      {
        title: 'Sub Total ($)',
        field: 'subTotal',
      },
      {
        field: 'total',
        title: 'Total ($)',
      },
      {
        field: 'taxAmount',
        title: 'Tax ($)',
      },
      {
        field: 'totalDiscount',
        title: 'Discount ($)',
      },
      {
        field: 'status',
        title: 'Status',
      },
      {
        field: 'restockingFeeAmount',
        title: 'Restocking Fee ($)',
      },
      {
        field: 'locationName',
        title: 'Location',
      }];

    const options = {
      filterType: 'checkbox',
      rowHover: true,
      resizableColumns: false,
      selectableRows: false,
      rowsPerPageOptions: [25, 50, 100],
      rowsPerPage: 25,
      responsive: 'scroll',
    };

    const {
      reportData, fromDate, toDate, loading, orderData,
      materialTableOptions,
      orderId,
      showOrder,
    } = this.state;
    const salesReportTitle = `Sales Report. From: ${fromDate} To: ${toDate}`;
    const salesDetailReportTitle = `Sales Detail Report. From: ${fromDate} To: ${toDate}`;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Sales Report</div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
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
                  <GridItem xs={12} sm={12} md={3}>
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
                  <GridItem xs={12} sm={12} md={2}>
                    <Button color="info" onClick={this.search}>
                      <Search />
                      Search
                    </Button>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <Button color="secondary" onClick={this.print}>
                      <Print />
                      Print PDF
                    </Button>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    {loading && <CircularProgress />}
                  </GridItem>
                </GridContainer>
                <MuiThemeProvider theme={this.getMuiTheme()}>
                  <MUIDataTable
                    title={salesReportTitle}
                    data={reportData}
                    columns={columns}
                    options={options}
                  />
                </MuiThemeProvider>
                <MaterialTable
                  columns={orderColumns}
                  data={orderData}
                  options={materialTableOptions}
                  title={salesDetailReportTitle}
                  actions={[
                    {
                      icon: 'menu',
                      tooltip: 'See Details',
                      onClick: (event, rowData) => this.showDetails(rowData.orderId),
                    },
                  ]}
                />
                {loading && (<LinearProgress />)}
              </CardBody>
            </Card>
          </GridItem>
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
        </GridContainer>
      </div>
    );
  }
}
