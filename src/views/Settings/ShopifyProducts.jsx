import React from 'react';
import MaterialTable from 'material-table';
import {
  LinearProgress,
  DialogActions,
  Dialog,
  DialogContent,
  Button,
  TextField,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import ShopifyService from '../../services/ShopifyService';
// import ProductService from '../../services/ProductService';

const imagePlaceholder = require('../../assets/img/image-placeholder.jpg');

export default class ShopifyProducts extends React.Component {
  state = {
    products: [],
    loading: false,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    showUpdateModal: false,
    productCode: '',
    shopifyProductId: 0,
    shopifyVariantId: 0,
    storeInventory: 0,
    shopifyInventory: 0,
    shopifyProductName: '',
    posProductName: '',
    posSalesPrice: 0,
    shopifyPrice: 0,
    columns: [
      {
        title: 'Shopify Id',
        field: 'id',
        readonly: true,
        hidden: true,
      },
      {
        title: 'Variant Id',
        field: 'variantId',
        readonly: true,
        hidden: true,
      },
      {
        title: 'POS Sales Price',
        field: 'posSalesPrice',
        readonly: true,
        hidden: true,
      },
      {
        title: 'POS Product Name',
        field: 'posProductName',
        readonly: true,
        hidden: true,
      },
      {
        title: 'Variant Id',
        field: 'variantId',
        readonly: true,
        hidden: true,
      },
      {
        title: 'Product Code',
        field: 'code',
        readonly: true,
      },
      {
        title: 'Product Name',
        field: 'title',
        readonly: true,
        width: 600,
      },
      {
        title: 'Shopify Balance',
        field: 'balance',
        type: 'numeric',
        readonly: true,
        width: 250,
      },
      {
        title: 'POS Balance',
        field: 'totalStoreInventory',
        type: 'numeric',
        readonly: true,
        width: 250,
      },
      {
        title: 'Price ($)',
        field: 'price',
        type: 'numeric',
        readonly: true,
        width: 200,
      },
      {
        field: 'image',
        title: 'Image',
        editable: 'never',
        filtering: false,
        render: (rowData) => (
          <img
            alt={(rowData && rowData.image && rowData.title) || 'No Image'}
            src={((rowData && rowData.image) || imagePlaceholder)}
            style={{ width: 70 }}
          />
        ),
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
      rowStyle: (data) => {
        if (data.balance > data.totalStoreInventory) {
          return {
            backgroundColor: '#ffcccc',
          };
        }
        if (data.balance < data.totalStoreInventory) {
          return {
            backgroundColor: '#96B8FF',
          };
        }
      },
    },
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateInventory = this.updateInventory.bind(this);
  }

  componentDidMount() {
    this.productsList();
  }

  showUpdateInventory(rowData) {
    const {
      id, variantId, totalStoreInventory, balance, code, price, title,
      posProductName, posSalesPrice,
    } = rowData;

    this.setState({
      productCode: code,
      shopifyProductId: id,
      shopifyVariantId: variantId,
      storeInventory: totalStoreInventory,
      shopifyInventory: balance,
      shopifyPrice: price,
      shopifyProductName: title,
      posProductName,
      posSalesPrice,
      showUpdateModal: true,
    });
  }

  updateInventory() {
    this.setState({ loading: true });
    const {
      shopifyInventory,
      shopifyProductId,
      shopifyVariantId,
    } = this.state;
    ShopifyService.UpdateInventory(
      {
        ProductId: shopifyProductId,
        VariantId: shopifyVariantId,
        InventoryQuantity: shopifyInventory,
      },
    ).then(() => this.setState({
      showUpdateModal: false,
      loading: false,
    }));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleClose() {
    this.setState({ showUpdateModal: false });
  }

  productsList() {
    this.setState({ loading: true });
    ShopifyService.getProducts()
      .then((data) => {
        const result = data.products;
        const flatResponse = result.map((p) => ({
          id: p.id,
          title: p.title,
          balance: p.variants[0].inventory_quantity,
          variantId: p.variants[0].id,
          code: p.variants[0].sku,
          price: p.variants[0].price,
          image: p.image.src,
          totalStoreInventory: p.totalStoreInventory,
          posProductName: p.productName,
          posSalesPrice: p.salesPrice,
        }));
        return this.setState({ products: flatResponse, loading: false });
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

    const {
      products,
      loading,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      columns,
      options,
      productCode,
      storeInventory,
      shopifyInventory,
      shopifyPrice,
      shopifyProductName,
      showUpdateModal,
      posSalesPrice,
      posProductName,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>GEKPOWER Shopify Products and Inventory</div>
              </CardHeader>
              <CardBody>
                <MaterialTable
                  columns={columns}
                  data={products}
                  actions={[
                    {
                      icon: 'edit',
                      tooltip: 'Update Shopify Inventory',
                      onClick: (event, rowData) => this.showUpdateInventory(rowData),
                    },
                  ]}
                  options={options}
                  title=""
                />
              </CardBody>
            </Card>
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
          <Dialog
            maxWidth="xl"
            open={showUpdateModal}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogContent>
              <Card>
                <CardHeader color="primary">
                  <div className={styles.cardTitleWhite}>
                    GEKPOWER Shopify Product Information
                  </div>
                </CardHeader>
                <CardBody>
                  <GridContainer md={12}>
                    <GridItem md={12}>
                      <TextField
                        name="productName"
                        label="GEK Power Product Name"
                        type="text"
                        disabled
                        onChange={this.handleChange}
                        value={shopifyProductName}
                        fullWidth="true"
                      />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        name="posProductName"
                        label="POS Product Name"
                        type="text"
                        disabled
                        onChange={this.handleChange}
                        value={posProductName}
                        fullWidth="true"
                      />
                    </GridItem>
                    <GridItem md={4}>
                      <TextField
                        name="productCode"
                        label="Product Code"
                        type="text"
                        disabled
                        onChange={this.handleChange}
                        value={productCode}
                        fullWidth="true"
                      />
                    </GridItem>
                    <GridItem md={4}>
                      <TextField
                        name="posSalesPrice"
                        label="POS Sales Price"
                        type="text"
                        disabled
                        onChange={this.handleChange}
                        value={posSalesPrice}
                        fullWidth="true"
                      />
                    </GridItem>
                    <GridItem md={4}>
                      <TextField
                        name="shopifyPrice"
                        label="GEK Power Price"
                        type="text"
                        disabled
                        onChange={this.handleChange}
                        value={shopifyPrice}
                        fullWidth="true"
                      />
                    </GridItem>
                    <GridItem md={3}>
                      <TextField
                        name="storeInventory"
                        label="POS Store Inventory"
                        type="text"
                        disabled
                        onChange={this.handleChange}
                        value={storeInventory}
                        fullWidth="true"
                      />
                    </GridItem>
                    <GridItem md={3}>
                      <TextField
                        name="shopifyInventory"
                        label="GEKPOWER Shopify Inventory"
                        type="text"
                        onChange={this.handleChange}
                        value={shopifyInventory}
                        fullWidth="true"
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </DialogContent>
            <DialogActions>
              {loading && (<LinearProgress />)}
              <Button onClick={this.updateInventory} color="primary">
                Update Shopify
              </Button>
              <Button onClick={this.handleClose} color="info">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </GridContainer>
      </div>
    );
  }
}
