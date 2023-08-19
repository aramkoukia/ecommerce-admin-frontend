import React from 'react';
import MUIDataTable from 'mui-datatables';
import {
  CircularProgress,
  LinearProgress,
  TextField,
} from '@material-ui/core';
import Search from '@material-ui/icons/Search';
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

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

export default class SalespersonReport extends React.Component {
  state = {
    fromDate: '',
    toDate: '',
    loading: false,
  };

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
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
    const { fromDate, toDate } = this.state;
    this.setState({ loading: true });
    const salesColumns = ['givenName',
      'paidTotal', 'accountTotal', 'returnTotal', 'quoteTotal',
      'paidTransactions', 'accountTransactions', 'returnTransactions', 'quoteTransactions',
    ];
    ReportService.getSalespersonOrders(fromDate, toDate)
      .then((results) => results.map((row) => salesColumns.map((column) => row[column] || '')))
      .then((data) => this.setState({ reportData: data, loading: false }));
  }

  // print() {
  //   const { fromDate, toDate } = this.state;
  //   this.setState({ loading: true });
  //   ReportService.getSalesPdf(fromDate, toDate)
  //     .then(() => this.setState({ loading: false }));
  // }

  // showDetails(orderId) {
  //   this.setState({
  //     orderId,
  //     showOrder: true,
  //   });
  // }

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
        name: 'Salesperson',
      },
      {
        name: 'Paid Total ($)',
      },
      {
        name: 'Account Total ($)',
      },
      {
        name: 'Return Total ($)',
      },
      {
        name: 'Quote Total ($)',
      },
      {
        name: 'Paid Transactions',
      },
      {
        name: 'Account Transactions',
      },
      {
        name: 'Return Transactions',
      },
      {
        name: 'Quote Transactions',
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
      reportData, fromDate, toDate, loading,
    } = this.state;
    const salesReportTitle = `Salesperson Report. From: ${fromDate} To: ${toDate}`;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Salesperson Report</div>
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
                  {/* <GridItem xs={12} sm={12} md={2}>
                    <Button color="secondary" onClick={this.print}>
                      <Print />
                      Print PDF
                    </Button>
                  </GridItem> */}
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
                {loading && (<LinearProgress />)}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
