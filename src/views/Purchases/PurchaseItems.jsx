import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Check from '@material-ui/icons/Check';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Snackbar from '../../components/Snackbar/Snackbar';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Success from '../../components/Typography/Success';
import Button from '../../components/CustomButtons/Button';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import PurchaseService from '../../services/PurchaseService';
import LocationService from '../../services/LocationService';

function ccyFormat(num) {
  return num && !isNaN(num) ? `${num.toFixed(2)} $` : '';
}

function dateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getUTCDate()}`.padStart(2, 0);
  const stringDate = [year, month, day].join('-');
  return stringDate;
}

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

export default class PurchaseItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openMarkAsPaidDialog: false,
      openMarkAsOnDeliveryDialog: false,
      openMarkAsCustomClearanceDialog: false,
      openMarkAsArrivedDialog: false,
      loading: false,
      locations: [],
    };

    this.markAsPaidClicked = this.markAsPaidClicked.bind(this);
    this.markAsOnDeliveryClicked = this.markAsOnDeliveryClicked.bind(this);
    this.markAsCustomClearanceClicked = this.markAsCustomClearanceClicked.bind(this);
    this.markAsArrivedClicked = this.markAsArrivedClicked.bind(this);
    this.markAsPaid = this.markAsPaid.bind(this);
    this.markAsOnDelivery = this.markAsOnDelivery.bind(this);
    this.markAsCustomClearance = this.markAsCustomClearance.bind(this);
    this.markAsArrived = this.markAsArrived.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  async componentDidMount() {
    // this.setState({
    //   openMarkAsPaidDialog: false,
    //   openMarkAsOnDeliveryDialog: false,
    //   openMarkAsCustomClearanceDialog: false,
    //   openMarkAsArrivedDialog: false,
    //   loading: false,
    //   purchase,
    // });
  }


  handleLocationChange = (event) => {
    this.setState({ locationId: event.target.value });
  }

  handleClose() {
    this.setState({
      openMarkAsPaidDialog: false,
      openMarkAsOnDeliveryDialog: false,
      openMarkAsCustomClearanceDialog: false,
      openMarkAsArrivedDialog: false,
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  markAsPaidClicked(amount, unitPrice, poNumber, purchaseDetailId) {
    const { purchase } = this.props;
    this.setState({
      openMarkAsPaidDialog: true,
      amount,
      unitPrice,
      poNumber,
      paidDate: dateFormat((new Date()).addHours(-8)),
      estimatedDelivery: dateFormat(purchase.deliveryDate),
      purchaseDetailId,
    });
  }

  async markAsPaid() {
    this.setState({
      loading: true,
    });

    const result = await this.updatePurchaseDetailStatus('Paid');

    this.setState({
      openMarkAsPaidDialog: false,
      loading: false,
    });
    window.location.reload();
  }

  markAsOnDeliveryClicked(amount, unitPrice, poNumber, purchaseDetailId, paidDate) {
    const { purchase } = this.props;
    this.setState({
      openMarkAsOnDeliveryDialog: true,
      amount,
      unitPrice,
      poNumber,
      paidDate: dateFormat(paidDate),
      estimatedDelivery: dateFormat(purchase.deliveryDate),
      purchaseDetailId,
    });
  }

  async markAsOnDelivery() {
    this.setState({
      loading: true,
    });

    const result = await this.updatePurchaseDetailStatus('OnDelivery');

    this.setState({
      openMarkAsOnDeliveryDialog: false,
      loading: false,
    });
    window.location.reload();
  }

  markAsCustomClearanceClicked(amount, unitPrice, poNumber, purchaseDetailId) {
    const { purchase } = this.props;
    this.setState({
      openMarkAsCustomClearanceDialog: true,
      amount,
      unitPrice,
      poNumber,
      paidDate: dateFormat((new Date()).addHours(-8)),
      estimatedDelivery: dateFormat(purchase.deliveryDate),
      purchaseDetailId,
    });
  }

  async markAsCustomClearance() {
    this.setState({
      loading: true,
    });

    const result = await this.updatePurchaseDetailStatus('CustomClearance');

    this.setState({
      openMarkAsCustomClearanceDialog: false,
      loading: false,
    });
    window.location.reload();
  }

  markAsArrivedClicked(amount, unitPrice, poNumber, purchaseDetailId) {
    const { purchase } = this.props;
    const { locations } = this.state;

    LocationService.getLocationsForUser()
      .then(results => this.setState({
        locations: [...locations, ...results],
        openMarkAsArrivedDialog: true,
        amount,
        unitPrice,
        poNumber,
        arrivedDate: dateFormat((new Date()).addHours(-8)),
        estimatedDelivery: dateFormat(purchase.deliveryDate),
        purchaseDetailId,
      }));
  }

  async markAsArrived() {
    this.setState({
      loading: true,
    });

    const { locationId } = this.state;
    if (locationId && locationId > 0) {
      const result = await this.updatePurchaseDetailStatus('Arrived');

      this.setState({
        openMarkAsArrivedDialog: false,
        loading: false,
      });

      window.location.reload();
    } else {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Please select a location!',
        snackbarColor: 'danger',
      });
    }

    this.setState({
      loading: false,
    });
  }

  async updatePurchaseDetailStatus(status) {
    const {
      purchaseDetailId,
      amount,
      unitPrice,
      paidDate,
      arrivedDate,
      estimatedDelivery,
      poNumber,
      locationId,
    } = this.state;

    const purchaseDetailStatusUpdate = {
      amount,
      unitPrice,
      paidDate,
      arrivedDate,
      estimatedDelivery,
      poNumber,
      purchaseStatus: status,
      totalPrice: (unitPrice * amount).toFixed(2),
      arrivedAtLocationId: locationId,
    };

    const result = await PurchaseService.updatePurchaseDetailStatus(purchaseDetailId, purchaseDetailStatusUpdate);
    if (result === false
        || result === null
        || result.StatusCode === 500
        || result.StatusCode === 400) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Oops, looks like something went wrong!',
        snackbarColor: 'danger',
      });
    }

    return true;
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

    const {
      openMarkAsArrivedDialog,
      openMarkAsCustomClearanceDialog,
      openMarkAsPaidDialog,
      openMarkAsOnDeliveryDialog,
      loading,
      poNumber,
      amount,
      unitPrice,
      estimatedDelivery,
      paidDate,
      arrivedDate,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      locations,
      locationId,
    } = this.state;

    const { purchase } = this.props;

    return (
      <div>
        <Card>
          <CardHeader color="info">
            <div className={styles.cardTitleWhite}>Planned Items</div>
          </CardHeader>
          <CardBody>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell numeric>Amount</TableCell>
                  <TableCell numeric>Unit Price</TableCell>
                  <TableCell numeric>Overhead Cost</TableCell>
                  <TableCell numeric>Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchase.purchaseDetail.map(row => row.status === 'Plan' && (
                  <TableRow key={row.purchaseDetailId}>
                    <TableCell>
                      <Button color="primary" onClick={() => this.markAsPaidClicked(row.amount, row.unitPrice, purchase.poNumber, row.purchaseDetailId)}>Paid</Button>
                      &nbsp;
                      &nbsp;
                      {row.product.productCode}
                      &nbsp;
                      &nbsp;
                      {row.product.productName}
                    </TableCell>
                    <TableCell numeric align="right">{row.amount}</TableCell>
                    <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                    <TableCell numeric>{ccyFormat(row.overheadCost)}</TableCell>
                    <TableCell numeric>{ccyFormat(row.totalPrice)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4}><h5>Total</h5></TableCell>
                  <TableCell numeric><Success><h5>{ccyFormat(purchase.purchaseDetail.map(item => item.status === 'Plan' && item.totalPrice).reduce((prev, next) => prev + next))}</h5></Success></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader color="info">
            <div className={styles.cardTitleWhite}>Paid Items</div>
          </CardHeader>
          <CardBody>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell numeric>Amount</TableCell>
                  <TableCell numeric>Unit Price</TableCell>
                  <TableCell numeric>Total Price</TableCell>
                  <TableCell>PO Number</TableCell>
                  <TableCell>Paid Date</TableCell>
                  <TableCell>Estimated Delivery</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchase.purchaseDetail.map(row => row.status === 'Paid' && (
                  <TableRow key={row.purchaseDetailId}>
                    <TableCell>
                      <Button color="primary" onClick={() => this.markAsOnDeliveryClicked(row.amount, row.unitPrice, purchase.poNumber, row.purchaseDetailId, row.paidDate)}>On Delivery</Button>
                      &nbsp;
                      &nbsp;
                      {row.product.productCode}
                      &nbsp;
                      &nbsp;
                      {row.product.productName}
                    </TableCell>
                    <TableCell numeric align="right">{row.amount}</TableCell>
                    <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                    <TableCell numeric>{ccyFormat(row.totalPrice)}</TableCell>
                    <TableCell>{row.poNumber}</TableCell>
                    <TableCell>{dateFormat(row.paidDate)}</TableCell>
                    <TableCell>{dateFormat(row.estimatedDelivery)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={6}><h5>Total</h5></TableCell>
                  <TableCell numeric><Success><h5>{ccyFormat(purchase.purchaseDetail.map(item => item.status === 'Paid' && item.totalPrice).reduce((prev, next) => prev + next))}</h5></Success></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader color="danger">
            <div className={styles.cardTitleWhite}>On Delivery Items</div>
          </CardHeader>
          <CardBody>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell numeric>Amount</TableCell>
                  <TableCell numeric>Unit Price</TableCell>
                  <TableCell numeric>Total Price</TableCell>
                  <TableCell>Estimated Delivery</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchase.purchaseDetail.map(row => row.status === 'OnDelivery' && (
                  <TableRow key={row.purchaseDetailId}>
                    <TableCell>
                      <Button color="primary" onClick={() => this.markAsCustomClearanceClicked(row.amount, row.unitPrice, purchase.poNumber, row.purchaseDetailId)}>Custom Clearance</Button>
                      &nbsp;
                      &nbsp;
                      {row.product.productCode}
                      &nbsp;
                      &nbsp;
                      {row.product.productName}
                    </TableCell>
                    <TableCell numeric align="right">{row.amount}</TableCell>
                    <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                    <TableCell numeric>{ccyFormat(row.totalPrice)}</TableCell>
                    <TableCell>{dateFormat(row.estimatedDelivery)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4}><h3>Total</h3></TableCell>
                  <TableCell numeric><Success><h3>{ccyFormat(purchase.purchaseDetail.map(item => item.status === 'OnDelivery' && item.totalPrice).reduce((prev, next) => prev + next))}</h3></Success></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader color="warning">
            <div className={styles.cardTitleWhite}>Custom Clearance Items</div>
          </CardHeader>
          <CardBody>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell numeric>Amount</TableCell>
                  <TableCell numeric>Unit Price</TableCell>
                  <TableCell numeric>Total Price</TableCell>
                  <TableCell>Estimated Delivery</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchase.purchaseDetail.map(row => row.status === 'CustomClearance' && (
                  <TableRow key={row.purchaseDetailId}>
                    <TableCell>
                      <Button color="primary" onClick={() => this.markAsArrivedClicked(row.amount, row.unitPrice, purchase.poNumber, row.purchaseDetailId)}>Arrived</Button>
                      &nbsp;
                      &nbsp;
                      {row.product.productCode}
                      &nbsp;
                      &nbsp;
                      {row.product.productName}
                    </TableCell>
                    <TableCell numeric align="right">{row.amount}</TableCell>
                    <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                    <TableCell numeric>{ccyFormat(row.totalPrice)}</TableCell>
                    <TableCell>{dateFormat(row.estimatedDelivery)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4}><h3>Total</h3></TableCell>
                  <TableCell numeric><Success><h3>{ccyFormat(purchase.purchaseDetail.map(item => item.status === 'CustomClearance' && item.totalPrice).reduce((prev, next) => prev + next))}</h3></Success></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader color="success">
            <div className={styles.cardTitleWhite}>Arrived Items</div>
          </CardHeader>
          <CardBody>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell numeric>Amount</TableCell>
                  <TableCell numeric>Unit Price</TableCell>
                  <TableCell numeric>Total Price</TableCell>
                  <TableCell>Arrived Date</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchase.purchaseDetail.map(row => row.status === 'Arrived' && (
                  <TableRow key={row.purchaseDetailId}>
                    <TableCell>{row.product.productName}</TableCell>
                    <TableCell numeric align="right">{row.amount}</TableCell>
                    <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                    <TableCell numeric>{ccyFormat(row.totalPrice)}</TableCell>
                    <TableCell>{dateFormat(row.arrivedDate)}</TableCell>
                    <TableCell>{row.location.locationName}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5}><h3>Total</h3></TableCell>
                  <TableCell numeric><Success><h3>{ccyFormat(purchase.purchaseDetail.map(item => item.status === 'Arrived' && item.totalPrice).reduce((prev, next) => prev + next))}</h3></Success></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
        <Dialog
          open={openMarkAsPaidDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="info">
                <div>Mark As Paid</div>
              </CardHeader>
              <CardBody>
                <FormControl component="fieldset">
                  <GridContainer md={12}>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        name="amount"
                        label="Amount"
                        type="number"
                        value={amount}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        name="unitPrice"
                        label="Unit Price ($)"
                        type="number"
                        value={unitPrice}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <h4>
                        Total:
                        {unitPrice * amount}
                      </h4>
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        name="estimatedDelivery"
                        label="Estimated Delivery"
                        type="date"
                        value={estimatedDelivery}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        name="paidDate"
                        label="Paid Date"
                        type="date"
                        value={paidDate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        name="poNumber"
                        label="PO Number"
                        type="text"
                        value={poNumber}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
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
            <Button disabled={loading} onClick={this.markAsPaid} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openMarkAsOnDeliveryDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="info">
                <div>Mark As On Delivery</div>
              </CardHeader>
              <CardBody>
                <FormControl component="fieldset">
                  <GridContainer md={12}>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        name="amount"
                        label="Amount"
                        type="number"
                        value={amount}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        disabled
                        name="unitPrice"
                        label="Unit Price ($)"
                        type="number"
                        value={unitPrice}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <h4>
                        Total:
                        {unitPrice * amount}
                      </h4>
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        name="estimatedDelivery"
                        label="Estimated Delivery"
                        type="date"
                        value={estimatedDelivery}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        disabled
                        onChange={this.handleChange}
                        name="paidDate"
                        label="Paid Date"
                        type="date"
                        value={paidDate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        disabled
                        onChange={this.handleChange}
                        name="poNumber"
                        label="PO Number"
                        type="text"
                        value={poNumber}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
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
            <Button disabled={loading} onClick={this.markAsOnDelivery} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openMarkAsCustomClearanceDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="info">
                <div>Mark As Custom Clearance</div>
              </CardHeader>
              <CardBody>
                <FormControl component="fieldset">
                  <GridContainer md={12}>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        name="amount"
                        label="Amount"
                        type="number"
                        value={amount}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        disabled
                        name="unitPrice"
                        label="Unit Price ($)"
                        type="number"
                        value={unitPrice}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <h4>
                        Total:
                        {unitPrice * amount}
                      </h4>
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        name="estimatedDelivery"
                        label="Estimated Delivery"
                        type="date"
                        value={estimatedDelivery}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        disabled
                        onChange={this.handleChange}
                        name="paidDate"
                        label="Paid Date"
                        type="date"
                        value={paidDate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        disabled
                        onChange={this.handleChange}
                        name="poNumber"
                        label="PO Number"
                        type="text"
                        value={poNumber}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
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
            <Button disabled={loading} onClick={this.markAsCustomClearance} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openMarkAsArrivedDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="info">
                <div>Mark As Arrived</div>
              </CardHeader>
              <CardBody>
                <FormControl component="fieldset">
                  <GridContainer md={12}>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        name="amount"
                        label="Amount"
                        type="number"
                        value={amount}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        disabled
                        name="unitPrice"
                        label="Unit Price ($)"
                        type="number"
                        value={unitPrice}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <h4>
                        Total:
                        {unitPrice * amount}
                      </h4>
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        name="estimatedDelivery"
                        label="Estimated Delivery"
                        type="date"
                        value={estimatedDelivery}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        onChange={this.handleChange}
                        name="arrivedDate"
                        label="Arrived Date"
                        type="date"
                        value={arrivedDate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        disabled
                        onChange={this.handleChange}
                        name="poNumber"
                        label="PO Number"
                        type="text"
                        value={poNumber}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </GridItem>
                    <GridItem md={12}>
                      <FormControl className={styles.formControl}>
                        <InputLabel htmlFor="location">Arrived at Location</InputLabel>
                        <Select
                          value={locationId}
                          onChange={this.handleLocationChange}
                          style={{
                            minWidth: 300,
                            padding: 5,
                            margin: 5,
                          }}
                          inputProps={{
                            name: 'location',
                            id: 'location',
                            width: '300',
                          }}
                        >
                          {locations && (
                            locations.map((l, key) => (<MenuItem name={key} value={l.locationId}>{l.locationName}</MenuItem>)))
                          }
                        </Select>
                      </FormControl>
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
            <Button disabled={loading} onClick={this.markAsArrived} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          place="tl"
          color={snackbarColor}
          icon={Check}
          message={snackbarMessage}
          open={openSnackbar}
          closeNotification={() => this.setState({ openSnackbar: false })}
          close
        />

      </div>
    );
  }
}
