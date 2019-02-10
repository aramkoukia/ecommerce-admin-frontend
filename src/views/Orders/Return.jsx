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

const styles = {
  chip: {
    margin: 5,
  },
};

function dateFormat(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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
      authCode: '',
      rows: [],
    };

    this.saveReturn = this.saveReturn.bind(this);
    this.priceChanged = this.priceChanged.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAuthUpdate = this.handleAuthUpdate.bind(this);
    this.handleAuthEnter = this.handleAuthEnter.bind(this);
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
      authCode: '',
    });
  }

  async handleAuthEnter(event) {
    if (event.key === 'Enter') {
      await this.handleAuthUpdate();
    }
  }

  async handleAuthUpdate() {
    const { authCode } = this.state;
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

    this.setState({
      openAuthDialog: false,
      userGivenName: result.givenName,
    });
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
      rows, total, subTotal, totalDiscount, notes, poNumber, order, authCode,
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

  async saveReturn() {
    const result = await this.saveOrder('Return');
    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
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
      order, openSnackbar, snackbarMessage, snackbarColor, loading, notes, openAuthDialog, authCode, userGivenName,
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
                        <Button color="primary" onClick={this.saveReturn}>
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
