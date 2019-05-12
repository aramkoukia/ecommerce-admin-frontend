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
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
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
  return num && !isNaN(num) ? `${Number(num).toFixed(2)} $` : '';
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
      plannedItems: [],
      paidItems: [],
      onDeliveryItems: [],
      customClearanceItems: [],
      arrivedItems: [],
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
    this.deleteClicked = this.deleteClicked.bind(this);
  }

  async componentDidMount() {
    const { purchase } = this.props;
    this.setState({
      plannedItems: purchase.purchaseDetail.filter(m => m.status === 'Plan'),
      paidItems: purchase.purchaseDetail.filter(m => m.status === 'Paid'),
      onDeliveryItems: purchase.purchaseDetail.filter(m => m.status === 'OnDelivery'),
      customClearanceItems: purchase.purchaseDetail.filter(m => m.status === 'CustomClearance'),
      arrivedItems: purchase.purchaseDetail.filter(m => m.status === 'Arrived'),
    });
  }

  handleLocationChange = (event) => {
    const { locations } = this.state;
    const locationName = locations.find(m => m.locationId == event.target.value).locationName;

    this.setState({
      locationId: event.target.value,
      locationName,
    });
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

  markAsPaidClicked(amount, unitPrice, overheadCost, poNumber, purchaseDetailId) {
    const { purchase } = this.props;
    this.setState({
      openMarkAsPaidDialog: true,
      amount,
      unitPrice,
      overheadCost,
      poNumber,
      paidDate: dateFormat((new Date()).addHours(-8)),
      estimatedDelivery: dateFormat(purchase.deliveryDate),
      purchaseDetailId,
    });
  }

  async deleteClicked(purchaseDetailId) {
    this.setState({
      loading: true,
    });

    const result = await PurchaseService.deletePurchaseDetail(purchaseDetailId);

    this.setState({
      loading: false,
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
  }

  markAsOnDeliveryClicked(amount, unitPrice, overheadCost, poNumber, purchaseDetailId, paidDate) {
    const { purchase } = this.props;
    this.setState({
      openMarkAsOnDeliveryDialog: true,
      amount,
      unitPrice,
      overheadCost,
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
  }

  markAsCustomClearanceClicked(amount, unitPrice, overheadCost, poNumber, purchaseDetailId) {
    const { purchase } = this.props;
    this.setState({
      openMarkAsCustomClearanceDialog: true,
      amount,
      unitPrice,
      overheadCost,
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
  }

  markAsArrivedClicked(amount, unitPrice, overheadCost, poNumber, purchaseDetailId) {
    const { purchase } = this.props;
    const { locations } = this.state;

    LocationService.getLocationsForUser()
      .then(results => this.setState({
        locations: results,
        openMarkAsArrivedDialog: true,
        amount,
        unitPrice,
        overheadCost,
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
      overheadCost,
      paidDate,
      arrivedDate,
      estimatedDelivery,
      poNumber,
      locationId,
      locationName,
    } = this.state;

    const purchaseDetailStatusUpdate = {
      amount,
      unitPrice,
      overheadCost,
      paidDate,
      arrivedDate,
      estimatedDelivery,
      poNumber,
      purchaseStatus: status,
      totalPrice: Number(unitPrice) * Number(amount) + Number(overheadCost),
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
    } else {
      purchaseDetailStatusUpdate.purchaseDetailId = result.purchaseDetailId,
      purchaseDetailStatusUpdate.productId = result.productId;
      purchaseDetailStatusUpdate.product = {
        productId: result.product.productId,
        productCode: result.productId,
        productName: result.product.productName,
      };
      purchaseDetailStatusUpdate.location = {
        locationName: locationName,
      };

      if (status === 'Paid') {
        this.setState({
          paidItems: [...this.state.paidItems, purchaseDetailStatusUpdate]
        });
      } else if (status === 'OnDelivery') {
        this.setState({
          onDeliveryItems: [...this.state.onDeliveryItems, purchaseDetailStatusUpdate]
        });
      } else if (status === 'CustomClearance') {
        this.setState({
          customClearanceItems: [...this.state.customClearanceItems, purchaseDetailStatusUpdate]
        });
      } else if (status === 'Arrived') {
        this.setState({
          arrivedItems: [...this.state.arrivedItems, purchaseDetailStatusUpdate]
        });
      }
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
      overheadCost,
      unitPrice,
      estimatedDelivery,
      paidDate,
      arrivedDate,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      locations,
      locationId,
      plannedItems,
      paidItems,
      onDeliveryItems,
      customClearanceItems,
      arrivedItems,
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
                {plannedItems.map(row => (
                  <TableRow key={row.purchaseDetailId}>
                    <TableCell>
                      <Button color="primary"
                        size="small"
                        onClick={() => this.markAsPaidClicked(row.amount, row.unitPrice, row.overheadCost, purchase.poNumber, row.purchaseDetailId)}>
                        Paid
                      </Button>
                      &nbsp;
                      <IconButton
                        aria-label="Delete"
                        name={row.productId}
                        onClick={() => {
                          this.deleteClicked(row.purchaseDetailId);
                          const newPlannedItems = plannedItems.filter(function (obj) {
                            return obj.purchaseDetailId !== row.purchaseDetailId;
                          });
                          this.setState({ plannedItems: newPlannedItems });
                        }}
                      >
                        <DeleteIcon
                          name={row.productId}
                          fontSize="small"
                        />
                      </IconButton>
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
                  <TableCell numeric><Success><h5>{ccyFormat(plannedItems.map(item => item.totalPrice).reduce((prev, next) => prev + next, 0))}</h5></Success></TableCell>
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
                  <TableCell numeric>Overhead Cost</TableCell>
                  <TableCell numeric>Total Price</TableCell>
                  {/* <TableCell>Paid Date</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {paidItems.map(row => (
                  <TableRow key={row.purchaseDetailId}>
                    <TableCell>
                      <Button
                        size="small"
                        color="primary" onClick={() => this.markAsOnDeliveryClicked(row.amount, row.unitPrice, row.overheadCost, purchase.poNumber, row.purchaseDetailId, row.paidDate)}>
                        Delivery
                      </Button>
                      &nbsp;
                      <IconButton
                        aria-label="Delete"
                        name={row.productId}
                        onClick={() => {
                          this.deleteClicked(row.purchaseDetailId);
                          const newPaidItems = paidItems.filter(function (obj) {
                            return obj.purchaseDetailId !== row.purchaseDetailId;
                          });
                          this.setState({ paidItems: newPaidItems });
                        }}
                      >
                        <DeleteIcon
                          name={row.productId}
                          fontSize="small"
                        />
                      </IconButton>
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
                    {/* <TableCell>{row.poNumber}</TableCell>
                    <TableCell>{dateFormat(row.paidDate)}</TableCell>
                    <TableCell>{dateFormat(row.estimatedDelivery)}</TableCell> */}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4}><h5>Total</h5></TableCell>
                  <TableCell numeric><Success><h5>{ccyFormat(paidItems.map(item => item.totalPrice).reduce((prev, next) => prev + next, 0))}</h5></Success></TableCell>
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
                  <TableCell numeric>Overhead Cost</TableCell>
                  <TableCell numeric>Total Price</TableCell>
                  {/* <TableCell>Estimated Delivery</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {onDeliveryItems.map(row => (
                  <TableRow key={row.purchaseDetailId}>
                    <TableCell>
                      <Button color="primary"
                        size="small"
                        onClick={() => this.markAsCustomClearanceClicked(row.amount, row.unitPrice, row.overheadCost, purchase.poNumber, row.purchaseDetailId)}>
                        Custom
                      </Button>
                      &nbsp;
                      <IconButton
                        aria-label="Delete"
                        name={row.productId}
                        onClick={() => {
                          this.deleteClicked(row.purchaseDetailId);
                          const newOnDeliveryItems = onDeliveryItems.filter(function (obj) {
                            return obj.purchaseDetailId !== row.purchaseDetailId;
                          });
                          this.setState({ onDeliveryItems: newOnDeliveryItems });
                        }}
                      >
                        <DeleteIcon
                          name={row.productId}
                          fontSize="small"
                        />
                      </IconButton>
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
                    {/* <TableCell>{dateFormat(row.estimatedDelivery)}</TableCell> */}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4}><h5>Total</h5></TableCell>
                  <TableCell numeric><Success><h5>{ccyFormat(purchase.purchaseDetail.map(item => item.totalPrice).reduce((prev, next) => prev + next, 0))}</h5></Success></TableCell>
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
                  <TableCell numeric>Overhead Cost</TableCell>
                  <TableCell numeric>Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customClearanceItems.map(row => (
                  <TableRow key={row.purchaseDetailId}>
                    <TableCell>
                      <Button color="primary"
                        size="small"
                        onClick={() => this.markAsArrivedClicked(row.amount, row.unitPrice, row.overheadCost, purchase.poNumber, row.purchaseDetailId)}>
                        Arrived
                      </Button>
                      &nbsp;
                      <IconButton
                        aria-label="Delete"
                        name={row.productId}
                        onClick={() => {
                          this.deleteClicked(row.purchaseDetailId);
                          const newCustomClearanceItems = customClearanceItems.filter(function (obj) {
                            return obj.purchaseDetailId !== row.purchaseDetailId;
                          });
                          this.setState({ customClearanceItems: newCustomClearanceItems });
                        }}
                      >
                        <DeleteIcon
                          name={row.productId}
                          fontSize="small"
                        />
                      </IconButton>
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
                    {/* <TableCell>{dateFormat(row.estimatedDelivery)}</TableCell> */}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4}><h5>Total</h5></TableCell>
                  <TableCell numeric><Success><h5>{ccyFormat(customClearanceItems.map(item => item.totalPrice).reduce((prev, next) => prev + next, 0))}</h5></Success></TableCell>
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
                  <TableCell numeric>Overhead Cost</TableCell>
                  <TableCell numeric>Total Price</TableCell>
                  <TableCell>Arrived Date</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {arrivedItems.map(row => (
                  <TableRow key={row.purchaseDetailId}>
                    <TableCell>
                      &nbsp;
                      <IconButton
                        aria-label="Delete"
                        name={row.productId}
                        onClick={() => {
                          this.deleteClicked(row.purchaseDetailId);
                          const newArrivedItems = arrivedItems.filter(function (obj) {
                            return obj.purchaseDetailId !== row.purchaseDetailId;
                          });
                          this.setState({ arrivedItems: newArrivedItems });
                        }}
                      >
                        <DeleteIcon
                          name={row.productId}
                          fontSize="small"
                        />
                      </IconButton>
                      &nbsp;
                      {row.product.productName}
                    </TableCell>
                    <TableCell numeric align="right">{row.amount}</TableCell>
                    <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                    <TableCell numeric>{ccyFormat(row.overheadCost)}</TableCell>
                    <TableCell numeric>{ccyFormat(row.totalPrice)}</TableCell>
                    <TableCell>{dateFormat(row.arrivedDate)}</TableCell>
                    <TableCell>{row.location.locationName}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={6}><h5>Total</h5></TableCell>
                  <TableCell numeric><Success><h5>{ccyFormat(arrivedItems.map(item => item.totalPrice).reduce((prev, next) => prev + next, 0))}</h5></Success></TableCell>
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
                      <TextField
                        onChange={this.handleChange}
                        name="overheadCost"
                        label="Overhead Cost ($)"
                        type="number"
                        value={overheadCost}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <h4>
                        Total:
                        {Number(unitPrice) * Number(amount) + Number(overheadCost)}
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
                      <TextField
                        onChange={this.handleChange}
                        name="overheadCost"
                        label="Overhead Cost ($)"
                        type="number"
                        value={overheadCost}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <h4>
                        Total:
                        {Number(unitPrice) * Number(amount) + Number(overheadCost)}
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
                    {/* <GridItem md={12}>
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
                    </GridItem> */}
                    {/* <GridItem md={12}>
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
                    </GridItem> */}
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
                      <TextField
                        onChange={this.handleChange}
                        name="overheadCost"
                        label="Overhead Cost ($)"
                        type="number"
                        value={overheadCost}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <h4>
                        Total:
                        {Number(unitPrice) * Number(amount) + Number(overheadCost)}
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
                    {/* <GridItem md={12}>
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
                    </GridItem> */}
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
                      <TextField
                        onChange={this.handleChange}
                        name="overheadCost"
                        label="Overhead Cost ($)"
                        type="number"
                        value={overheadCost}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                    </GridItem>
                    <GridItem md={12}>
                      <h4>
                        Total:
                        {Number(unitPrice) * Number(amount) + Number(overheadCost)}
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
                    {/* <GridItem md={12}>
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
                    </GridItem> */}
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
