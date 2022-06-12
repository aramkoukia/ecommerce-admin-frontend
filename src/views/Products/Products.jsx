/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import MaterialTable from 'material-table';
import {
  LinearProgress,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Button from '../../components/CustomButtons/Button';
import ProductService from '../../services/ProductService';
import ProductCategoryService from '../../services/ProductCategoryService';
import ShopifyStorefrontService from '../../services/ShopifyStorefrontService';
import PortalSettingsService from '../../services/PortalSettingsService';
import { Product } from './Product';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default class Products extends React.Component {
  state = {
    posSettings: {},
    products: [],
    productCategories: [],
    loading: false,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    page: 1,
    showProduct: false,
    productId: 0,
    options: {
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
    // this.syncProducts = this.syncProducts.bind(this);
    this.pushProductsToShopify = this.pushProductsToShopify.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.productsList();
    this.productCategoriesList();
    this.getPosSettings();
  }

  getPosSettings() {
    PortalSettingsService.getPortalSettings()
      .then((data) => this.setState({ posSettings: data, loading: false }));
  }

  handleClose = () => {
    this.setState({
      showProduct: false,
      productId: 0,
    });
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  showTransactions(productId) {
    this.setState({
      showProduct: true,
      productId,
    });
  }

  syncProducts() {
    ProductService.syncProducts();
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'Products sync process started. This could take 3-5 minutes to finish!',
      snackbarColor: 'success',
    });
  }

  pushProductsToShopify() {
    ShopifyStorefrontService.pushProducts();
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'Shopoify Products update process started. This could take 3-5 minutes to finish!',
      snackbarColor: 'success',
    });
  }

  productsList() {
    this.setState({ loading: true });
    ProductService.getProductWithInventory()
      .then((data) => this.setState({ products: data, loading: false }));
  }

  productCategoriesList() {
    this.setState({ loading: true });
    ProductCategoryService.getProductCategories()
      .then((data) => this.setState({
        productCategories: Object.fromEntries(
          data.map((e) => [e.productTypeId, e.productTypeName]),
        ),
        loading: false,
      }));
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


    const {
      products,
      loading,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      page,
      showProduct,
      productId,
      options,
      productCategories,
      posSettings,
    } = this.state;

    const columns = [
      {
        title: 'Product Code',
        field: 'productCode',
        readonly: true,
        width: 200,
      },
      {
        title: 'Product Name',
        field: 'productName',
        readonly: true,
        width: 600,
      },
      {
        title: 'Sales Price($)',
        field: 'salesPrice',
        type: 'numeric',
        readonly: true,
        width: 150,
        cellStyle: {
          color: '#0716CB',
        },
        headerStyle: {
          color: '#0716CB',
        },
      },
      {
        title: 'Balance',
        field: 'balance',
        type: 'numeric',
        readonly: true,
        width: 150,
        editable: 'never',
      },
      {
        title: 'On Hold',
        field: 'onHoldAmount',
        type: 'numeric',
        readonly: true,
        editable: 'never',
        width: 150,
      },
      {
        title: 'Disabled',
        field: 'disabled',
        editable: 'never',
        readonly: true,
        defaultFilter: ['False'],
        lookup: {
          True: 'True',
          False: 'False',
        },
      },
      {
        title: 'Product Type',
        field: 'productTypeId',
        readonly: true,
        lookup: productCategories,
      },
      {
        title: 'Product Id',
        field: 'productId',
        hidden: true,
        readonly: true,
        editable: 'never',
      },
    ];

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

    return (
      <div>
        <Card>
          <CardHeader color="primary">
            <div className={styles.cardTitleWhite}>Products List</div>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem md={3}>
                <Button color="primary" disabled={loading} onClick={this.pushProductsToShopify}>
                  Push Products to Shopify Store
                </Button>
              </GridItem>
              <GridItem md={1}>
                <TextField
                  name="page"
                  label="Page Number"
                  type="number"
                  onChange={this.handleChange}
                  value={page}
                  min="1"
                />
              </GridItem>
              <GridItem md={8}>
                {posSettings.portalTitle && posSettings.portalTitle.includes('Verobaord') && (
                <h5>
                  {posSettings.portalTitle}
                  {' '}
                  Shopify store: &nbsp;
                  <a target="_blank" href="https://veroboard-canada.myshopify.com/admin">https://veroboard-canada.myshopify.com/admin</a>
                </h5>
                )}
                {posSettings.portalTitle && posSettings.portalTitle.includes('Lights') && (
                <h5>
                  {posSettings.portalTitle}
                  {' '}
                  Shopify store: &nbsp;
                  <a target="_blank" href="https://ledlightsandparts.myshopify.com/admin">https://ledlightsandparts.myshopify.com/admin</a>
                </h5>
                )}
              </GridItem>
              <GridItem md={12}>
                <MaterialTable
                  columns={columns}
                  data={products}
                  detailPanel={detailPanel}
                  editable={{
                    onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = products.indexOf(oldData);
                          products[index] = newData;
                          ProductService.updateProductGenericInfo(newData);
                          this.setState({ products }, () => resolve());
                        }
                        resolve();
                      }, 100);
                    }),
                    onRowAdd: (newData) => new Promise((resolve) => {
                      setTimeout(() => {
                        ProductService.addProduct(newData).then((result) => {
                          if (result === false
                                || result === null
                                || result.StatusCode === 500
                                || result.StatusCode === 400) {
                            this.setState({
                              openSnackbar: true,
                              loading: false,
                              snackbarMessage: 'Oops, looks like something went wrong!',
                              snackbarColor: 'danger',
                            });
                          }
                        });
                        this.productsList();
                        // this.setState({ products }, () => resolve());
                        resolve();
                      }, 100);
                    }),
                  }}
                  actions={[
                    {
                      icon: 'menu',
                      tooltip: 'Transactions',
                      onClick: (event, rowData) => this.showTransactions(rowData.productId),
                    },
                  ]}
                  options={options}
                  title=""
                />
                {loading && (<LinearProgress />)}
              </GridItem>
            </GridContainer>
          </CardBody>
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
        <Dialog
          fullScreen
          open={showProduct}
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
            <Product productId={productId} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
