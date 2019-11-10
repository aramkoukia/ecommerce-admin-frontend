import React from 'react';
import Check from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import Button from '../../components/CustomButtons/Button';
import Table from '../../components/Table/Table';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import Snackbar from '../../components/Snackbar/Snackbar';
import GridItem from '../../components/Grid/GridItem';
import ProductService from '../../services/ProductService';
import LocationService from '../../services/LocationService';

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
  const stringDate = [year, month, day].join('-');
  return stringDate;
}

Date.prototype.addDays = function (days) {
  this.setDate(this.getDate() + parseInt(days));
  return this;
};

export class Product extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product: null,
      productTransactions: [],
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      fromDate: '',
      toDate: '',
      openDialog: false,
      vancouverQuantity: 0,
      vancouverStorageCode: '',
      vancouverNotes: '',
      abbotsfordQuantity: 0,
      abbotsfordStorageCode: '',
      abbotsfordNotes: '',
      loading: false,
      transferNotes: '',
      transferQuantity: 0,
      fromLocation: 1,
      toLocation: 2,
      locationId: 0,
      locations: [
        {
          locationId: 0,
          locationName: 'All',
        },
      ],
    };

    this.enableDisableProducts = this.enableDisableProducts.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this);
    this.search = this.search.bind(this);
    this.updateTransferClicked = this.updateTransferClicked.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  async componentDidMount() {
    const { match } = this.props;
    const productId = match.params.id;
    const product = await ProductService.getProduct(productId);
    const fromDate = dateFormat(new Date(Date.now()).addDays(-7));
    const toDate = dateFormat(new Date(Date.now()));
    this.setState({
      product,
      fromDate,
      toDate,
    });
    this.getLocations();
    this.search(0);
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      vancouverQuantity: 0,
      vancouverStorageCode: '',
      vancouverNotes: '',
      abbotsfordQuantity: 0,
      abbotsfordStorageCode: '',
      abbotsfordNotes: '',
    });
  };

  async getLocations() {
    const { locations } = this.state;
    LocationService.getLocationsForUser()
      .then(results => this.setState({
        locations: [...locations, ...results],
      }));
  }

  updateTransferClicked() {
    const { product } = this.state;

    this.setState({
      openDialog: true,
      vancouverQuantity: product.vancouverBalance,
      vancouverStorageCode: product.vancouverBinCode,
      vancouverNotes: '',
      abbotsfordQuantity: product.abbotsfordBalance,
      abbotsfordStorageCode: product.vancouverBinCode,
      abbotsfordNotes: '',
    });
  }

  async handleTransfer() {
    const {
      product,
      transferQuantity,
      transferNotes,
      fromLocation,
      toLocation,
      vancouverQuantity,
      abbotsfordQuantity,
    } = this.state;

    if (fromLocation === toLocation) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Select different locations to transfer!',
        snackbarColor: 'danger',
      });
      return;
    }

    if (transferNotes === '') {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Please enter some Notes to transfer!',
        snackbarColor: 'danger',
      });
      return;
    }

    if ((fromLocation === 1 && vancouverQuantity < transferQuantity)
      || (fromLocation === 2 && abbotsfordQuantity < transferQuantity)) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'This location doesn\'t have enough inventory to transfer!',
        snackbarColor: 'danger',
      });
      return;
    }

    if (transferQuantity > 0) {
      const inventoryTransfer = {
        fromLocationId: fromLocation,
        toLocationId: toLocation,
        productId: product.productId,
        notes: transferNotes,
        transferQuantity,
        transferNotes,
      };
      const result = await ProductService.transferInventory(inventoryTransfer);
      if (result && result.orderId) {
        this.setState({
          openSnackbar: true,
          snackbarMessage: 'Inventory was successfully transferred!',
          snackbarColor: 'success',
        });
      }
    }

    this.setState({
      openDialog: false,
      transferQuantity: 0,
      transferNotes: '',
      fromLocation: 1,
      toLocation: 2,
    });
    window.location.reload();
  }

  async handleUpdate() {
    const {
      vancouverQuantity,
      vancouverStorageCode,
      vancouverNotes,
      abbotsfordQuantity,
      abbotsfordStorageCode,
      abbotsfordNotes,
      product,
    } = this.state;

    if (vancouverQuantity !== product.vancouverBalance || vancouverStorageCode !== product.vancouverStorageCode) {
      const productInventoryHistory = {
        locationId: 1, // vancouver
        productId: product.productId,
        balance: vancouverQuantity,
        binCode: vancouverStorageCode,
        notes: vancouverNotes,
      };
      const result = await ProductService.updateInventory(productInventoryHistory);
      if (result && result.orderId) {
        this.setState({
          openSnackbar: true,
          snackbarMessage: 'Vancouver\'s Inventory and Storage location was successfully updated!',
          snackbarColor: 'success',
        });
      }
    }

    if (abbotsfordQuantity !== product.abbotsfordBalance || abbotsfordStorageCode !== product.abbotsfordStorageCode) {
      const productInventoryHistory = {
        locationId: 2, // abbotsford
        productId: product.productId,
        balance: abbotsfordQuantity,
        binCode: abbotsfordStorageCode,
        notes: abbotsfordNotes,
      };
      const result = await ProductService.updateInventory(productInventoryHistory);
      if (result && result.orderId) {
        this.setState({
          openSnackbar: true,
          snackbarMessage: 'Abbotsford\'s Inventory and Storage location was successfully updated!',
          snackbarColor: 'success',
        });
      }
    }

    this.setState({
      openDialog: false,
      vancouverQuantity: 0,
      vancouverStorageCode: '',
      vancouverNotes: '',
      abbotsfordQuantity: 0,
      abbotsfordStorageCode: '',
      abbotsfordNotes: '',
    });
    window.location.reload();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  enableDisableProducts() {
    const { match } = this.props;
    const productId = match.params.id;
    ProductService.disableProduct(productId);
    window.location.reload();
  }

  search(locationId) {
    const { fromDate, toDate } = this.state;
    const { match } = this.props;
    const productId = match.params.id;
    const columns = ['date', 'transactionType', 'amount', 'balance', 'locationName', 'notes', 'userName'];
    ProductService.getProductTransactions(productId, fromDate, toDate, locationId)
      .then(results => results.map(row => columns.map((column) => {
        if (column === 'date') {
          return dateFormat(row[column]);
        }
        return row[column] || '';
      })))
      .then(data => this.setState({ productTransactions: data }));
  }

  handleLocationChange = (event) => {
    this.setState({ locationId: event.target.value });
    this.search(event.target.value);
  }

  render() {
    const {
      product,
      productTransactions,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      fromDate,
      toDate,
      openDialog,
      vancouverQuantity,
      vancouverStorageCode,
      vancouverNotes,
      abbotsfordQuantity,
      abbotsfordStorageCode,
      abbotsfordNotes,
      loading,
      transferNotes,
      transferQuantity,
      fromLocation,
      toLocation,
      locations,
      locationId,
    } = this.state;

    const columns = ['Date', 'Transaction Type', 'Amount', 'Balance', 'LocationName', 'Notes', 'User'];

    const options = {
      filterType: 'checkbox',
      onRowClick: this.rowClicked,
      rowHover: true,
      resizableColumns: false,
      selectableRows: false,
      rowsPerPageOptions: [25, 50, 100],
      rowsPerPage: 25,
    };

    const transferLocations = locations.filter(l => l.locationId !== 0);

    return (
      <div>
        { product && (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div>
                  <b>Product Transactions:</b>
                  &nbsp;
                  {product.productCode}
                  &nbsp;&nbsp; {product.productName}
                </div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12}>
                    <Card>
                      <CardHeader color="info">
                        <div>Product Info</div>
                      </CardHeader>
                      <CardBody>
                        {product && (
                          <div>
                            <GridContainer>
                              <GridItem xs="10">
                                <Button color="info" onClick={this.updateTransferClicked}>
                                    Update / Transfer
                                </Button>
                              </GridItem>
                                <GridItem xs="2">
                                {product.disabled === 'False' && (
                                  <Button color="warning" onClick={this.enableDisableProducts}>
                                    Disable Product
                                </Button>
                                )}
                                {product.disabled === 'True' && (
                                  <Button color="warning" onClick={this.enableDisableProducts}>
                                    Enable Product
                                </Button>
                                )}
                              </GridItem>
                            </GridContainer>
                            <Table
                              tableHeaderColor="primary"
                              tableHead={['Product Type', 'Code', 'Name', 'Sale Price', 'Van Balance', 'Van OnHold', 'Abb Balance', 'Abb OnHold', 'Disabled']}
                              tableData={
                              [[product.productTypeName,
                                product.productCode,
                                product.productName,
                                product.salesPrice,
                                product.vancouverBalance,
                                product.vancouverOnHold,
                                product.abbotsfordBalance,
                                product.abbotsfordOnHold,
                                product.disabled]]
                          }
                            />
                          </div>
                        ) }
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem xs={12}>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={4}>
                        <FormControl className={styles.formControl}>
                          <InputLabel htmlFor="location">Location</InputLabel>
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
                      <GridItem xs={12} sm={12} md={2}>
                        <TextField
                          onChange={this.handleChange}
                          name="fromDate"
                          id="date"
                          label="From Date"
                          type="date"
                          value={fromDate}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={2}>
                        <TextField
                          onChange={this.handleChange}
                          name="toDaye"
                          id="date"
                          label="To Date"
                          type="date"
                          value={toDate}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={1}>
                        <Button color="info" onClick={this.search}>Search</Button>
                      </GridItem>
                    </GridContainer>

                    <MUIDataTable
                      title="Product Transactions"
                      data={productTransactions}
                      columns={columns}
                      options={options}
                    />
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
        )}
        <Dialog
          open={openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Code:
              {product && product.productCode}
              <br />
              Name:
              {product && product.productName}
              <br />
            </DialogContentText>
            <Card>
              <CardHeader color="info">
                Inventory Transfer
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <FormControl>
                      <InputLabel htmlFor="fromLocation">From</InputLabel>
                      <Select
                        value={fromLocation}
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'fromLocation',
                          id: 'fromLocation',
                        }}
                      >
                        {transferLocations && (
                          transferLocations.map((l, key) => (<MenuItem name={key} value={l.locationId}>{l.locationName}</MenuItem>)))
                        }
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <FormControl>
                      <InputLabel htmlFor="toLocation">To</InputLabel>
                      <Select
                        value={toLocation}
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'toLocation',
                          id: 'toLocation',
                        }}
                      >
                        {transferLocations && (
                          transferLocations.map((l, key) => (<MenuItem name={key} value={l.locationId}>{l.locationName}</MenuItem>)))
                        }
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <FormControl>
                      <TextField
                        name="transferQuantity"
                        label="Quantity"
                        type="number"
                        onChange={this.handleChange}
                        value={transferQuantity}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      required
                      name="transferNotes"
                      label="Notes"
                      type="text"
                      onChange={this.handleChange}
                      fullWidth
                      value={transferNotes}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={9} />
                  <GridItem xs={12} sm={12} md={2}>
                    <Button onClick={this.handleTransfer} color="primary">
                      Transfer
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>

            <Card>
              <CardHeader color="info">
                Inventory Update
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h4><b>Vancouver</b></h4>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      name="vancouverQuantity"
                      label="Quantity"
                      type="number"
                      onChange={this.handleChange}
                      value={vancouverQuantity}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      name="vancouverStorageCode"
                      label="Storage Codes"
                      type="text"
                      onChange={this.handleChange}
                      value={vancouverStorageCode}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={11}>
                    <TextField
                      required
                      name="vancouverNotes"
                      label="Notes"
                      type="text"
                      onChange={this.handleChange}
                      value={vancouverNotes}
                      fullWidth
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <h4><b>Abbotsford</b></h4>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      name="abbotsfordQuantity"
                      label="Quantity"
                      type="number"
                      onChange={this.handleChange}
                      value={abbotsfordQuantity}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      name="abbotsfordStorageCode"
                      label="Storage Codes"
                      type="text"
                      onChange={this.handleChange}
                      value={abbotsfordStorageCode}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={11}>
                    <TextField
                      required
                      name="abbotsfordNotes"
                      label="Notes"
                      type="text"
                      onChange={this.handleChange}
                      fullWidth
                      value={abbotsfordNotes}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={9} />
                  <GridItem xs={12} sm={12} md={2}>
                    <Button onClick={this.handleUpdate} color="primary">
                      Update
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
            {loading && (<LinearProgress />)}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
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

Product.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  }).isRequired,
};

export default withStyles(styles)(Product);
