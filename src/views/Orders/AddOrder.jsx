import React from 'react';
import Check from '@material-ui/icons/Check';
import Add from '@material-ui/icons/Add';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Table from '@material-ui/core/Table';
import TextField from '@material-ui/core/TextField';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Button from '../../components/CustomButtons/Button';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import CustomInput from '../../components/CustomInput/CustomInput';
import Snackbar from '../../components/Snackbar/Snackbar';
import ProductSearch from './ProductSearch';
import CustomerSearch from './CustomerSearch';
import AddCustomer from '../Customers/AddCustomer';
import OrderTable from './OrderTable';
import OrderService from '../../services/OrderService';
import TaxService from '../../services/TaxService';
import UserService from '../../services/UserService';
import SettingsService from '../../services/SettingsService';
import Location from '../../stores/Location';
import AuthStore from '../../stores/Auth';

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
  smallText: {
    width: '100px',
  },
};

// function calculateSalesPrice(productPackages, salesPrice, qty) {
//   for (let i = 0; i < productPackages.length; i += 1) {
//     if (Number(qty) >= Number(productPackages[i].amountInMainPackage)) {
//       return productPackages[i].packagePrice;
//     }
//   }
//   return salesPrice;
// }

function createRow(productId, productName, salesPrice, productPackages, id) {
  const qty = 1;
  const discountPercent = 0;
  const discountAmount = 0;
  const discountType = 'percent';

  if (productPackages && productPackages.length > 0) {
    productPackages
      .sort(
        (a, b) => (
          (a.amountInMainPackage > b.amountInMainPackage) ? 1 : ((b.amountInMainPackage > a.amountInMainPackage) ? -1 : 0)));
  }

  const price = productPackages && productPackages.length > 0
    ? productPackages[0].packagePrice
    : salesPrice;

  const productPackageId = productPackages && productPackages.length > 0
    ? productPackages[0].productPackageId
    : null;
  const pkg = productPackages && productPackages.length > 0
    ? productPackages[0].package
    : null;
  const amountInMainPackage = productPackages && productPackages.length > 0
    ? productPackages[0].amountInMainPackage
    : null;

  const total = qty * price;

  return {
    id,
    productId,
    productName,
    qty,
    salesPrice: price,
    price,
    discountPercent,
    discountAmount,
    discountType,
    total,
    productPackages,
    productPackageId,
    package: pkg,
    amountInMainPackage,
  };
}

