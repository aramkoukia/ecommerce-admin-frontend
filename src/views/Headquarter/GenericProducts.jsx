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
import ShopifyStorefrontService from '../../services/ShopifyStorefrontService';
import { Product } from '../Products/Product';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default class GenericProducts extends React.Component {
  state = {
    products: [],
    loading: false,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    page: 1,
    showProduct: false,
    productId: 0,
    columns: [
      {
        title: 'Product Type', field: 'productTypeName', hidden: true, readonly: true,
      },
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
      },
      {
        title: 'On Hold',
        field: 'onHoldAmount',
        type: 'numeric',
        readonly: true,
        width: 150,
      },
      {
        title: 'Disabled',
        field: 'disabled',
        readonly: true,
        defaultFilter: ['False'],
        lookup: {
          True: 'True',
          False: 'False',
        },
      },
      {
        title: 'Product Id', field: 'productId', hidden: true, readonly: true,
      },
    ],
    options: {
      paging: true,
      pageSizeOptions: [25, 50, 100],
      pageSize: 25,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      search: true,
    },
  };

  constructor(props) {
    super(props);
    this.syncProducts = this.syncProducts.bind(this);
    this.pushProductsToShopify = this.pushProductsToShopify.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.productsList();
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
      columns,
      options,
    } = this.state;

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
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Products List</div>
              </CardHeader>
              <CardBody>
                <Button color="info" disabled={loading} onClick={this.syncProducts}>
                  Sync Products From Wordpress
                </Button>
                &nbsp;
                &nbsp;
                <Button color="primary" disabled={loading} onClick={this.pushProductsToShopify}>
                  Push Products to Lights and Parts Shopify Store
                </Button>
                &nbsp;
                &nbsp;
                <TextField
                  name="page"
                  label="Page Number"
                  type="number"
                  onChange={this.handleChange}
                  value={page}
                  min="1"
                />
                <h5>
                  Lights and Parts Shopify Store: &nbsp;
                  <a target="_blank" href="https://light-and-parts.myshopify.com/">https://light-and-parts.myshopify.com</a>
                </h5>
              </CardBody>
            </Card>
            <MaterialTable
              columns={columns}
              data={products}
              detailPanel={detailPanel}
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
