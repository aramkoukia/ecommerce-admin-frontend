import React from 'react';
import Check from '@material-ui/icons/Check';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Button from '../../components/CustomButtons/Button';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import CustomInput from '../../components/CustomInput/CustomInput';
import Snackbar from '../../components/Snackbar/Snackbar';
import ProductSearch from '../Orders/ProductSearch';
import PurchaseTable from './PurchaseTable';
import PurchaseService from '../../services/PurchaseService';

const styles = {
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
};

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(productId, productName) {
  const qty = 1;
  const unitPrice = 0;
  const price = priceRow(qty, unitPrice);
  return {
    productId, productName, qty, unitPrice, price,
  };
}

export default class AddPurchase extends React.Component {
  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      supplier: '',
      rows: [],
      notes: '',
      poNumber: '',
      deliveryDate: today.getDate(),
      openSnackbar: false,
    };

    this.productChanged = this.productChanged.bind(this);
    this.priceChanged = this.priceChanged.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.savePurchase = this.savePurchase.bind(this);
  }

  productChanged(product) {
    const { rows } = this.state;
    const newRows = JSON.parse(JSON.stringify(rows));
    const foundProduct = newRows.find(row => row.productId === product.productId);
    if (foundProduct) {
      foundProduct.qty = Number(foundProduct.qty) + 1;
      foundProduct.total = foundProduct.qty * foundProduct.unitPrice;
      this.setState({ rows: newRows });
    } else {
      const newRow = createRow(product.productId, product.productName, product.salesPrice);
      this.setState(prevState => ({
        rows: [...prevState.rows, newRow],
      }));
    }
  }

  priceChanged(subTotal, total) {
    this.setState({
      subTotal,
      total,
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async save() {
    const {
      supplier, rows, total, subTotal, notes, deliveryDate, poNumber,
    } = this.state;
    const purchaseDetails = rows.map(row => (
      {
        purchaseId: 0,
        purchaseDetailId: 0,
        productId: row.productId,
        amount: row.qty,
        unitPrice: row.unitPrice,
        totalPrice: row.qty * row.unitPrice,
      }));

    const purchase = {
      subTotal,
      deliveryDate,
      total,
      supplier,
      notes,
      poNumber,
      status: 'Purchased',
      purchaseDetail: purchaseDetails,
    };

    // if (!(deliveryDate instanceof Date)) {
    //   this.setState({
    //     openSnackbar: true,
    //     snackbarMessage: 'Enter a valid Delivery Date!',
    //     snackbarColor: 'danger',
    //   });
    //   return false;
    // }

    const result = await PurchaseService.savePurchase(purchase);
    if (result === false || result === null || result.StatusCode === 500 || result.StatusCode === 400) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Oops, looks like something went wrong!',
        snackbarColor: 'danger',
      });
      return false;
    }
    return result;
  }

  async savePurchase() {
    const result = await this.save();
    if (result && result.purchaseId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Purchase was Saved successfully!',
        snackbarColor: 'success',
      });
      this.props.history.push(`/purchase/${result.purchaseId}`);
    }
  }

  render() {
    const {
      rows, openSnackbar, snackbarMessage, snackbarColor, notes, supplier, deliveryDate, poNumber,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>New Purchase</div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Supplier"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: supplier,
                        name: 'supplier',
                        onChange: this.handleChange,
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <ProductSearch productChanged={this.productChanged} />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <PurchaseTable
                      rows={rows}
                      priceChanged={this.priceChanged}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Delivery Date"
                      formControlProps={{
                        required: 'required',
                      }}
                      inputProps={{
                        value: deliveryDate,
                        name: 'deliveryDate',
                        onChange: this.handleChange,
                        type: 'date',
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="PO Number"
                      formControlProps={{
                        required: 'required',
                      }}
                      inputProps={{
                        value: poNumber,
                        name: 'poNumber',
                        onChange: this.handleChange,
                        type: 'text',
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Notes"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 1,
                        value: notes,
                        name: 'notes',
                        onChange: this.handleChange,
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <GridContainer>
                  <GridItem xs>
                    <Button color="primary" onClick={this.savePurchase}>Save</Button>
                  </GridItem>
                </GridContainer>
              </CardFooter>
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
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

// AddOrder.propTypes = {
//   classes: PropTypes.object.isRequired,
// };