export default class AddOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      customer: null,
      rows: [],
      discountPercent: 0.00,
      discountAmount: 0.00,
      notes: '',
      poNumber: '',
      taxes: [],
      allTaxes: [],
      openSnackbar: false,
      chargePst: true,
      openDialog: false,
      openCustomerDialog: false,
      userGivenName: '',
      chequeNo: '',
      payCreditDebit: true,
      creditDebitAmount: 0,
      cashAmount: 0,
      chequeAmount: 0,
      paypalAmazonUsdAmount: 0,
      payStoreCredit: false,
      storeCreditAmount: 0,
      cashPaid: 0,
      cashChange: 0,
      validationResult: [],
      showValidationDialog: false,
      orderStatus: '',
      loading: false,
    };

    this.productChanged = this.productChanged.bind(this);
    this.priceChanged = this.priceChanged.bind(this);
    this.productRemoved = this.productRemoved.bind(this);
    this.customerChanged = this.customerChanged.bind(this);
    this.clearCustomer = this.clearCustomer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAuthCodeChange = this.handleAuthCodeChange.bind(this);
    this.handleCashChange = this.handleCashChange.bind(this);
    this.saveAsPaid = this.saveAsPaid.bind(this);
    this.saveAsPaidClicked = this.saveAsPaidClicked.bind(this);
    this.saveAsDraft = this.saveAsDraft.bind(this);
    this.saveAsHold = this.saveAsHold.bind(this);
    this.saveAsHoldClicked = this.saveAsHoldClicked.bind(this);
    this.saveAsAccount = this.saveAsAccount.bind(this);
    this.saveAsAccountClicked = this.saveAsAccountClicked.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handlePstCheckChange = this.handlePstCheckChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.pay = this.pay.bind(this);
    this.handleAuthUpdate = this.handleAuthUpdate.bind(this);
    this.handleAuthEnter = this.handleAuthEnter.bind(this);
    this.newCustomer = this.newCustomer.bind(this);
    this.continueOrder = this.continueOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.customerSaved = this.customerSaved.bind(this);
    this.handleCustomerDialogClose = this.handleCustomerDialogClose.bind(this);
  }

  async componentDidMount() {
    const taxes = await TaxService.getTaxes('Canada', 'BC');
    this.setState({
      taxes,
      allTaxes: taxes,
      chargePst: true,
      openDialog: false,
      openAuthDialog: true,
      userGivenName: '',
      chequeNo: '',
    });
    const { match } = this.props;
    const orderId = match.params.id;
    if (orderId && !isNaN(orderId)) {
      const order = await OrderService.getOrderDetail(orderId);
      if (order && order.status === 'Draft') {
        if (order.customer.customerId) {
          this.customerChanged(order.customer);
        }
        // const {
        //   customer, rows, total, subTotal, notes, taxes, poNumber, authCode,
        // } = this.state;
        this.setState({
          rows: order.orderDetail.map((row, index) => (
            {
              id: index + 1,
              productId: row.productId,
              qty: row.amount,
              salesPrice: row.unitPrice,
              productName: row.product.productName,
              discountType: row.discountType,
              discountAmount: row.discountAmount,
              discountPercent: row.discountPercent,
              total: row.total,
              productPackages: row.product.productPackage,
              package: row.package,
              productPackageId: row.product.productPackage && row.product.productPackage.length > 0
                ? row.product.productPackage.find(p => p.package === row.package)
                  ? row.product.productPackage.find(p => p.package === row.package).productPackageId
                  : row.product.productPackage[0].productPackageId
                : null,
              amountInMainPackage: row.amountInMainPackage,
            })),
          notes: order.notes,
          poNumber: order.poNumber,
          subTotal: order.subTotal,
          total: order.total,
        });
      }
    }
  }

  getOrderPayments() {
    const {
      payCash,
      payCreditDebit,
      payCheque,
      payAmazonUsd,
      payStoreCredit,
      cashAmount,
      creditDebitAmount,
      chequeAmount,
      paypalAmazonUsdAmount,
      storeCreditAmount,
      chequeNo,
    } = this.state;

    const orderPayments = [];
    if (payCash) {
      orderPayments.push({
        paymentTypeId: 22,
        paymentAmount: cashAmount,
      });
    }
    if (payCreditDebit) {
      orderPayments.push({
        paymentTypeId: 23,
        paymentAmount: creditDebitAmount,
      });
    }
    if (payCheque) {
      orderPayments.push({
        paymentTypeId: 24,
        paymentAmount: chequeAmount,
        chequeNo,
      });
    }
    if (payAmazonUsd) {
      orderPayments.push({
        paymentTypeId: 25,
        paymentAmount: paypalAmazonUsdAmount,
      });
    }
    if (payStoreCredit) {
      orderPayments.push({
        paymentTypeId: 26,
        paymentAmount: storeCreditAmount,
      });
    }

    return orderPayments;
  }

  cancelOrder = () => {
    this.setState({
      showValidationDialog: false,
    });
  }

  handleCustomerDialogClose() {
    this.setState({
      openCustomerDialog: false,
    });
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  }

  async continueOrder() {
    this.setState({
      showValidationDialog: false,
    });
    const { orderStatus } = this.state;
    if (orderStatus === 'Account') {
      await this.saveAsAccount();
    } else if (orderStatus === 'OnHold') {
      await this.saveAsHold();
    } else if (orderStatus === 'Paid') {
      await this.saveAsPaid();
    }
  }

  newCustomer() {
    this.setState({ openCustomerDialog: true });
  }

  async handleAuthEnter(event) {
    if (event.key === 'Enter') {
      await this.handleAuthUpdate();
    }
  }

  async handleAuthUpdate(passedAuthCode) {
    let authCode = '';
    if (passedAuthCode && passedAuthCode.type !== 'click') {
      authCode = passedAuthCode;
    } else {
      authCode = this.state.authCode;
    }

    const { permissionsChanged } = this.props;

    const result = await UserService.getUserByAuthCode(authCode);
    if (result === false
        || result === ''
        || result === null
        || result.StatusCode === 500
        || result.StatusCode === 400
        || result.StatusCode === 404) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Invalid Auth Code!',
        snackbarColor: 'danger',
      });
      return false;
    }

    AuthStore.setUserPermissions(result.permissions);
    this.setState({
      openAuthDialog: false,
      userGivenName: result.user.givenName,
    });

    // TODO: this is temp, and is null for the scenario that user edits a Draft order
    if (permissionsChanged) {
      permissionsChanged();
    }
  }

  updateTaxes(customer, chargePst) {
    const { allTaxes } = this.state;
    // removing taxes with name like "pst" from the list
    // if the selected customer has PST number in their profile
    if (customer && customer.pstNumber && !chargePst) {
      const filterTaxes = allTaxes.reduce((filterTaxes, tax) => {
        if (!tax.taxName.toLowerCase().includes('pst')) {
          filterTaxes.push(tax);
        }
        return filterTaxes;
      }, []);

      this.setState({
        taxes: filterTaxes,
      });
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'PST Tax not charged for this customer!',
        snackbarColor: 'warning',
      });
    } else {
      this.setState({
        taxes: allTaxes,
      });
    }
  }

  async customerChanged(customer) {
    const { chargePst } = this.state;

    if (customer.country === 'USA' || customer.country === 'OTHER') {
      this.setState({
        taxes: [],
        allTaxes: [],
      });
    } else if (customer && customer.province && customer.province !== 'BC') {
      const taxes = await TaxService.getTaxes('Canada', customer.province);
      this.setState({
        taxes,
        allTaxes: taxes,
      });
    }

    this.updateTaxes(customer, chargePst);
    this.setState({
      customer,
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleAuthCodeChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.value.length === 6) {
      this.handleAuthUpdate(event.target.value);
    }
  }

  handleCashChange(event) {
    const { cashAmount } = this.state;
    const cashPaid = event.target.value;
    let cashChange = 0;
    if (event.target.value && cashAmount) {
      cashChange = Number(Number(cashPaid).toFixed(2) - Number(cashAmount).toFixed(2)).toFixed(2);
    }

    this.setState({
      cashPaid,
      cashChange,
    });
  }

  handleCheckChange(event) {
    const {
      total,
      cashAmount,
      creditDebitAmount,
      chequeAmount,
      paypalAmazonUsdAmount,
      storeCreditAmount,
    } = this.state;

    const paymentAmount = (
      Number(cashAmount)
      + Number(creditDebitAmount)
      + Number(chequeAmount)
      + Number(storeCreditAmount)
      + Number(paypalAmazonUsdAmount)).toFixed(2);

    const remain = (total - paymentAmount).toFixed(2);
    this.setState({ [event.target.name]: event.target.checked });
    if (event.target.checked) {
      if (event.target.name === 'payCash') {
        this.setState({ cashAmount: remain });
      } else if (event.target.name === 'payCreditDebit') {
        this.setState({ creditDebitAmount: remain });
      } else if (event.target.name === 'payCheque') {
        this.setState({ chequeAmount: remain });
      } else if (event.target.name === 'payAmazonUsd') {
        this.setState({ paypalAmazonUsdAmount: remain });
      } else if (event.target.name === 'payStoreCredit') {
        this.setState({ storeCreditAmount: remain });
      }
    } else if (event.target.name === 'payCash') {
      this.setState({ cashAmount: 0 });
    } else if (event.target.name === 'payCreditDebit') {
      this.setState({ creditDebitAmount: 0 });
    } else if (event.target.name === 'payCheque') {
      this.setState({ chequeAmount: 0 });
    } else if (event.target.name === 'payAmazonUsd') {
      this.setState({ paypalAmazonUsdAmount: 0 });
    } else if (event.target.name === 'payStoreCredit') {
      this.setState({ storeCreditAmount: 0 });
    }
  }

  handlePstCheckChange(event) {
    this.setState({ chargePst: event.target.checked });
    const { customer } = this.state;
    this.updateTaxes(customer, event.target.checked);
  }

  orderExceedsCustomerCredit() {
    const { customer, total } = this.state;
    if (customer
      && customer.creditLimit
      && customer.creditLimit > customer.accountBalance + total) {
      return false;
    }

    return true;
  }

  async validateInventory(rows, orderStatus, locationId) {
    this.setState({ orderStatus });
    if (orderStatus === 'Draft') {
      return false;
    }

    const setting = await SettingsService.getSettings();
    const { warnInSufficientStockOnOrder, blockInSufficientStockOnOrder } = setting;
    this.setState({
      warnInSufficientStockOnOrder,
      blockInSufficientStockOnOrder,
    });

    if (warnInSufficientStockOnOrder || blockInSufficientStockOnOrder) {
      const orderItems = rows.map(row => (
        {
          locationId,
          productId: row.productId,
          amount: row.amountInMainPackage !== null && row.amountInMainPackage > 0
            ? Number(row.qty) * Number(row.amountInMainPackage)
            : row.qty,
        }));

      const result = await OrderService.validateInventory({ orderItems });
      if (result && result.length > 0) {
        this.setState({
          validationResult: result,
          showValidationDialog: true,
        });
        return true;
      }
    }
    return false;
  }

  async saveOrder(orderStatus) {
    this.setState({
      loading: true,
    });

    const {
      customer, rows, total, subTotal, notes, taxes, poNumber, authCode,
    } = this.state;
    const locationId = Location.getStoreLocation();
    const status = orderStatus;
    const orderDetails = rows.map(row => (
      {
        orderId: 0,
        orderDetailId: 0,
        productId: row.productId,
        amount: row.qty,
        unitPrice: row.salesPrice,
        discountPercent: row.discountPercent,
        discountAmount: row.discountAmount,
        discountType: row.discountType,
        subTotal: row.total,
        package: row.package,
        amountInMainPackage: row.amountInMainPackage,
        totalDiscount: (row.discountType === 'percent' ? (row.discountPercent / 100) * row.total : row.discountAmount),
        total: row.total - (row.discountType === 'percent' ? (row.discountPercent / 100) * row.total : row.discountAmount),
      }));
    const orderTaxes = taxes.map(tax => (
      {
        taxId: tax.taxId,
        taxAmount: (tax.percentage / 100) * subTotal,
      }));

    let orderPayment = [];
    if (orderStatus === 'Paid') {
      const {
        payStoreCredit,
        storeCreditAmount,
      } = this.state;
      if (payStoreCredit && storeCreditAmount > customer.storeCredit) {
        this.setState({
          openSnackbar: true,
          loading: false,
          snackbarMessage: `Customer Store Credit ${customer.storeCredit}, is less than Store Credit Specified : ${storeCreditAmount}!`,
          snackbarColor: 'danger',
        });
        return false;
      }

      orderPayment = this.getOrderPayments();
    }

    const order = {
      locationId,
      subTotal,
      total,
      customerId: customer !== null ? customer.customerId : null,
      status,
      notes,
      poNumber,
      pstNumber: customer !== null ? customer.pstNumber : null,
      orderTax: orderTaxes,
      orderDetail: orderDetails,
      authCode,
      orderPayment,
    };

    const { match } = this.props;
    const orderId = match.params.id;

    let result;
    if (orderId && !isNaN(orderId)) {
      result = await OrderService.updateOrder(orderId, order);
      if (result && result.orderId === Number(orderId) && status !== 'Draft') {
        const resultUpdateStatus = await OrderService.updateOrderStatus(orderId, { orderStatus: status, orderPayment });
        if (resultUpdateStatus === false
          || resultUpdateStatus === null
          || resultUpdateStatus.StatusCode === 500
          || resultUpdateStatus.StatusCode === 400) {
          this.setState({
            openSnackbar: true,
            loading: false,
            snackbarMessage: 'Oops, looks like something went wrong!',
            snackbarColor: 'danger',
          });
          return false;
        }
      }
    } else {
      result = await OrderService.saveOrder(order);
    }

    if (result === false
        || result === null
        || result.StatusCode === 500
        || result.StatusCode === 400) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Oops, looks like something went wrong!',
        snackbarColor: 'danger',
        loading: false,
      });
      return false;
    }

    this.setState({
      loading: false,
    });

    return result;
  }

  async pay() {
    const {
      total,
      cashAmount,
      creditDebitAmount,
      chequeAmount,
      paypalAmazonUsdAmount,
      storeCreditAmount,
    } = this.state;

    const paidAmount = Number(cashAmount)
      + Number(creditDebitAmount)
      + Number(chequeAmount)
      + Number(storeCreditAmount)
      + Number(paypalAmazonUsdAmount);

    if ((Number(paidAmount)).toFixed(2) !== (Number(total)).toFixed(2)) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: `Total Paid Amount: ${paidAmount.toFixed(2)} $, must be the same as Order Total:${total.toFixed(2)} $`,
        snackbarColor: 'danger',
      });
      return;
    }

    const { history } = this.props;
    const result = await this.saveOrder('Paid');
    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Order was Saved and marked as Paid successfully!',
        snackbarColor: 'success',
      });
      history.push(`/order/${result.orderId}`);
    }
  }

  async saveAsPaid() {
    const { total } = this.state;
    this.setState({
      openDialog: true,
      creditDebitAmount: total.toFixed(2),
    });
  }

  async saveAsPaidClicked() {
    const { rows } = this.state;
    const locationId = Location.getStoreLocation();
    const validationExecuted = await this.validateInventory(rows, 'Paid', locationId);
    if (validationExecuted) {
      return;
    }

    this.saveAsPaid();
  }

  clearCustomer() {
    this.setState({ customer: null });
  }

  priceChanged(subTotal, total) {
    this.setState({
      subTotal,
      total,
    });
  }

  productRemoved(id) {
    const { rows } = this.state;
    this.setState({
      rows: rows.filter(row => row.id != id),
    });
  }

  productChanged(product) {
    const { rows } = this.state;
    // const newRows = JSON.parse(JSON.stringify(rows));
    // const foundProduct = newRows.find(row => row.productId === product.productId);
    // if (foundProduct) {
    //   foundProduct.qty = Number(foundProduct.qty) + 1;
    //   foundProduct.total = foundProduct.qty * foundProduct.price;
    //   this.setState({ rows: newRows });
    // } else {
    const id = rows && rows.length > 0
      ? Math.max.apply(Math, rows.map(function (o) { return o.id; })) + 1
      : 1;

    const newRow = createRow(product.productId, product.productName, product.salesPrice, product.productPackages, id);
    this.setState(prevState => ({
      rows: [...prevState.rows, newRow],
    }));
    // }
  }

  async customerSaved(customer) {
    this.setState({
      openCustomerDialog: false,
    });

    await this.customerChanged(customer);
  }

  async saveAsDraft() {
    this.setState({
      loading: true,
    });

    const result = await this.saveOrder('Draft');
    const { history } = this.props;
    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Order was Saved as Draft successfully!',
        snackbarColor: 'warning',
      });
      history.push(`/order/${result.orderId}`);
    }
    this.setState({
      loading: false,
    });
  }

  async saveAsHold() {
    this.setState({
      loading: true,
    });

    const result = await this.saveOrder('OnHold');
    const { history } = this.props;
    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Order was Saved and marked as On Hold successfully!',
        snackbarColor: 'warning',
      });
      history.push(`/order/${result.orderId}`);
    }

    this.setState({
      loading: false,
    });
  }

  async saveAsHoldClicked() {
    this.setState({
      loading: true,
    });

    const { rows } = this.state;
    const locationId = Location.getStoreLocation();
    const validationExecuted = await this.validateInventory(rows, 'OnHold', locationId);
    if (validationExecuted) {
      return;
    }
    await this.saveAsHold();

    this.setState({
      loading: false,
    });
  }

  async saveAsAccount() {
    this.setState({
      loading: true,
    });

    const result = await this.saveOrder('Account');
    const { history } = this.props;

    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: "Order was Saved and Added to customer's Credit successfully!",
        snackbarColor: 'info',
      });
      history.push(`/order/${result.orderId}`);
    }

    this.setState({
      loading: false,
    });
  }

  async saveAsAccountClicked() {
    if (this.orderExceedsCustomerCredit()) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Customer is exceeding the credit limit!',
        snackbarColor: 'danger',
      });
      return;
    }
    const { rows } = this.state;
    const locationId = Location.getStoreLocation();
    const validationExecuted = await this.validateInventory(rows, 'Account', locationId);
    if (validationExecuted) {
      return;
    }
    this.saveAsAccount();
  }

  render() {
    const {
      rows,
      taxes,
      discountAmount,
      discountPercent,
      customer, openSnackbar, snackbarMessage, snackbarColor, notes, poNumber,
      chargePst,
      openDialog,
      openAuthDialog,
      openCustomerDialog,
      total,
      authCode,
      userGivenName,
      chequeNo,
      payCash,
      payCheque,
      payCreditDebit,
      payAmazonUsd,
      payStoreCredit,
      cashAmount,
      chequeAmount,
      creditDebitAmount,
      paypalAmazonUsdAmount,
      storeCreditAmount,
      cashChange,
      cashPaid,
      showValidationDialog,
      validationResult,
      warnInSufficientStockOnOrder,
      blockInSufficientStockOnOrder,
      loading,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  <b>New Order</b>
                  - User:
                  {userGivenName}
                </div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={9}>
                    <CustomerSearch customerChanged={this.customerChanged} />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <Button color="primary" onClick={this.newCustomer}>
                      <Add />
                      New Customer
                    </Button>
                  </GridItem>
                </GridContainer>
                { customer ? (
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <Card>
                        <CardBody>
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={3}>
                              <CustomInput
                                labelText="Full Name"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                  value: `${customer.firstName} ${customer.firstName}`,
                                }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3}>
                              <CustomInput
                                labelText="Email"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                  value: `${customer.email} `,
                                }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3}>
                              <CustomInput
                                labelText="Phone Number"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                  value: `${customer.phoneNumber} `,
                                }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3}>
                              <CustomInput
                                labelText="Store Credit($)"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                  value: `${customer.storeCredit} `,
                                }}
                              />
                            </GridItem>

                          </GridContainer>
                          <GridContainer alignItems="flex-end">
                            <GridItem xs={12} sm={12} md={3}>
                              <CustomInput
                                labelText="Credit Limit"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                  value: `${customer.creditLimit} $`,
                                  error: 'error',
                                }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3}>
                              <CustomInput
                                labelText="Unpaid Orders Amount"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                  value: `${customer.accountBalance} $`,
                                  error: 'error',
                                }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3}>
                              <CustomInput
                                labelText="PST Number"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                  value: customer.pstNumber === null ? 'Not Provided' : `${customer.pstNumber} `,
                                }}
                              />
                              <FormControlLabel
                                control={(
                                  <Checkbox
                                    checked={chargePst}
                                    onChange={this.handlePstCheckChange}
                                    value="chargePst"
                                  />
                                )}
                                label="Charge PST"
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3}>
                              <Button color="info" onClick={this.clearCustomer}>Clear</Button>
                            </GridItem>
                          </GridContainer>
                        </CardBody>
                      </Card>
                    </GridItem>
                  </GridContainer>
                ) : (<div />)
                }
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <ProductSearch productChanged={this.productChanged} />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    {/* <Button color="primary" onClick={this.newCustomer}>Product List</Button> */}
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <OrderTable
                      rows={rows}
                      taxes={taxes}
                      discountAmount={discountAmount}
                      discountPercent={discountPercent}
                      priceChanged={this.priceChanged}
                      productRemoved={this.productRemoved}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="PO Number"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: poNumber,
                        name: 'poNumber',
                        onChange: this.handleChange,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={9}>
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
                    <Button color="primary" disabled={loading} onClick={this.saveAsPaidClicked}>Mark As Paid</Button>
                  </GridItem>
                  <GridItem xs>
                    <Button color="info" disabled={loading} onClick={this.saveAsDraft}>Save As Draft</Button>
                  </GridItem>
                  { customer && customer.creditLimit > 0 ? (
                    <GridItem xs>
                      <Button color="info" disabled={loading} onClick={this.saveAsAccountClicked}>Use Customers Account</Button>
                    </GridItem>
                  ) : (<div />)
                  }
                  { customer ? (
                    <GridItem xs>
                      <Button color="info" disabled={loading} onClick={this.saveAsHoldClicked}>Put On Hold</Button>
                    </GridItem>
                  ) : (<div />)
                  }
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
        <Dialog
          open={openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="info">
                <div>Select Payment Option</div>
              </CardHeader>
              <CardBody>
                <FormControl component="fieldset">
                  <GridContainer md={12}>
                    <GridItem md={3}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            name="payCash"
                            checked={payCash}
                            onChange={this.handleCheckChange}
                            value="payCash"
                          />
                        )}
                        label="Cash"
                      />
                    </GridItem>
                    <GridItem md={3}>
                      <TextField
                        disabled={!payCash}
                        name="cashAmount"
                        label="Cash Amount"
                        type="text"
                        onChange={this.handleChange}
                        style={styles.smallText}
                        value={cashAmount}
                      />
                    </GridItem>
                    <GridItem md={3}>
                      <TextField
                        disabled={!payCash}
                        name="cashPaid"
                        label="Bills Paid"
                        type="text"
                        onChange={this.handleCashChange}
                        style={styles.smallText}
                        value={cashPaid}
                      />
                    </GridItem>
                    <GridItem md={3}>
                      <TextField
                        disabled
                        name="cashChange"
                        label="Change"
                        type="text"
                        style={styles.smallText}
                        value={cashChange}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={payCreditDebit}
                            onChange={this.handleCheckChange}
                            name="payCreditDebit"
                            value="payCreditDebit"
                          />
                        )}
                        label="Credit Card / Debit"
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <TextField
                        disabled={!payCreditDebit}
                        name="creditDebitAmount"
                        label="Credit/Debit Amount"
                        type="text"
                        onChange={this.handleChange}
                        value={creditDebitAmount}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={payCheque}
                            onChange={this.handleCheckChange}
                            value="payCheque"
                            name="payCheque"
                          />
                        )}
                        label="Cheque"
                      />
                      {payCheque && (
                        <TextField
                          name="chequeNo"
                          label="Cheque Number"
                          type="text"
                          onChange={this.handleChange}
                          value={chequeNo}
                        />
                      )}
                    </GridItem>
                    <GridItem md={6}>
                      <TextField
                        disabled={!payCheque}
                        name="chequeAmount"
                        label="Cheque Amount"
                        type="text"
                        onChange={this.handleChange}
                        value={chequeAmount}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={payAmazonUsd}
                            onChange={this.handleCheckChange}
                            value="payAmazonUsd"
                            name="payAmazonUsd"
                          />
                        )}
                        label="Paypal and Amazon + USD"
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <TextField
                        disabled={!payAmazonUsd}
                        name="paypalAmazonUsdAmount"
                        label="Paypal/Amazon/USD"
                        type="text"
                        onChange={this.handleChange}
                        value={paypalAmazonUsdAmount}
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            disabled={!customer || customer.storeCredit <= 0}
                            checked={payStoreCredit}
                            onChange={this.handleCheckChange}
                            value="payStoreCredit"
                            name="payStoreCredit"
                          />
                        )}
                        label="Store Credit"
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <TextField
                        disabled={!payStoreCredit}
                        name="storeCreditAmount"
                        label="Store Credit"
                        type="text"
                        onChange={this.handleChange}
                        value={storeCreditAmount}
                      />
                    </GridItem>
                    <GridItem md={12}>
                      <br />
                      <hr />
                    </GridItem>
                    <GridItem md={6}>
                      <h5>Total Payment:</h5>
                    </GridItem>
                    <GridItem md={6}>
                      <h5>
                        {(Number(cashAmount)
                          + Number(creditDebitAmount)
                          + Number(chequeAmount)
                          + Number(storeCreditAmount)
                          + Number(paypalAmazonUsdAmount)).toFixed(2)}
                        {' '}
                        $
                      </h5>
                    </GridItem>
                    <GridItem md={6}>
                      <h5>Amount Due:</h5>
                    </GridItem>
                    <GridItem md={6}>
                      <h5>
                        { total && total.toFixed(2) }
                        {' '}
                        $
                      </h5>
                    </GridItem>
                  </GridContainer>
                </FormControl>
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button disabled={loading} onClick={this.pay} color="primary">
              Pay
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openAuthDialog}
          // onClose={this.handleAuthClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="info">
                <div>Pass Code</div>
              </CardHeader>
              <CardBody>
                <TextField
                  name="authCode"
                  label="Auth Code"
                  type="password"
                  autoFocus
                  onChange={this.handleAuthCodeChange}
                  onKeyPress={this.handleAuthEnter}
                  value={authCode}
                />
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleAuthUpdate} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={showValidationDialog}
          aria-labelledby="form-dialog-title"
          maxWidth="xl"
        >
          <DialogContent>
            <Card>
              <CardHeader color="danger">
                <div>Insufficient Inventory!</div>
              </CardHeader>
              <CardBody>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Balance</TableCell>
                      <TableCell>Order Amount</TableCell>
                      <TableCell>Short</TableCell>
                      <TableCell>On Hold</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {validationResult.map(row => (
                      <TableRow key={row.productId}>
                        <TableCell>{row.productCode}</TableCell>
                        <TableCell>{row.productName}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                        <TableCell>{row.amountRequested}</TableCell>
                        <TableCell>{row.amountShort}</TableCell>
                        <TableCell>{row.onHold}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                { warnInSufficientStockOnOrder && !blockInSufficientStockOnOrder && (
                <h4>Are you sure you want to continue?</h4>
                )}
                {warnInSufficientStockOnOrder && blockInSufficientStockOnOrder && (
                  <h4>You cannot continue the sales because of insifficient inventory.</h4>
                )}
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            {warnInSufficientStockOnOrder && (
              <div>
                <Button onClick={this.continueOrder} color="danger">
                  Yes
                </Button>
                <Button onClick={this.cancelOrder} color="info">
                  No
                </Button>
              </div>
            )}
            {blockInSufficientStockOnOrder && (
              <Button onClick={this.cancelOrder} color="info">
                Ok
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Dialog
          open={openCustomerDialog}
          aria-labelledby="form-dialog-title"
          maxWidth="xl"
          onClose={this.handleCustomerDialogClose}
        >
          <DialogContent>
            <AddCustomer customerSaved={this.customerSaved} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCustomerDialogClose} color="info">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AddOrder.propTypes = {
  history: PropTypes.func.isRequired,
};
