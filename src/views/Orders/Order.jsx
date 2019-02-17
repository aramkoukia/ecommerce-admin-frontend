import React from 'react';
import Check from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Print from '@material-ui/icons/Print';
import Email from '@material-ui/icons/Email';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomInput from '../../components/CustomInput/CustomInput';
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
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export class Order extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: null,
      notes: '',
      poNumber: '',
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      loading: false,
      openDialog: false,
      openEmailDialog: false,
      paymentTypeId: '23',
      customerEmail: '',
      chequeNo: '',
    };

    this.saveAsPaid = this.saveAsPaid.bind(this);
    this.saveAsHold = this.saveAsHold.bind(this);
    this.refundOrder = this.refundOrder.bind(this);
    this.emailOrder = this.emailOrder.bind(this);
    this.printOrder = this.printOrder.bind(this);
    this.cancelHold = this.cancelHold.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEmailDialogClose = this.handleEmailDialogClose.bind(this);
    this.pay = this.pay.bind(this);
    this.handlePaymentTypeChange = this.handlePaymentTypeChange.bind(this);
    this.handleEmailOrderDialog = this.handleEmailOrderDialog.bind(this);
  }

  async componentDidMount() {
    const orderId = this.props.match.params.id;
    const order = await OrderService.getOrderDetail(orderId);
    this.setState({
      order,
      openDialog: false,
      openEmailDialog: false,
      paymentTypeId: '23',
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

  handlePaymentTypeChange = (event) => {
    this.setState({
      paymentTypeId: event.target.value,
      chequeNo: '',
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async updateOrderStatus(orderStatus) {
    const { order, paymentTypeId, chequeNo } = this.state;
    const result = await OrderService.updateOrderStatus(order.orderId, { orderStatus, paymentTypeId, chequeNo });
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

  async saveAsPaid() {
    this.setState({
      openDialog: true,
    });
  }

  async pay() {
    const status = 'Paid';
    const result = await this.updateOrderStatus(status);
    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Order was marked as Paid successfully!',
        snackbarColor: 'success',
        openDialog: false,
      });

      const { order } = this.state;
      order.status = status;
      this.setState({
        order,
      });
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
      order, openSnackbar, snackbarMessage, snackbarColor, loading, openDialog,
      paymentTypeId,
      openEmailDialog, customerEmail,
      chequeNo,
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
                        <Button color="warning" onClick={this.handleEmailOrderDialog}>
                          <Email />
                          &nbsp;
                          Email
                        </Button>
                      </GridItem>
                      <GridItem>
                        <Button color="warning" onClick={this.printOrder}>
                          <Print />
                          &nbsp;
                          Print
                        </Button>
                      </GridItem>

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
                  <RadioGroup
                    aria-label="Payment Type"
                    name="paymentType"
                    value={paymentTypeId}
                    onChange={this.handlePaymentTypeChange}
                  >
                    <FormControlLabel value="22" control={<Radio />} label="Cash" />
                    <FormControlLabel value="23" control={<Radio />} label="Credit Card / Debit" />
                    <FormControlLabel value="24" control={<Radio />} label="Cheque" />
                    { paymentTypeId === '24' && (
                      <CustomInput
                        labelText="Cheque Number"
                        formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: chequeNo,
                              name: 'chequeNo',
                              onChange: this.handleChange,
                            }}
                          />)}

                    <FormControlLabel value="25" control={<Radio />} label="Paypal and Amazon + USD Account" />
                  </RadioGroup>
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
