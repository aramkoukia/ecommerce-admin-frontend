import React from 'react';
import MaterialTable from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import Check from '@material-ui/icons/Check';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogContentText from '@material-ui/core/DialogContentText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
  state = {
    products: [],
    loading: false,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    openDialog: false,
    productPackages: [],
    productCategories: [],
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.updateVariations = this.updateVariations.bind(this);
    this.updateTags = this.updateTags.bind(this);
    this.updateImages = this.updateImages.bind(this);
    this.updateWebsiteInfo = this.updateWebsiteInfo.bind(this);
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
    ProductService.getProductWithInventory()
      .then((data) => this.setState({ products: data, loading: false }));
  }

  loadCategories() {
    this.setState({ loading: true });
    ProductCategoryService.getProductCategories()
      .then((data) => this.setState({ productCategories: data, loading: false }));
  }

  updateVariations(rowData) {
    ProductService.getProductPackages(rowData.productId)
      .then((data) => this.setState({ productPackages: data }));

    this.setState({
      openDialog: true,
      product: rowData,
    });
  }

  updateTags(rowData) {
    // ProductService.getProductPackages(rowData.productId)
    //   .then((data) => this.setState({ productPackages: data }));
    alert('update tag');
    // this.setState({
    //   openDialog: true,
    //   product: rowData,
    // });
  }

  updateImages(rowData) {
    alert('update images');
  }

  updateWebsiteInfo(rowData) {
    alert('update website info');
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
      productCategories.map((e) => [e.productTypeId, e.productTypeName]),
    );

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
                  <TableCell>Location</TableCell>
                  <TableCell numeric>Balance</TableCell>
                  <TableCell numeric>On Hold</TableCell>
                  <TableCell numeric>Bin Code</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowData.inventory.map((row) => (
                  <TableRow key={row.productId}>
                    <TableCell>{row.locationName}</TableCell>
                    <TableCell numeric>{row.balance}</TableCell>
                    <TableCell numeric>{row.onHoldAmount}</TableCell>
                    <TableCell>{row.binCode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ),
      },
    ];

    const columns = [
      {
        title: 'Category',
        field: 'productTypeId',
        lookup: hash,
      },
      { title: 'Product Code', field: 'productCode', readonly: true },
      { title: 'Product Name', field: 'productName', readonly: true },
      {
        title: 'Purchase Price ($)',
        field: 'purchasePrice',
        type: 'numeric',
        width: 100,
      },
      {
        title: 'Avg Purchase Price ($)',
        field: 'avgPurchasePrice',
        type: 'numeric',
        readonly: true,
      },
      {
        title: 'Sales Price ($)',
        field: 'salesPrice',
        type: 'numeric',
        readonly: true,
        width: 100,
      },
      {
        title: 'Balance',
        field: 'balance',
        type: 'numeric',
        readonly: true,
        width: 100,
      },
      {
        title: 'On Hold',
        field: 'onHoldAmount',
        type: 'numeric',
        readonly: true,
        width: 100,
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
              detailPanel={detailPanel}
              options={options}
              onRowClick={this.rowClicked}
              title=""
              actions={[
                {
                  icon: 'image',
                  tooltip: 'Update Images',
                  onClick: (event, rowData) => this.updateImages(rowData),
                },
                {
                  icon: 'description',
                  tooltip: 'Website Info',
                  onClick: (event, rowData) => this.updateWebsiteInfo(rowData),
                },
                {
                  icon: 'local_offer',
                  tooltip: 'Tags',
                  onClick: (event, rowData) => this.updateTags(rowData),
                },
                {
                  icon: 'attach_money',
                  tooltip: 'Variations',
                  onClick: (event, rowData) => this.updateVariations(rowData),
                },
              ]}
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
                      onRowAdd: (newData) => new Promise((resolve) => {
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
                      onRowDelete: (oldData) => new Promise((resolve) => {
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
