import React from 'react';
import Check from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Chip from '@material-ui/core/Chip';
import Print from '@material-ui/icons/Print';
import Email from '@material-ui/icons/Email';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridContainer from '../../components/Grid/GridContainer';
import Button from '../../components/CustomButtons/Button';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import Snackbar from '../../components/Snackbar/Snackbar';
import GridItem from '../../components/Grid/GridItem';
import OrderNotes from './OrderNotes';
import OrderItems from './OrderItems';
import CustomerInfo from './CustomerInfo';
import OrderService from '../../services/OrderService';

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

export class Order extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: null,
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      loading: false,
      openDialog: false,
      openEmailDialog: false,
      customerEmail: '',
      chequeNo: '',
      payCreditDebit: true,
      creditDebitAmount: 0,
      cashAmount: 0,
      chequeAmount: 0,
      paypalAmazonUsdAmount: 0,
    };

    this.saveAsPaid = this.saveAsPaid.bind(this);
    this.saveAsHold = this.saveAsHold.bind(this);
    this.refundOrder = this.refundOrder.bind(this);
    this.emailOrder = this.emailOrder.bind(this);
    this.printOrder = this.printOrder.bind(this);
    this.packingOrder = this.packingOrder.bind(this);
    this.cancelHold = this.cancelHold.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEmailDialogClose = this.handleEmailDialogClose.bind(this);
    this.pay = this.pay.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleEmailOrderDialog = this.handleEmailOrderDialog.bind(this);
  }

  async componentDidMount() {
    const orderId = this.props.match.params.id;
    const order = await OrderService.getOrderDetail(orderId);
    this.setState({
      order,
      openDialog: false,
      openEmailDialog: false,
      customerEmail: order.customer.email,
      chequeNo: '',
    });
  }

  handleEmailOrderDialog() {
    this.setState({
      openEmailDialog: true,
    });
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  handleEmailDialogClose = () => {
    this.setState({
      openEmailDialog: false,
    });
  }

  getOrderPayments() {
    const {
      payCash, payCreditDebit, payCheque, payAmazonUsd,
      cashAmount, creditDebitAmount, chequeAmount, paypalAmazonUsdAmount,
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
    return orderPayments;
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCheckChange(event) {
    const {
      order, cashAmount, creditDebitAmount, chequeAmount, paypalAmazonUsdAmount,
    } = this.state;
    const paymentAmount = (Number(cashAmount) + Number(creditDebitAmount) + Number(chequeAmount) + Number(paypalAmazonUsdAmount)).toFixed(2);
    const remain = (order.total - paymentAmount).toFixed(2);
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
      }
    } else {
      if (event.target.name === 'payCash') {
        this.setState({ cashAmount: 0 });
      } else if (event.target.name === 'payCreditDebit') {
        this.setState({ creditDebitAmount: 0 });
      } else if (event.target.name === 'payCheque') {
        this.setState({ chequeAmount: 0 });
      } else if (event.target.name === 'payAmazonUsd') {
        this.setState({ paypalAmazonUsdAmount: 0 });
      }
    }
  }

  async updateOrderStatus(orderStatus) {
    this.setState({
      loading: true,
    });

    const { order } = this.state;
    let orderPayment = [];
    if (orderStatus === 'Paid') {
      orderPayment = this.getOrderPayments();
    }

    const result = await OrderService.updateOrderStatus(order.orderId, { orderStatus, orderPayment });
    if (result === false || result === null || result.StatusCode === 500 || result.StatusCode === 400) {
      this.setState({
        openSnackbar: true,
        loading: false,
        snackbarMessage: 'Oops, looks like something went wrong!',
        snackbarColor: 'danger',
      });
      return false;
    }

    this.setState({
      loading: false,
    });

    return result;
  }

  async refundOrder() {
    const { match, history } = this.props;
    const orderId = match.params.id;
    history.push(`/return/${orderId}`);
  }

  async emailOrder() {
    const { order, customerEmail } = this.state;
    this.setState({
      loading: true,
      openEmailDialog: false,
    });
    await OrderService.emailOrder(order.orderId, customerEmail);
    this.setState({
      loading: false,
    });
  }

  async printOrder() {
    const { order } = this.state;
    this.setState({
      loading: true,
    });
    await OrderService.printOrder(order.orderId);
    this.setState({
      loading: false,
    });
  }

  async packingOrder() {
    const { order } = this.state;
    this.setState({
      loading: true,
    });
    await OrderService.packingOrder(order.orderId);
    this.setState({
      loading: false,
    });
  }

  async saveAsPaid() {
    const { order } = this.state;
    this.setState({
      openDialog: true,
      creditDebitAmount: order.total.toFixed(2),
    });
  }

  async pay() {
    const {
      order, cashAmount, creditDebitAmount, chequeAmount, paypalAmazonUsdAmount,
    } = this.state;
    const paidAmount = Number(cashAmount) + Number(creditDebitAmount) + Number(chequeAmount) + Number(paypalAmazonUsdAmount);
    if ((Number(paidAmount)).toFixed(2) !== (Number(order.total)).toFixed(2)) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: `Total Paid Amount: ${paidAmount.toFixed(2)} $, must be the same as Order Total:${order.total.toFixed(2)} $`,
        snackbarColor: 'danger',
      });
      return;
    }

    const status = 'Paid';
    const result = await this.updateOrderStatus(status);
    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Order was marked as Paid successfully!',
        snackbarColor: 'success',
        openDialog: false,
      });

      window.location.reload();
    }
  }

  async saveAsHold() {
    const status = 'OnHold';
    const result = await this.updateOrderStatus(status);
    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Order was marked as On-Hold successfully!',
        snackbarColor: 'success',
      });
      const { order } = this.state;
      order.status = status;
      this.setState({
        order,
      });
    }
  }

  async cancelHold() {
    const status = 'Draft';
    const result = await this.updateOrderStatus(status);
    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Order was marked as Draft and not On-Hold any more!',
        snackbarColor: 'success',
      });
      const { order } = this.state;
      order.status = status;
      this.setState({
        order,
      });
    }
  }

  render() {
    const {
      order, openSnackbar, snackbarMessage, snackbarColor, loading,
      openDialog,
      openEmailDialog,
      customerEmail,
      chequeNo,
      payCash,
      payCheque,
      payCreditDebit,
      payAmazonUsd,
      cashAmount,
      chequeAmount,
      creditDebitAmount,
      paypalAmazonUsdAmount,
    } = this.state;

    return (
      <div>
        { order && (
        <div>
         <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div>
                  Order #
                  &nbsp;
                  <b>{order.orderId}</b>
                  &nbsp;&nbsp; {dateFormat(order.orderDate)}
                  &nbsp;&nbsp; <Chip label={order.status} color="primary" />
                </div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem>
                    <GridContainer>
                      <GridItem>
                        <Button color="warning" disabled={loading} onClick={this.handleEmailOrderDialog}>
                          <Email />
                          &nbsp;
                          Email
                        </Button>
                      </GridItem>
                      <GridItem>
                        <Button color="warning" disabled={loading} onClick={this.printOrder}>
                          <Print />
                          &nbsp;
                          Print
                        </Button>
                      </GridItem>

                      { (order.status === 'Account' || order.status === 'Paid')
                        && (
                        <GridItem>
                          <Button color="warning" disabled={loading} onClick={this.packingOrder}>
                            <Print />
                              &nbsp;
                              Packing Slip
                          </Button>
                        </GridItem>
                        )}

                      { order.status === 'Draft' || order.status === 'OnHold' || order.status === 'Account'
                        ? (
                          <GridItem xs>
                            <Button color="info" onClick={this.saveAsPaid}>Mark As Paid</Button>
                          </GridItem>
                        ) : <div />}

                      { order.status === 'Draft' && (
                      <GridItem xs>
                        <Button color="info" onClick={this.saveAsHold}>Put On Hold</Button>
                      </GridItem>
                      )}

                      { order.status === 'Paid' && (
                      <GridItem xs>
                        <Button color="info" onClick={this.refundOrder}>Return</Button>
                      </GridItem>
                      )}

                      { order.status === 'OnHold' && (
                      <GridItem xs>
                        <Button color="info" onClick={this.cancelHold}>Cancel On Hold</Button>
                      </GridItem>
                      )}
                      <GridItem xs>
                        { loading && <CircularProgress /> }
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <OrderItems order={order} />
                  </GridItem>
                  <GridItem xs={8}>
                    <CustomerInfo customer={order.customer} />
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
                            label="Paypal and Amazon + USD"
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                          <TextField
                            disabled={!payAmazonUsd}
                            name="paypalAmazonUsdAmount"
                            label="Paypal/Amazon/USD"
                            type="text"
                            onChange={this.handleChange}
                            value={paypalAmazonUsdAmount}
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
                            {(Number(cashAmount) + Number(creditDebitAmount) + Number(chequeAmount) + Number(paypalAmazonUsdAmount)).toFixed(2)} $
                      </h5>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                          <h5>Amount Due:</h5>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                          <h5>
                            {order.total && order.total.toFixed(2)} $
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
          open={openEmailDialog}
          onClose={this.handleEmailDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="info">
                <div>Invoice Email</div>
              </CardHeader>
              <CardBody>
                <FormControl component="fieldset">
                  <TextField
                    required
                    name="customerEmail"
                    label="Customer Email"
                    type="text"
                    onChange={this.handleChange}
                    fullWidth
                    value={customerEmail}
                  />
                </FormControl>
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleEmailDialogClose} color="info">
              Cancel
            </Button>
            <Button onClick={this.emailOrder} color="primary">
              Send
            </Button>
          </DialogActions>
        </Dialog>
       </div>
        ) }
      </div>
    );
  }
}

Order.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Order);
