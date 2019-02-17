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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';
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
import AuthStore from '../../stores/Auth';

const styles = {
  chip: {
    margin: 5,
  },
};

function dateFormat(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export class Return extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: null,
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      loading: false,
      openAuthDialog: true,
      openDialog: false,
      authCode: '',
      paymentTypeId: '23',
      rows: [],
    };

    this.saveReturn = this.saveReturn.bind(this);
    this.priceChanged = this.priceChanged.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAuthUpdate = this.handleAuthUpdate.bind(this);
    this.handleAuthEnter = this.handleAuthEnter.bind(this);
    this.selectPaymentToReturn = this.selectPaymentToReturn.bind(this);
    this.handlePaymentTypeChange = this.handlePaymentTypeChange.bind(this);
  }

  async componentDidMount() {
    const orderId = this.props.match.params.id;
    const order = await OrderService.getOrderDetail(orderId);
    for (const i in order.orderDetail) {
      order.orderDetail[i].total = order.orderDetail[i].total * -1
    }

    this.setState({
      order,
      rows: order.orderDetail,
      openAuthDialog: true,
      openDialog: false,
      authCode: '',
    });
  }

  handlePaymentTypeChange = (event) => {
    this.setState({ paymentTypeId: event.target.value });
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

  async handleAuthUpdate() {
    const { authCode } = this.state;
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

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async saveOrderReturn() {
    const { order } = this.state;
    const result = await OrderService.returnOrder(order);
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

  async saveOrder(orderStatus) {
    const {
      rows, total, subTotal, totalDiscount, notes, poNumber, order, authCode, paymentTypeId,
    } = this.state;
    const originalOrderId = this.props.match.params.id;
    const status = orderStatus;
    const orderDetails = rows.map(row => (
      {
        orderId: 0,
        orderDetailId: 0,
        productId: row.productId,
        amount: row.amount,
        unitPrice: row.unitPrice,
        discountPercent: row.discountPercent,
        discountAmount: row.discountAmount,
        discountType: row.discountType,
        total: row.total - (row.discountType === 'percent' ? (row.discountPercent / 100) * row.total : row.discountAmount),
        totalDiscount: (row.discountType === 'percent' ? (row.discountPercent / 100) * row.total : row.discountAmount),
        subTotal: row.total,
      }));

    const orderTaxes = order.orderTax.map(tax => (
      {
        taxId: tax.taxId,
        taxAmount: (tax.tax.percentage / 100) * subTotal,
      }));

    const returnOrder = {
      locationId: Location.getStoreLocation(),
      subTotal,
      total,
      totalDiscount,
      customerId: order.customer !== null ? order.customer.customerId : null,
      status,
      notes,
      poNumber,
      pstNumber: order.customer !== null ? order.customer.pstNumber : null,
      orderTax: orderTaxes,
      orderDetail: orderDetails,
      originalOrderId,
      authCode,
      paymentTypeId: Number(paymentTypeId),
    };

    const result = await OrderService.saveOrder(returnOrder);
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

  async selectPaymentToReturn() {
    this.setState({
      openDialog: true,
    });
  }

  async saveReturn() {
    const result = await this.saveOrder('Return');
    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        openDialog: false,
        snackbarMessage: 'Order was returned successfully!',
        snackbarColor: 'success',
      });
      this.props.history.push(`/order/${result.orderId}`);
    }
  }

  priceChanged(rows, subTotal, total, totalDiscount) {
    this.setState({
      subTotal,
      total,
      totalDiscount,
      rows,
    });
  }

  render() {
    const {
      order, openSnackbar, snackbarMessage, snackbarColor, loading, notes, openAuthDialog, authCode, userGivenName, openDialog, paymentTypeId
    } = this.state;

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
                  &nbsp;&nbsp; {dateFormat(order.orderDate)}
                  &nbsp;&nbsp; <Chip label={order.status} color="primary" />
                   - User:
                  { authCode } - { userGivenName }
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
                          Save
                        </Button>
                      </GridItem>
                      <GridItem xs>
                        { loading && <CircularProgress /> }
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    { order && (
                      <ReturnOrderItems
                        rows={order.orderDetail}
                        taxes={order.orderTax}
                        discountAmount={order.discountAmount}
                        discountPercent={order.discountPercent}
                        priceChanged={this.priceChanged}
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
            <Button onClick={this.saveReturn} color="primary">
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
                  type="text"
                  autoFocus={true}
                  onChange={this.handleChange}
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

Return.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Return);
