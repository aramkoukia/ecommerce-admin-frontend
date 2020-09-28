import React from 'react';
import MUIDataTable from 'mui-datatables';
import TextField from '@material-ui/core/TextField';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import Print from '@material-ui/icons/Print';
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

export default class ProfitReport extends React.Component {
  state = {
    salesFromDate: '',
    salesToDate: '',
    purchaseFromDate: '',
    purchaseToDate: '',
  };

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.print = this.print.bind(this);
  }

  componentDidMount() {
    const salesFromDate = dateFormat((new Date()).addHours(-8760));
    const salesToDate = dateFormat((new Date()).addHours(-8));
    const purchaseFromDate = dateFormat((new Date()).addHours(-8760));
    const purchaseToDate = dateFormat((new Date()).addHours(-8));

    this.setState({
      salesFromDate,
      salesToDate,
      purchaseFromDate,
      purchaseToDate,
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
    const {
      salesFromDate, salesToDate, purchaseFromDate, purchaseToDate,
    } = this.state;
    const purchaseSummaryColumns = [
      'productCode',
      'productName',
      'purchaseAmount',
      'avgPurchasePrice',
      'avgOverheadCost',
      'avgTotalCost',
      'salesAmount',
      'totalSalesByPurchasePrice',
      'totalSales',
      'avgSalesPrice',
      'totalCost',
      'avgProfitPerItem',
      'totalProfitByPurchasePrice',
      'totalProfitByAvgCost'];
    ReportService.getProductSalesProfit(
      salesFromDate,
      salesToDate,
      purchaseFromDate,
      purchaseToDate,
    )
      .then((results) => results.map((row) => purchaseSummaryColumns.map((column) => row[column] || '')))
      .then((data) => this.setState({ purchaseSummaryData: data, loading: false }));
  }

  print() {
    const {
      salesFromDate, salesToDate, purchaseFromDate, purchaseToDate,
    } = this.state;
    this.setState({ loading: true });
    ReportService.getProductSalesProfitPdf(
      salesFromDate,
      salesToDate,
      purchaseFromDate,
      purchaseToDate,
    ).then(() => this.setState({ loading: false }));
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

    const purchaseSummaryColumns = [
      'Product Code',
      'Product Name',
      'Purchase Amount',
      'Avg Purchase Price($)',
      'Avg Overhead Cost($)',
      'Avg Total Cost($)',
      'Sales Amount',
      'Total Sales By Purchase Price($)',
      'Total Sales($)',
      'Avg Sales Price($)',
      'Total Cost($)',
      'Avg Profit Per Item($)',
      'Total Profit By Purchase Price($)',
      'Total Profit By Avg Cost($)'];

    const purchaseSummaryOptions = {
      filterType: 'checkbox',
      rowHover: true,
      resizableColumns: false,
      selectableRows: false,
      responsive: 'scroll',
    };

    const {
      purchaseSummaryData,
      salesFromDate,
      salesToDate,
      purchaseFromDate,
      purchaseToDate,
      loading,
    } = this.state;
    const purchaseSummaryTitle = `Sales From: ${salesFromDate} To: ${salesToDate}. Purchase From: ${purchaseFromDate} To: ${purchaseToDate}`;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Product Sales Profit</div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={2}>
                    <TextField
                      onChange={this.handleChange('salesFromDate')}
                      id="date"
                      label="Sales From Date"
                      type="date"
                      value={salesFromDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <TextField
                      onChange={this.handleChange('salesToDate')}
                      id="date"
                      label="Sales To Date"
                      type="date"
                      value={salesToDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <TextField
                      onChange={this.handleChange('purchaseFromDate')}
                      id="date"
                      label="Purchase From Date"
                      type="date"
                      value={purchaseFromDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <TextField
                      onChange={this.handleChange('purchaseToDate')}
                      id="date"
                      label="Purchase To Date"
                      type="date"
                      value={purchaseToDate}
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
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
