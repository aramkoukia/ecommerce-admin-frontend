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

export default class CustomerReport extends React.Component {
  state = {
    fromDate: '',
    toDate: '',
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

  search() {
    this.setState({ loading: true });
    const { fromDate, toDate } = this.state;
    const customerPaidColumns = ['orderId', 'poNumber', 'total', 'status', 'orderDate', 'paymentAmount', 'paymentTypeName', 'companyName', 'address', 'city', 'province', 'postalCode'];
    ReportService.getCustomerPaid(fromDate, toDate)
      .then((results) => results.map((row) => customerPaidColumns.map((column) => {
        if (column === 'orderDate') {
          return dateFormat(row[column]);
        }
        return row[column] || '';
      })))
      .then((data) => this.setState({ customerPaidData: data, loading: false }));

    const customerUnPaidColumns = ['orderId', 'poNumber', 'total', 'status', 'orderDate', 'dueDate', 'companyName', 'address', 'city', 'province', 'postalCode'];
    ReportService.getCustomerUnPaid(fromDate, toDate)
      .then((results) => results.map((row) => customerUnPaidColumns.map((column) => {
        if (column === 'orderDate' || column === 'dueDate') {
          return dateFormat(row[column]);
        }
        return row[column] || '';
      })))
      .then((data) => this.setState({ customerUnPaidData: data, loading: false }));
  }

  print() {
    const { fromDate, toDate } = this.state;
    this.setState({ loading: true });
    ReportService.getCustomerReportPdf(fromDate, toDate)
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

    const customerPaidColumns = ['Invoice Id', 'PO Number', 'Total Sale ($)', 'Status', 'Date', 'Payment Amount($)', 'Paid By', 'Company Name',
      {
        name: 'Address',
        options: {
          display: false,
        },
      },
      {
        name: 'City',
        options: {
          display: false,
        },
      },
      {
        name: 'Province',
        options: {
          display: false,
        },
      },
      {
        name: 'PostalCode',
        options: {
          display: false,
        },
      }];

    const customerUnPaidColumns = ['Invoice Id', 'PO Number', 'Total Sale ($)', 'Status', 'Date', 'Due Date', 'Company Name',
      {
        name: 'Address',
        options: {
          display: false,
        },
      },
      {
        name: 'City',
        options: {
          display: false,
        },
      },
      {
        name: 'Province',
        options: {
          display: false,
        },
      },
      {
        name: 'PostalCode',
        options: {
          display: false,
        },
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
      customerPaidData, customerUnPaidData, fromDate, toDate,
      loading,
    } = this.state;
    // const paidTitle = `Paid Orders - From Date: ${dateFormat(fromDate)} To Date: ${dateFormat(toDate)}`;
    // const unpaidTitle = `Awaiting Patment - Until Date: ${dateFormat(toDate)}`;
    const paidTitle = 'Paid Orders';
    const unpaidTitle = 'Awaiting Patment';

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Customer Report</div>
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
                    title={paidTitle}
                    data={customerPaidData}
                    columns={customerPaidColumns}
                    options={options}
                  />
                </MuiThemeProvider>
                <MuiThemeProvider theme={this.getMuiTheme()}>
                  <MUIDataTable
                    title={unpaidTitle}
                    data={customerUnPaidData}
                    columns={customerUnPaidColumns}
                    options={options}
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
