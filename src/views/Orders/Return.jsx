import React from 'react';
import Check from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Save from '@material-ui/icons/Save';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import { v4 as uuidv4 } from 'uuid';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Button from '../../components/CustomButtons/Button';
import Card from '../../components/Card/Card';
import CustomInput from '../../components/CustomInput/CustomInput';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import Snackbar from '../../components/Snackbar/Snackbar';
import OrderNotes from './OrderNotes';
import ReturnOrderItems from './ReturnOrderItems';
import CustomerInfo from './CustomerInfo';
import OrderService from '../../services/OrderService';
import Location from '../../stores/Location';
import UserService from '../../services/UserService';
import SettingsService from '../../services/SettingsService';
import AuthStore from '../../stores/Auth';

const styles = {
  chip: {
    margin: 5,
  },
};

function dateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const stringDate = [day, month, year].join('/');
  return `${stringDate} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export class Return extends React.Component {
  state = {
    order: null,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    loading: false,
    openAuthDialog: true,
    openDialog: false,
    authCode: '',
    rows: [],
    payCreditDebit: true,
    chequeNo: '',
    creditDebitAmount: 0,
    cashAmount: 0,
    chequeAmount: 0,
    storeCreditAmount: 0,
    paypalAmazonUsdAmount: 0,
    restockingFeePercent: 10,
    restockingFeeAmount: 0,
    idempotency: uuidv4(),
    defaultTax: 13.5,
    defaultTaxName: 'Sales Tax',
    noTaxForLocation: false,
  };

  constructor(props) {
    super(props);
    this.pay = this.pay.bind(this);
    this.priceChanged = this.priceChanged.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAuthUpdate = this.handleAuthUpdate.bind(this);
    this.handleAuthEnter = this.handleAuthEnter.bind(this);
    this.selectPaymentToReturn = this.selectPaymentToReturn.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleAuthCodeChange = this.handleAuthCodeChange.bind(this);
    this.returnToCustomerAccount = this.returnToCustomerAccount.bind(this);
    this.taxPercentChanged = this.taxPercentChanged.bind(this);
    this.taxNameChanged = this.taxNameChanged.bind(this);
  }

  async componentDidMount() {
    const orderId = this.props.match.params.id || this.props.location.state.orderId;
    const order = await OrderService.getOrderDetail(orderId);
    for (const i in order.orderDetail) {
      order.orderDetail[i].total = order.orderDetail[i].total * -1;
    }

    const { posDefaultTaxCountry, posDefaultTaxProvince } = await SettingsService.getSettings();
    const countryInfo = SettingsService.getCountryInfo(posDefaultTaxCountry, posDefaultTaxProvince);

    this.setState({
      order,
      rows: order.orderDetail,
      openAuthDialog: true,
      openDialog: false,
      authCode: '',
      countryInfo,
    });
  }

  taxNameChanged(taxName) {
  }

  taxPercentChanged(taxPercent) {
  }

  getOrderPayments() {
    const {
      payCash, payCreditDebit, payCheque, payAmazonUsd, payStoreCredit,
      cashAmount, creditDebitAmount, chequeAmount, paypalAmazonUsdAmount,
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

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
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
    permissionsChanged();
  }

  handleCheckChange(event) {
    const {
      total, cashAmount, creditDebitAmount, chequeAmount, paypalAmazonUsdAmount,
      storeCreditAmount,
    } = this.state;
    const paymentAmount = (Number(cashAmount)
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

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleAuthCodeChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.value.length === 6) {
      this.handleAuthUpdate(event.target.value);
    }
  }

  async saveOrder(orderStatus, useCustomerAccount) {
    const {
      rows,
      total, subTotal, totalDiscount, notes, order, authCode,
      restockingFeePercent,
      restockingFeeAmount,
      idempotency,
    } = this.state;
    const originalOrderId = this.props.match.params.id;
    const status = orderStatus;
    const orderDetails = rows
      .filter((row) => Number(row.amount) !== 0)
      .map((row) => (
        {
          orderId: 0,
          orderDetailId: 0,
          productId: row.productId,
          amount: row.amount,
          unitPrice: row.unitPrice,
          discountPercent: row.discountPercent,
          discountAmount: row.discountAmount,
          discountType: row.discountType,
          total: row.total,
          totalDiscount: -1 * Math.abs(row.totalDiscount),
          package: row.package,
          amountInMainPackage: row.amountInMainPackage,
          subTotal: row.total - Math.abs(row.totalDiscount),
        }));

    const orderTaxes = order.orderTax.map((tax) => (
      {
        taxId: tax.taxId,
        taxAmount: (tax.tax.percentage / 100) * subTotal,
      }));

    let orderPayment = [];
    if (orderStatus === 'Return' && !useCustomerAccount) {
      orderPayment = this.getOrderPayments();
    }

    const returnOrder = {
      locationId: Location.getStoreLocation(),
      subTotal,
      total,
      totalDiscount,
      customerId: order.customer !== null ? order.customer.customerId : null,
      status,
      notes,
      poNumber: order.poNumber,
      pstNumber: order.customer !== null ? order.customer.pstNumber : null,
      orderTax: orderTaxes,
      orderDetail: orderDetails,
      originalOrderId,
      authCode,
      orderPayment,
      restockingFeePercent,
      restockingFeeAmount,
    };

    const result = await OrderService.saveOrder(returnOrder, idempotency);
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

  async selectPaymentToReturn() {
    const { total } = this.state;
    this.setState({
      openDialog: true,
      creditDebitAmount: total.toFixed(2),
    });
  }

  async pay() {
    const {
      total, cashAmount, creditDebitAmount, chequeAmount, paypalAmazonUsdAmount,
      storeCreditAmount, payStoreCredit, order,
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

    if (payStoreCredit && storeCreditAmount > order.customer.storeCredit) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: `Customer Store Credit ${order.customer.storeCredit}, is less than Store Credit Specified : ${storeCreditAmount}!`,
        snackbarColor: 'danger',
      });
      return;
    }

    const result = await this.saveOrder('Return', false);
    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        openDialog: false,
        snackbarMessage: 'Order was returned successfully!',
        snackbarColor: 'success',
      });
      this.props.history.push({
        pathname: `/order/${result.orderId}`,
        state: { orderId: result.orderId },
      });
    }
  }

  async returnToCustomerAccount() {
    const result = await this.saveOrder('Return', true);
    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        openDialog: false,
        snackbarMessage: 'Order was returned successfully!',
        snackbarColor: 'success',
      });
      this.props.history.push({
        pathname: `/order/${result.orderId}`,
        state: { orderId: result.orderId },
      });
    }
  }

  priceChanged(
    rows,
    subTotal,
    total,
    totalDiscount,
    restockingFeePercent,
    restockingFeeAmount,
  ) {
    this.setState({
      subTotal,
      total,
      totalDiscount,
      rows,
      restockingFeePercent,
      restockingFeeAmount,
    });
  }

  render() {
    const {
      order,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      loading,
      notes,
      openAuthDialog,
      authCode,
      userGivenName,
      openDialog,
      chequeNo,
      total,
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
      countryInfo,
    } = this.state;

    const taxes = order && order.orderTax && order.orderTax.map(tax => tax.tax);
    return (
      <div>
        { order && (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div>
                  <b>Returning</b>
                  &nbsp;
                  Order #
                  &nbsp;
                  <b>{order.orderId}</b>
                  &nbsp;&nbsp;
                  {' '}
                  {dateFormat(order.orderDate)}
                  &nbsp;&nbsp;
                  {' '}
                  <Chip label={order.status} color="primary" />
                  - User:
                  {userGivenName}
                </div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem>
                    <GridContainer>
                      <GridItem>
                        <Button color="primary" onClick={this.selectPaymentToReturn}>
                          <Save />
                          &nbsp;
                          Pay
                        </Button>
                      </GridItem>
                      {order.customer && order.customer.creditLimit > 0 && (
                      <GridItem>
                        <Button color="primary" onClick={this.returnToCustomerAccount}>
                          <Save />
                          &nbsp;
                          Return To Customer Account
                        </Button>
                      </GridItem>
                      )}
                      <GridItem xs>
                        { loading && <CircularProgress /> }
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    { order && (
                      <ReturnOrderItems
                        order={order}
                        rows={order.orderDetail}
                        taxes={taxes}
                        discountAmount={order.discountAmount}
                        discountPercent={order.discountPercent}
                        priceChanged={this.priceChanged}
                        taxPercentChanged={this.taxPercentChanged}
                        taxNameChanged={this.taxNameChanged}
                        noTaxForLocation={false}
                      />
                    )}
                  </GridItem>
                  <GridItem xs={12}>
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
                  <GridItem xs={8}>
                      <CustomerInfo customer={order.customer} countryInfo={countryInfo} />
                  </GridItem>
                  <GridItem xs={4}>
                    <OrderNotes order={order} />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter />
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
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
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
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          disabled={!payCash}
                          name="cashAmount"
                          label="Cash Amount"
                          type="text"
                          onChange={this.handleChange}
                          value={cashAmount}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
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
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          disabled={!payCreditDebit}
                          name="creditDebitAmount"
                          label="Credit/Debit Amount"
                          type="text"
                          onChange={this.handleChange}
                          value={creditDebitAmount}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
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
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          disabled={!payCheque}
                          name="chequeAmount"
                          label="Cheque Amount"
                          type="text"
                          onChange={this.handleChange}
                          value={chequeAmount}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <FormControlLabel
                          control={(
                            <Checkbox
                              checked={payAmazonUsd}
                              onChange={this.handleCheckChange}
                              value="payAmazonUsd"
                              name="payAmazonUsd"
                            />
                            )}
                          label="Online / Direct Deposit"
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          disabled={!payAmazonUsd}
                          name="paypalAmazonUsdAmount"
                          label="Online/DirectDeposit"
                          type="text"
                          onChange={this.handleChange}
                          value={paypalAmazonUsdAmount}
                        />
                      </GridItem>
                      <GridItem md={6}>
                        <FormControlLabel
                          control={(
                            <Checkbox
                              disabled={!order.customer}
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

                      <GridItem xs={12} sm={12} md={12}>
                        <br />
                        <hr />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <h5>Total Payment:</h5>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
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
                      <GridItem xs={12} sm={12} md={6}>
                        <h5>Amount Due:</h5>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <h5>
                          {total && total.toFixed(2)}
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
              <Button onClick={this.pay} color="primary">
                Pay
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openAuthDialog}
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

        </GridContainer>
        ) }
      </div>
    );
  }
}

export default withStyles(styles)(Return);
