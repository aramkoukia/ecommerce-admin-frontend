/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import MaterialTable from 'material-table';
import {
  LinearProgress,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
// import Button from '../../components/CustomButtons/Button';
import GenericProductService from '../../services/GenericProductService';
import BrandProductService from '../../services/BrandProductService';
import ProductCategoryService from '../../services/ProductCategoryService';
// import ShopifyStorefrontService from '../../services/ShopifyStorefrontService';


export default class GenericProducts extends React.Component {
  state = {
    genericProducts: [],
    productCategories: [],
    loading: false,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    detailPanelColumns: [
      {
        title: 'Brand Name',
        field: 'brandName',
        readonly: true,
        editable: 'never',
      },
      {
        title: 'Brand SKU', field: 'brandProductCode',
      },
      {
        title: 'Brand Product Name',
        field: 'brandProductName',
        // readonly: true,
        // editable: 'never',
      },
      {
        title: 'Sales Price', field: 'salesPrice',
      },
      {
        title: 'Shopify Product Id',
        field: 'shopifyProductId',
        render: (rowData) => <a target='_blank' href={`${rowData.shopifyBaseUrl}/admin/products/${rowData.shopifyProductId}`}>{rowData.shopifyProductId}</a>,
        readonly: true,
        editable: 'never',
      },
      {
        title: 'Enabled',
        field: 'enabled',
        readonly: true,
        lookup: {
          Yes: 'Yes',
          No: 'No',
        },
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
      addRowPosition: 'first',
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
      rowStyle(data) {
        if (data.enabled === 'No') {
          return {
            backgroundColor: '#FFE9E9',
            fontStyle: 'italic',
          };
        }
        return {};
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
    this.productCategoriesList();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  productsList() {
    this.setState({ loading: true });
    GenericProductService.getGenericProducts()
      .then((data) => this.setState({ genericProducts: data, loading: false }));
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

  addOrUpdateBrandProduct(rowData, newData) {
    const newBrandProduct = {
      genericProductId: rowData.genericProductId,
      brandId: newData.brandId,
      brandProductCode: newData.brandProductCode,
      brandProductId: newData.brandProductId,
      brandProductName: newData.brandProductName,
      enabled: newData.enabled,
      salesPrice: newData.salesPrice,
    };

    const { genericProducts } = this.state;
    const newItems = [...genericProducts];

    const genericProduct = genericProducts.find(
      (p) => p.genericProductId === rowData.genericProductId,
    );
    const brandProduct = genericProduct.brandProducts.find(
      (b) => b.brandProductId === newData.brandProductId
        || b.brandId === newData.brandId,
    );

    brandProduct.brandProductCode = newData.brandProductCode;
    brandProduct.brandProductName = newData.brandProductName;
    brandProduct.enabled = newData.enabled;
    brandProduct.salesPrice = newData.salesPrice;

    this.setState({ genericProducts: newItems });

    BrandProductService.addOrUpdateBrandProduct(newBrandProduct);
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
      productCategories,
      loading,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      detailPanelColumns,
      options,
      detailPanelOptions,
    } = this.state;

    const columns = [
      {
        title: 'Product Type',
        field: 'productTypeId',
        readonly: true,
        lookup: productCategories,
      },
      {
        title: 'Generic Product SKU',
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
        title: 'Enabled',
        field: 'enabled',
        readonly: true,
        defaultFilter: ['Yes'],
        lookup: {
          Yes: 'Yes',
          No: 'No',
        },
      },
      {
        title: 'Product Id', field: 'genericProductId', hidden: true, readonly: true,
      },
    ];

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
              onRowUpdate: (newData) => new Promise((resolve) => {
                setTimeout(() => {
                  this.addOrUpdateBrandProduct(rowData, newData);
                  resolve();
                }, 100);
              }),
            }}
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
                <div className={styles.cardTitleWhite}>Headquarter - Generic Products</div>
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
                  editable={{
                    onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = genericProducts.indexOf(oldData);
                          genericProducts[index] = newData;
                          GenericProductService.updateGenericProduct(newData);
                          this.setState({ genericProducts }, () => resolve());
                        }
                        resolve();
                      }, 100);
                    }),
                    onRowAdd: (newData) => new Promise((resolve) => {
                      setTimeout(() => {
                        genericProducts.push(newData);
                        GenericProductService.addGenericProduct(newData);
                        this.setState({ genericProducts }, () => resolve());
                        resolve();
                      }, 100);
                    }),
                    onRowDelete: (oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          // todo: need to make this not delete but, disable/enable
                          const index = genericProducts.indexOf(oldData);
                          genericProducts.splice(index, 1);
                          GenericProductService.deleteGenericProduct(oldData.genericProductId);
                          this.setState({ genericProducts }, () => resolve());
                        }
                        resolve();
                      }, 100);
                    }),
                  }}
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
      </div>
    );
  }
}
