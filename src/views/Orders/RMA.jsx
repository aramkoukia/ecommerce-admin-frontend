/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
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

export class RMA extends React.Component {
  state = {
    order: null,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    loading: false,
    openAuthDialog: true,
    authCode: '',
    rows: [],
    restockingFeePercent: 10,
    restockingFeeAmount: 0,
    idempotency: uuidv4(),
  };

  constructor(props) {
    super(props);
    this.saveRMA = this.saveRMA.bind(this);
    this.priceChanged = this.priceChanged.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAuthUpdate = this.handleAuthUpdate.bind(this);
    this.handleAuthEnter = this.handleAuthEnter.bind(this);
    this.handleAuthCodeChange = this.handleAuthCodeChange.bind(this);
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
      authCode: '',
      countryInfo,
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

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleAuthCodeChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.value.length === 6) {
      this.handleAuthUpdate(event.target.value);
    }
  }

  async saveOrder(orderStatus) {
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

  async saveRMA() {
    const result = await this.saveOrder('RMA', false);
    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'RMA was saved successfully!',
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
      countryInfo,
    } = this.state;

    return (
      <div>
        { order && (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div>
                  <b>Creating RMA (Return Merchandise Authorization)</b>
                  &nbsp;
                  Invoice #
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
                        <Button color="primary" onClick={() => this.saveRMA()}>
                          <Save />
                          &nbsp;
                          Create RMA
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
                        order={order}
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

export default withStyles(styles)(RMA);
