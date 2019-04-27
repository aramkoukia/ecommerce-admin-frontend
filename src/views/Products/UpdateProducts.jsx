import React from 'react';
import MaterialTable from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import Check from '@material-ui/icons/Check';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import ProductService from '../../services/ProductService';

export default class UpdateProducts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      loading: false,
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.productsList();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  productsList() {
    this.setState({ loading: true });
    ProductService.getProducts()
      .then(data => this.setState({ products: data, loading: false }));
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

    const columns = [
      { title: 'Product Type', field: 'productTypeName', hidden: true, readonly: true },
      { title: 'Product Code', field: 'productCode', readonly: true },
      { title: 'Product Name', field: 'productName', readonly: true },
      { title: 'Purchase Price ($)', field: 'purchasePrice', type: 'numeric' },
      { title: 'Sales Price ($)', field: 'salesPrice', type: 'numeric', readonly: true },
      { title: 'Van Balance', field: 'vancouverBalance', type: 'numeric', hidden: true, readonly: true },
      { title: 'Abb Balance', field: 'abbotsfordBalance', type: 'numeric', hidden: true, readonly: true },
      { title: 'Disabled', field: 'disabled', readonly: true },
      { title: 'Product Id', field: 'productId', hidden: true, readonly: true },
    ];

    const {
      products,
      loading,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
    } = this.state;

    const options = {
      paging: true,
      pageSizeOptions: [25, 50, 100],
      pageSize: 25,
      columnsButton: true,
      exportButton: true,
      filtering: true,
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
              editable={{
                // onRowAdd: newData =>
                //   new Promise((resolve, reject) => {
                //     setTimeout(() => {
                //       {
                //         const data = this.state.data;
                //         data.push(newData);
                //         this.setState({ data }, () => resolve());
                //       }
                //       resolve()
                //     }, 1000)
                //   }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        const index = products.indexOf(oldData);
                        products[index] = newData;
                        ProductService.updateProduct(newData);
                        this.setState({ products }, () => resolve());
                      }
                      resolve()
                    }, 1000)
                  }),
                // onRowDelete: oldData =>
                //   new Promise((resolve, reject) => {
                //     setTimeout(() => {
                //       {
                //         let data = this.state.data;
                //         const index = data.indexOf(oldData);
                //         data.splice(index, 1);
                //         this.setState({ data }, () => resolve());
                //       }
                //       resolve()
                //     }, 1000)
                //   }),
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
      </div>
    );
  }
}

// export default withStyles(styles)(Products);
