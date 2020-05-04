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
import ProductSearchV2 from '../Orders/ProductSearchV2';
import PurchaseTable from './PurchaseTable';
import PurchaseService from '../../services/PurchaseService';
import Location from '../../stores/Location';

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

function priceRow(qty, unit, overheadCost) {
  return Number(qty * unit) + Number(overheadCost);
}

function createRow(productId, productName) {
  const qty = 1;
  const unitPrice = 0;
  const overheadCost = 0;
  const price = priceRow(qty, unitPrice, overheadCost);
  return {
    productId, productName, qty, unitPrice, overheadCost, price,
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
      loading: false,
    };

    this.productChanged = this.productChanged.bind(this);
    this.priceChanged = this.priceChanged.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.savePurchase = this.savePurchase.bind(this);
  }

  async componentDidMount() {
    const { match, location } = this.props;
    const purchaseId = match.params.id || location.state.purchaseId;

    if (purchaseId && !isNaN(purchaseId)) {
      const purchase = await PurchaseService.getPurchaseDetail(purchaseId);
      const details = purchase.purchaseDetail.filter((row) => row.status === 'Plan');
      if (purchase) {
        this.setState({
          rows: details.map((row) => (
            {
              productId: row.productId,
              qty: row.amount,
              unitPrice: row.unitPrice,
              productName: row.product.productName,
              total: row.total,
              overheadCost: row.overheadCost,
            })),
          notes: purchase.notes,
          subTotal: purchase.subTotal,
          total: purchase.total,
          supplier: purchase.supplier,
          deliveryDate: purchase.deliveryDate.replace('T00:00:00', ''),
          poNumber: purchase.poNumber,
        });
      }
    }
  }

  productChanged(product) {
    const { rows } = this.state;
    const newRows = JSON.parse(JSON.stringify(rows));
    const foundProduct = newRows.find((row) => row.productId === product.productId);
    if (foundProduct) {
      foundProduct.qty = Number(foundProduct.qty) + 1;
      foundProduct.total = Number(foundProduct.qty * foundProduct.unitPrice)
        + Number(foundProduct.overheadCost);
      this.setState({ rows: newRows });
    } else {
      const newRow = createRow(product.productId, product.productName, product.salesPrice);
      this.setState((prevState) => ({
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
    const purchaseDetails = rows.map((row) => (
      {
        purchaseId: 0,
        purchaseDetailId: 0,
        productId: row.productId,
        amount: row.qty,
        unitPrice: row.unitPrice,
        overheadCost: row.overheadCost,
        poNumber,
        status: 'Plan',
        totalPrice: Number(row.qty * row.unitPrice) + Number(row.overheadCost),
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

    let result;
    const { match } = this.props;
    const purchaseId = match.params.id;
    if (purchaseId && !isNaN(purchaseId)) {
      result = await PurchaseService.updatePurchase(purchaseId, purchase);
    } else {
      result = await PurchaseService.savePurchase(purchase);
    }

    if (result === false
      || result === null
      || result.StatusCode === 500
      || result.StatusCode === 400) {
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
    this.setState({
      loading: true,
    });

    const result = await this.save();
    if (result && result.purchaseId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Purchase was Saved successfully!',
        snackbarColor: 'success',
      });

      this.props.history.push({
        pathname: `/purchase/${result.purchaseId}`,
        state: { purchaseId: result.purchaseId },
      });
    }

    this.setState({
      loading: false,
    });
  }

  render() {
    const {
      rows, openSnackbar, snackbarMessage, snackbarColor, notes, supplier, deliveryDate, poNumber,
      loading,
    } = this.state;

    const { match } = this.props;
    const locationId = Location.getStoreLocation();

    const purchaseId = match.params.id;
    let pageTitle = 'New Purchase';
    if (purchaseId && !isNaN(purchaseId)) {
      pageTitle = `Update Purchase: ${purchaseId}`;
    }

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>{pageTitle}</div>
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
                    <ProductSearchV2 productChanged={this.productChanged} locationId={locationId} />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    Planned Items
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
                    <Button color="primary" disabled={loading} onClick={this.savePurchase}>Save</Button>
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
