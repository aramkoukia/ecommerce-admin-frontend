import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import MUIDataTable from 'mui-datatables';
import CardBody from '../../components/Card/CardBody';
import CardHeader from '../../components/Card/CardHeader';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Card from '../../components/Card/Card';
import ReportService from '../../services/ReportService';

export default class InventoryValueReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.productsList();
  }

  productsList() {
    this.setState({ loading: true });
    const columns = ['productId', 'productCode', 'productName', 'salesPrice', 'purchasePrice', 'vancouverBalance', 'vancouverValue', 'abbotsfordBalance', 'abbotsfordValue', 'totalValue'];
    ReportService.getInventoryValue()
      .then(results => results.map(row => columns.map(column => (row[column] === null ? '' : row[column]))))
      .then(data => this.setState({ products: data, loading: false }));
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
        name: 'product Id',
        options: {
          filter: false,
          display: false,
        },
      },
      {
        name: 'Product Code',
        options: {
          filter: false,
        },
      },
      {
        name: 'Product Name',
        options: {
          filter: false,
        },
      },
      {
        name: 'Sales Price($)',
        options: {
          filter: false,
        },
      },
      {
        name: 'Purchase Price($)',
        options: {
          filter: false,
        },
      },
      {
        name: 'Van Balance',
        options: {
          filter: false,
        },
      },
      {
        name: 'Van Value($)',
        options: {
          filter: false,
        },
      },
      {
        name: 'Abb Balance',
        options: {
          filter: false,
        },
      },
      {
        name: 'Abb Value($)',
        options: {
          filter: false,
        },
      },
      {
        name: 'Total Value($)',
        options: {
          filter: false,
        },
      },
    ];

    const options = {
      filterType: 'checkbox',
      onRowClick: this.rowClicked,
      rowHover: true,
      resizableColumns: false,
      selectableRows: false,
      rowsPerPageOptions: [25, 50, 100],
      rowsPerPage: 25,
    };

    const {
      products,
      loading,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Inventory Value Report</div>
              </CardHeader>
              <CardBody>
                <MUIDataTable
                  title=""
                  data={products}
                  columns={columns}
                  options={options}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        {loading && (<LinearProgress />)}
      </div>
    );
  }
}
