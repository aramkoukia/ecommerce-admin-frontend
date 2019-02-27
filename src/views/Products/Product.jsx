import React from 'react';
import Check from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import Button from '../../components/CustomButtons/Button';
import Table from '../../components/Table/Table';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import Snackbar from '../../components/Snackbar/Snackbar';
import GridItem from '../../components/Grid/GridItem';
import ProductService from '../../services/ProductService';

const styles = {
  chip: {
    margin: 5,
  },
};

function dateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const stringDate = [day, month, year].join('/');
  return stringDate;
}

export class Product extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product: null,
      productTransactions: [],
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      loading: false,
    };

    this.enableDisableProducts = this.enableDisableProducts.bind(this);
  }

  async componentDidMount() {
    const productId = this.props.match.params.id;
    const product = await ProductService.getProduct(productId);
    this.setState({
      product,
    });

    this.productTransactionList(productId);
  }

  enableDisableProducts() {
    const productId = this.props.match.params.id;
    ProductService.disableProduct(productId);
    window.location.reload();
  }

  productTransactionList(productId) {
    const columns = ['date', 'transactionType', 'amount', 'locationName', 'userName'];
    ProductService.getProductTransactions(productId)
      .then(results => results.map(row => columns.map((column) => {
        if (column === 'date') {
          return dateFormat(row[column]);
        }
        return row[column] || '';
      })))
      .then(data => this.setState({ productTransactions: data }));
  }

  render() {
    const {
      product, productTransactions, openSnackbar, snackbarMessage, snackbarColor, loading,
    } = this.state;

    const columns = ['Date', 'Transaction Type', 'Amount', 'LocationName', 'User'];

    const options = {
      filterType: 'checkbox',
      onRowClick: this.rowClicked,
      rowHover: true,
      resizableColumns: true,
      selectableRows: false,
      rowsPerPageOptions: [25, 50, 100],
      rowsPerPage: 25,
    };

    return (
      <div>
        { product && (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div>
                  <b>Product Transactions:</b>
                  &nbsp;
                  {product.productCode}
                  &nbsp;&nbsp; {product.productName}
                </div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12}>
                    <Card>
                      <CardHeader color="info">
                        <div>Product Info</div>
                      </CardHeader>
                      <CardBody>
                        {product && (
                            <div>
                              {product.disabled === 'False' && (
                                <Button color="info" onClick={this.enableDisableProducts}>
                              Disable Product
                            </Button>
                              )}
                              {product.disabled === 'True' && (
                                <Button color="info" onClick={this.enableDisableProducts}>
                                  Enable Product
                            </Button>
                              )}
                            <Table
                              tableHeaderColor="primary"
                              tableHead={['Product Type', 'Code', 'Name', 'Sale Price', 'Vancouver Balance', 'Abbotsford Balance', 'Disabled']}
                              tableData={
                            [[product.productTypeName, product.productCode, product.productName, product.salesPrice, product.vancouverBalance, product.abbotsfordBalance, product.disabled]]
                          }
                            />
                          </div>
                        ) }
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem xs={12}>
                    <MUIDataTable
                      title="Product Transactions"
                      data={productTransactions}
                      columns={columns}
                      options={options}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter />
            </Card>
            <Snackbar
              place="tl"
              color={snackbarColor}
              icon={Check}
              message={snackbarMessage}
              open={openSnackbar}
              closeNotification={() => this.setState({ openSnackbar: false })}
              close
            />
          </GridItem>
        </GridContainer>
        ) }
      </div>
    );
  }
}

Product.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Product);
