import React from 'react';
import MUIDataTable from 'mui-datatables';
import TextField from '@material-ui/core/TextField';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
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

export default class PaymentReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fromDate: '',
      toDate: '',
    };
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    const fromDate = dateFormat(new Date(Date.now()));
    const toDate = dateFormat(new Date(Date.now()));
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
    },
  })

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  }

  search() {
    const { fromDate, toDate } = this.state;
    const paymentDetailsColumns = ['locationName', 'givenName', 'paymentTypeName', 'paymentAmount', 'companyName', 'orderId', 'status'];
    ReportService.getPayments(fromDate, toDate)
      .then(results => results.map(row => paymentDetailsColumns.map(column => row[column] || '')))
      .then(data => this.setState({ paymentDetailsData: data }));

    const paymentsSummaryColumns = ['locationName', 'paymentTypeName', 'paymentAmount', 'status'];
    ReportService.getPaymentsByOrderStatus(fromDate, toDate)
      .then(results => results.map(row => paymentsSummaryColumns.map(column => row[column] || '')))
      .then(data => this.setState({ paymentsSummaryData: data }));

    const paymentsTotalColumns = ['locationName', 'paymentTypeName', 'paymentAmount'];
    ReportService.getPaymentsTotal(fromDate, toDate)
      .then(results => results.map(row => paymentsTotalColumns.map(column => row[column] || '')))
      .then(data => this.setState({ paymentsTotalData: data }));
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

    const paymentsTotalColumns = [
      {
        name: 'Loaction',
      },
      {
        name: 'Payment Type',
      },
      {
        name: 'Amount ($)',
        options: {
          filter: true,
        },
      }];

    const paymentsSummaryColumns = [
      {
        name: 'Loaction',
      },
      {
        name: 'Payment Type',
      },
      {
        name: 'Amount ($)',
        options: {
          filter: true,
        },
      },
      {
        name: 'Status',
      }];

    const paymentDetailsColumns = [
      {
        name: 'Loaction',
      },
      {
        name: 'User',
      },
      {
        name: 'Payment Type',
      },
      {
        name: 'Amount ($)',
        options: {
          filter: true,
        },
      },
      {
        name: 'Customer',
        options: {
          filter: false,
        },
      },
      {
        name: 'Order Number',
        options: {
          filter: true,
        },
      },
      {
        name: 'Status',
      }];

    const paymentsTotalOptions = {
      filterType: 'checkbox',
      rowHover: true,
      resizableColumns: true,
      selectableRows: false,
    };

    const paymentsSummaryOptions = {
      filterType: 'checkbox',
      rowHover: true,
      resizableColumns: true,
      selectableRows: false,
    };

    const paymentDetailsOptions = {
      filterType: 'checkbox',
      rowHover: true,
      resizableColumns: true,
      selectableRows: false,
    };

    const {
      paymentsSummaryData, paymentDetailsData, paymentsTotalData, fromDate, toDate,
    } = this.state;
    const paymentSummaryTitle = `Payment Summary. From: ${dateFormat(fromDate)} To: ${dateFormat(toDate)}`;
    const paymentsByOrderStatusTitle = `Payments By Order Status. From: ${dateFormat(fromDate)} To: ${dateFormat(toDate)}`;
    const paymentDetailsTitle = `Payment Details. From: ${dateFormat(fromDate)} To: ${dateFormat(toDate)}`;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Payment Report</div>
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
                  <GridItem xs={12} sm={12} md={3}>
                    <Button color="info" onClick={this.search}>Search</Button>
                  </GridItem>
                </GridContainer>
                <MuiThemeProvider theme={this.getMuiTheme()}>
                  <MUIDataTable
                    title={paymentSummaryTitle}
                    data={paymentsTotalData}
                    columns={paymentsTotalColumns}
                    options={paymentsTotalOptions}
                    />
                </MuiThemeProvider>
                <br />
                <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                  title={paymentsByOrderStatusTitle}
                  data={paymentsSummaryData}
                  columns={paymentsSummaryColumns}
                  options={paymentsSummaryOptions}
                />
                </MuiThemeProvider>
                <br />
                  <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                  title={paymentDetailsTitle}
                  data={paymentDetailsData}
                  columns={paymentDetailsColumns}
                  options={paymentDetailsOptions}
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
