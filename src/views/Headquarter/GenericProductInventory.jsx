/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import MaterialTable from 'material-table';
import {
  LinearProgress,
  Dialog,
  DialogActions,
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

export default class GenericProductInventory extends React.Component {
  state = {
    genericProducts: [],
    fromWarehouses: [],
    toWarehouses: [],
    loading: false,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    product: {
      warehouseBalances: [],
    },
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
      {
        title: 'Notes', field: 'notes', readonly: true,
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

  showTransferDialog = (rowData) => {
    this.setState({
      openTransferDialog: true,
      product: rowData,
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

  updateProductInventory(rowData, newData) {
    const genericProductInventory = {
      genericProductId: rowData.genericProductId,
      warehouseId: newData.warehouseId,
      balance: newData.balance,
      binCode: newData.binCode,
      notes: newData.notes,
    };

    const { genericProducts } = this.state;
    const newItems = [...genericProducts];

    const genericProduct = genericProducts.find(
      (p) => p.genericProductId === rowData.genericProductId,
    );
    const warehouseInventory = genericProduct.warehouseBalances.find(
      (b) => b.warehouseId === newData.warehouseId,
    );

    warehouseInventory.balance = newData.balance;
    warehouseInventory.binCode = newData.binCode;
    warehouseInventory.notes = newData.notes;

    this.setState({ genericProducts: newItems });

    WarehouseService.uppdateGenericProductInventory(genericProductInventory);
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
              onRowUpdate: (newData) => new Promise((resolve) => {
                setTimeout(() => {
                  this.updateProductInventory(rowData, newData);
                  resolve();
                }, 100);
              }),
            }}
            actions={[
              {
                icon: 'compare_arrows',
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
