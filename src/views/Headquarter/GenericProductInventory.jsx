/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import MaterialTable from 'material-table';
import {
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Button from '../../components/CustomButtons/Button';
import GenericProductService from '../../services/GenericProductService';
import WarehouseService from '../../services/WarehouseService';
import GenericProductInventoryTransfer from './GenericProductInventoryTransfer';
// import ShopifyStorefrontService from '../../services/ShopifyStorefrontService';
// import { Product } from '../Products/Product';

export default class GenericProductInventory extends React.Component {
  state = {
    genericProducts: [],
    fromWarehouses: [],
    toWarehouses: [],
    loading: false,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    product: {},
    openTransferDialog: false,
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
        title: 'Warehouse Name', field: 'warehouseName', readonly: true, editable: 'never',
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
    this.warehouseList();
  }

  showTransferDialog = () => {
    this.setState({
      openTransferDialog: true,
      product: {},
    });
  }

  handleTransferFinished = () => {
    alert('finish transfer');
  }

  handleClose = () => {
    this.setState({
      openTransferDialog: false,
      product: {},
    });
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  productsList() {
    this.setState({ loading: true });
    GenericProductService.getGenericProductInventories()
      .then((data) => this.setState({ genericProducts: data, loading: false }));
  }

  warehouseList() {
    this.setState({ loading: true });
    WarehouseService.getWarehouses()
      .then((data) => this.setState(
        {
          fromWarehouses: data,
          toWarehouses: data,
          loading: false,
        },
      ));
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
      product,
      fromWarehouses,
      toWarehouses,
      openTransferDialog,
    } = this.state;

    const detailPanel = [
      {
        tooltip: 'Details',
        render: (rowData) => (
          <MaterialTable
            columns={detailPanelColumns}
            data={rowData.warehouseBalances}
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
                tooltip: 'Transfer Product',
                onClick: (_event, detailRowData) => this.showTransferDialog(rowData, detailRowData),
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
                <MaterialTable
                  columns={columns}
                  data={genericProducts}
                  detailPanel={detailPanel}
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
        <Dialog
          open={openTransferDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="lg"
        >
          <DialogContent>
            <DialogContentText>
              Code:
              {product && product.productCode}
              <br />
              Name:
              {product && product.productName}
              <br />
            </DialogContentText>
            <GenericProductInventoryTransfer
              fromWarehouses={fromWarehouses}
              toWarehouses={toWarehouses}
              product={product}
              handleClose={this.handleTransferFinished}
            />
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
