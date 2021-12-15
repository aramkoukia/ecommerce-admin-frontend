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
    columns: [
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
    },
  };

  // constructor(props) {
  //   super(props);
  //   this.syncProducts = this.syncProducts.bind(this);
  //   this.handleChange = this.handleChange.bind(this);
  // }

  componentDidMount() {
    this.productsList();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
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
          code: p.variants[0].sku,
          price: p.variants[0].price,
          image: p.image.src,
          totalStoreInventory: p.totalStoreInventory,
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
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Shopify Products and Inventory</div>
              </CardHeader>
              <CardBody>
                <MaterialTable
                  columns={columns}
                  data={products}
                  // actions={[
                  //   {
                  //     icon: 'menu',
                  //     tooltip: 'Transactions',
                  //     onClick: (event, rowData) => this.showTransactions(rowData.productId),
                  //   },
                  // ]}
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
        </GridContainer>
      </div>
    );
  }
}
