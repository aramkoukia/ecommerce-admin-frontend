/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import MaterialTable from 'material-table';
import {
  LinearProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
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
import GenericProductService from '../../services/GenericProductService';
// import ShopifyStorefrontService from '../../services/ShopifyStorefrontService';
import { Product } from '../Products/Product';

// const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default class GenericProductInventory extends React.Component {
  state = {
    genericProducts: [],
    loading: false,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    // page: 1,
    // showProduct: false,
    // productId: 0,
    columns: [
      {
        title: 'Product Type', field: 'productTypeName', readonly: true,
      },
      {
        title: 'Generic Product Code',
        field: 'genericProductCode',
        readonly: true,
        width: 200,
      },
      {
        title: 'Generic Product Name',
        field: 'productName',
        readonly: true,
        width: 600,
      },
      {
        title: 'Balance',
        field: 'balance',
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
      // {
      //   title: 'Disabled',
      //   field: 'disabled',
      //   readonly: true,
      //   defaultFilter: ['False'],
      //   lookup: {
      //     True: 'True',
      //     False: 'False',
      //   },
      // },
      {
        title: 'Product Id', field: 'genericProductId', hidden: true, readonly: true,
      },
    ],
    detailPanelColumns: [
      {
        title: 'Warehouse Name', field: 'warehouseName', readonly: true,
      },
      {
        title: 'Balance', field: 'balance',
      },
      {
        title: 'Bin Code', field: 'binCode', readonly: true,
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
    detailPanelOptions: {
      paging: false,
      columnsButton: false,
      exportButton: false,
      showTitle: false,
      toolbar: false,
      filtering: false,
      search: false,
      headerStyle: {
        backgroundColor: '#BAD7EE',
      },
    },
  };

  constructor(props) {
    super(props);
    // this.syncProducts = this.syncProducts.bind(this);
    // this.pushProductsToShopify = this.pushProductsToShopify.bind(this);
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

  productsList() {
    this.setState({ loading: true });
    GenericProductService.getGenericProducts()
      .then((data) => this.setState({ genericProducts: data, loading: false }));
  }

  addToBrand(rowData, detailRowData) {
    const { genericProducts } = this.state;
    console.log('rowData', rowData);
    console.log('detailRowData', detailRowData);
  }

  disableInBrand(rowData, detailRowData) {
    const { genericProducts } = this.state;
    console.log('rowData', rowData);

    console.log('detailRowData', detailRowData);
  }

  updateBrandProduct(rowData, oldData, newData) {
    const { genericProducts } = this.state;
    console.log('oldData', oldData);
    console.log('newData', newData);
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
      genericProducts,
      loading,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      columns,
      detailPanelColumns,
      options,
      detailPanelOptions,
    } = this.state;

    const detailPanel = [
      {
        tooltip: 'Details',
        render: (rowData) => (
          <MaterialTable
            columns={detailPanelColumns}
            data={rowData.brandProducts}
            options={detailPanelOptions}
            columnsButton={false}
            title=""
            editable={{
              onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                setTimeout(() => {
                  this.updateBrandProduct(rowData, oldData, newData);
                  // const index = locations.indexOf(oldData);
                  // locations[index] = newData;
                  // LocationService.updateLocation(newData);
                  // this.setState({ locations }, () => resolve());
                  resolve();
                }, 1000);
              }),
            }}
            actions={[
              {
                icon: 'add',
                tooltip: 'Add to brand',
                onClick: (_event, detailRowData) => this.addToBrand(rowData, detailRowData),
              },
              {
                icon: 'delete',
                tooltip: 'Disable in brand',
                onClick: (_event, detailRowData) => this.disableInBrand(rowData, detailRowData),
              },
            ]}
          />
        ),
      },
    ];

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info">
                <div className={styles.cardTitleWhite}>Headquarter - Products Inventory</div>
              </CardHeader>
              <CardBody>
                {/* <Button color="info" disabled={loading} onClick={this.syncProducts}>
                  Sync Products From Wordpress
                </Button>
                &nbsp;
                &nbsp;
                <Button color="primary" disabled={loading} onClick={this.pushProductsToShopify}>
                  Push Products to Lights and Parts Shopify Store
                </Button>
                &nbsp;
                &nbsp; */}
                {/* <TextField
                  name="page"
                  label="Page Number"
                  type="number"
                  onChange={this.handleChange}
                  value={page}
                  min="1"
                /> */}
                {/* <h5>
                  Lights and Parts Shopify Store: &nbsp;
                  <a target="_blank" href="https://light-and-parts.myshopify.com/">https://light-and-parts.myshopify.com</a>
                </h5> */}
                <MaterialTable
                  columns={columns}
                  data={genericProducts}
                  detailPanel={detailPanel}
              // actions={[
              //   {
              //     icon: 'menu',
              //     tooltip: 'Transactions',
              //     onClick: (event, rowData) => this.showTransactions(rowData.genericProductId),
              //   },
              // ]}
                  options={options}
                  title=""
                />
                {loading && (<LinearProgress />)}
                <Snackbar
                  place="tl"
                  color={snackbarColor}
                  icon={Check}
                  message={snackbarMessage}
                  open={openSnackbar}
                  closeNotification={() => this.setState({ openSnackbar: false })}
                  close
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        {/* <Dialog
          fullScreen
          open={showProduct}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          // TransitionComponent={Transition}
        >
          <AppBar style={{ position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start"
                          color="inherit" onClick={this.handleClose} aria-label="close">
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
        </Dialog> */}
      </div>
    );
  }
}
