import React from 'react';
import MaterialTable from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import Check from '@material-ui/icons/Check';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogContentText from '@material-ui/core/DialogContentText';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Button from '../../components/CustomButtons/Button';
import CardBody from '../../components/Card/CardBody';
import ProductService from '../../services/ProductService';
import ProductCategoryService from '../../services/ProductCategoryService';

export default class UpdateProducts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      loading: false,
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      openDialog: false,
      productPackages: [],
      productCategories: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateVariations = this.updateVariations.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.productsList();
    this.loadCategories();
    this.setState({
      productPackages: [],
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleClose() {
    this.setState({
      openDialog: false,
      productPackages: [],
    });
  }

  productsList() {
    this.setState({ loading: true });
    ProductService.getProducts()
      .then(data => this.setState({ products: data, loading: false }));
  }

  loadCategories() {
    this.setState({ loading: true });
    ProductCategoryService.getProductCategories()
      .then(data => this.setState({ productCategories: data, loading: false }));
  }

  updateVariations(rowData) {
    ProductService.getProductPackages(rowData.productId)
      .then(data => this.setState({ productPackages: data }));

    this.setState({
      openDialog: true,
      product: rowData,
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
    const { productCategories } = this.state;
    const hash = Object.fromEntries(
      productCategories.map(e => [e.productTypeId, e.productTypeName]),
    );

    const columns = [
      {
        title: 'Category',
        field: 'productTypeId',
        lookup: hash,
      },
      { title: 'Product Code', field: 'productCode', readonly: true },
      { title: 'Product Name', field: 'productName', readonly: true },
      { title: 'Purchase Price ($)', field: 'purchasePrice', type: 'numeric' },
      {
        title: 'Avg Purchase Price ($)', field: 'avgPurchasePrice', type: 'numeric', readonly: true,
      },
      {
        title: 'Sales Price ($)', field: 'salesPrice', type: 'numeric', readonly: true,
      },
      {
        title: 'Van Balance', field: 'vancouverBalance', type: 'numeric', readonly: true,
      },
      {
        title: 'Abb Balance', field: 'abbotsfordBalance', type: 'numeric', readonly: true,
      },
      {
        title: 'Disabled',
        field: 'disabled',
        readonly: true,
        lookup: {
          True: 'True',
          False: 'False',
        },
      },
      {
        title: 'Product Id', field: 'productId', hidden: true, readonly: true,
      },
    ];

    const {
      products,
      loading,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      productPackages,
      product,
      openDialog,
    } = this.state;

    const packageColumns = [
      { title: 'Sale Option', field: 'package' },
      { title: 'Amount', field: 'amountInMainPackage', type: 'numberic' },
      { title: 'Unit Price', field: 'packagePrice', type: 'numberic' },
      { title: 'Package Id', field: 'productPackageId', hidden: true },
    ];

    const options = {
      paging: true,
      pageSizeOptions: [25, 50, 100],
      pageSize: 25,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      search: true,
    };

    const packageOptions = {
      paging: false,
      columnsButton: false,
      exportButton: false,
      filtering: false,
      search: false,
    };

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Update Products</div>
              </CardHeader>
            </Card>

            <MaterialTable
              columns={columns}
              data={products}
              options={options}
              onRowClick={this.rowClicked}
              title=""
              actions={[
                {
                  icon: 'attach_money',
                  tooltip: 'Variations',
                  onClick: (event, rowData) => this.updateVariations(rowData),
                }]}
              editable={{
                onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                  setTimeout(() => {
                    {
                      const index = products.indexOf(oldData);
                      products[index] = newData;
                      ProductService.updateProduct(newData);
                      this.setState({ products }, () => resolve());
                    }
                    resolve();
                  }, 1000);
                }),
              }}
            />

            {loading && (<LinearProgress />)}
          </GridItem>
          <Snackbar
            place="tl"
            color={snackbarColor}
            icon={Check}
            message={snackbarMessage}
            open={openSnackbar}
            closeNotification={() => this.setState({ openSnackbar: false })}
            close
          />
        </GridContainer>
        <Dialog
          open={openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              <Card>
                <CardHeader color="primary">
                  Product Variations:
                </CardHeader>
                <CardBody>
                  {product && (
                    <div>
                      <Typography variant="subheading" gutterBottom>
                        Code:
                        {' '}
                        {product.productCode}
                      </Typography>
                      <Typography variant="subheading" gutterBottom>
                        Name:
                        {' '}
                        {product.productName}
                      </Typography>
                      <Typography variant="subheading" gutterBottom>
                        Sales Price ($):
                        {' '}
                        {product.salesPrice}
                      </Typography>
                    </div>
                  )}
                  <MaterialTable
                    columns={packageColumns}
                    data={productPackages}
                    options={packageOptions}
                    title=""
                    editable={{
                      onRowAdd: newData => new Promise((resolve) => {
                        setTimeout(() => {
                          productPackages.push(newData);
                          ProductService.createProductPackage(product.productId, newData);
                          this.setState({ productPackages }, () => resolve());
                          resolve();
                        }, 1000);
                      }),
                      onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                        setTimeout(() => {
                          {
                            const index = productPackages.indexOf(oldData);
                            productPackages[index] = newData;
                            ProductService.updateProductPackage(product.productId, newData);
                            this.setState({ productPackages }, () => resolve());
                          }
                          resolve();
                        }, 1000);
                      }),
                      onRowDelete: oldData => new Promise((resolve) => {
                        setTimeout(() => {
                          {
                            const index = productPackages.indexOf(oldData);
                            productPackages.splice(index, 1);
                            ProductService.deleteProductPackage(oldData.productId, oldData);
                            this.setState({ productPackages }, () => resolve());
                          }
                          resolve();
                        }, 1000);
                      }),
                    }}
                  />
                </CardBody>
              </Card>
            </DialogContentText>
            <DialogActions>
              <Button onClick={this.handleClose} color="secondary">
                Close
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
