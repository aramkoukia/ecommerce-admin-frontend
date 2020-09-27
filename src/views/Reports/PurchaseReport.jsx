import React from 'react';
import MUIDataTable from 'mui-datatables';
import TextField from '@material-ui/core/TextField';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Print from '@material-ui/icons/Print';
import Search from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '../../components/CustomButtons/Button';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import ReportService from '../../services/ReportService';

function dateFormat(dateString) {
  if (dateString === '0001-01-01T00:00:00') {
    return '';
  }

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

export default class PuchaseReport extends React.Component {
  state = {
    fromDate: '',
    toDate: '',
    loading: false,
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
  }

  search() {
    this.setState({ loading: true });
    const { fromDate, toDate } = this.state;
    const purchaseSummaryColumns = ['productCode', 'productName', 'plannedAmount', 'plannedTotalPrice', 'paidAmount', 'paidTotalPrice', 'onDeliveryAmount', 'onDeliveryTotalPrice', 'customClearanceAmount', 'customClearanceTotalPrice', 'arrivedAmount', 'arrivedTotalPrice'];
    ReportService.getPurchaseSummary(fromDate, toDate)
      .then((results) => results.map((row) => purchaseSummaryColumns.map((column) => row[column] || '')))
      .then((data) => this.setState({ purchaseSummaryData: data, loading: false }));

    const purchaseDetailColumns = ['purchaseId', 'productCode', 'productName', 'supplier', 'status', 'amount', 'unitPrice', 'totalPrice', 'poNumber', 'estimatedDelivery', 'paidDate', 'arrivedDate', 'locationName'];
    ReportService.getPurchaseDetail(fromDate, toDate)
      .then((results) => results.map((row) => purchaseDetailColumns.map((column) => {
        if (column === 'estimatedDelivery' || column === 'paidDate' || column === 'arrivedDate') {
          return dateFormat(row[column]);
        }
        return row[column] || '';
      })))
      .then((data) => this.setState({ purchaseDetailData: data, loading: true }));
  }


  print() {
    const { fromDate, toDate } = this.state;
    this.setState({ loading: true });
    ReportService.getPurchaseReportPdf(fromDate, toDate)
      .then(() => this.setState({ loading: false }));
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

    const purchaseSummaryColumns = ['Product Code', 'Product Name', 'Planned Amount', 'Planned Total Price', 'Paid Amount', 'Paid Total Price', 'On Delivery Amount', 'On Delivery TotalPrice', 'Custom Clearance Amount', 'Custom Clearance Total Price', 'Arrived Amount', 'Arrived Total Price'];

    const purchaseDetailColumns = ['PurchaseId', 'ProductCode', 'Product Name', 'Supplier', 'Status', 'Amount', 'Unit Price', 'Total Price', 'PO Number', 'Estimated Delivery', 'Paid Date', 'Arrived Date', 'Location'];

    const purchaseSummaryOptions = {
      filterType: 'checkbox',
      rowHover: true,
      resizableColumns: false,
      selectableRows: false,
      responsive: 'scroll',
    };

    const purchaseDetailOptions = {
      filterType: 'checkbox',
      rowHover: true,
      resizableColumns: false,
      selectableRows: false,
      responsive: 'scroll',
    };

    const {
      purchaseSummaryData, purchaseDetailData, fromDate, toDate,
      loading,
    } = this.state;
    const purchaseSummaryTitle = `Purchases Summary. From: ${fromDate} To: ${toDate}`;
    const purchaseDetailTitle = `Purchases Details. From: ${fromDate} To: ${toDate}`;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Purchase Report</div>
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
                    title={purchaseSummaryTitle}
                    data={purchaseSummaryData}
                    columns={purchaseSummaryColumns}
                    options={purchaseSummaryOptions}
                  />
                </MuiThemeProvider>
                <br />
                <MuiThemeProvider theme={this.getMuiTheme()}>
                  <MUIDataTable
                    title={purchaseDetailTitle}
                    data={purchaseDetailData}
                    columns={purchaseDetailColumns}
                    options={purchaseDetailOptions}
                  />
                </MuiThemeProvider>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
