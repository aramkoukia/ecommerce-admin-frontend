import React from 'react';
import Check from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
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
import ProductDetailTable from './ProductDetailTable';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import Snackbar from '../../components/Snackbar/Snackbar';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import ProductService from '../../services/ProductService';
import LocationService from '../../services/LocationService';
import InventoryTransfer from './InventoryTransfer';
import InventoryUpdate from './InventoryUpdate';

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

// eslint-disable-next-line no-extend-native
Date.prototype.addDays = function (days) {
  this.setDate(this.getDate() + parseInt(days, 10));
  return this;
};

export class Product extends React.Component {
  state = {
    product: null,
    productTransactions: [],
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    fromDate: '',
    toDate: '',
    openTransferDialog: false,
    openUpdateDialog: false,
    locationId: 0,
    locations: [
      {
        locationId: 0,
        locationName: 'All',
      },
    ],
  };

  constructor(props) {
    super(props);
    this.enableDisableProducts = this.enableDisableProducts.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
    this.updateClicked = this.updateClicked.bind(this);
    this.transferClicked = this.transferClicked.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  async componentDidMount() {
    const { productId } = this.props;
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

  async getLocations() {
    const { locations } = this.state;
    LocationService.getLocationsForUser()
      .then((results) => this.setState({
        locations: [...locations, ...results],
      }));
  }

  handleClose = () => {
    this.setState({
      openTransferDialog: false,
      openUpdateDialog: false,
    });
  };

  handleUpdateClose = async () => {
    const { productId } = this.props;
    const product = await ProductService.getProduct(productId);
    this.setState({
      product,
      openUpdateDialog: false,
    });
  }

  handleTransferFinished = async () => {
    const { productId } = this.props;
    const product = await ProductService.getProduct(productId);
    this.setState({
      product,
      openTransferDialog: false,
    });
  }

  handleCloseProduct = () => {
    this.setState({
      openTransferDialog: false,
      openUpdateDialog: false,
    });
  };

  handleLocationChange = (event) => {
    this.setState({ locationId: event.target.value });
    this.search(event.target.value);
  }

  search(locationId) {
    const { fromDate, toDate } = this.state;
    const productId = this.props;
    const columns = ['date', 'transactionType', 'amount', 'balance', 'locationName', 'notes', 'userName'];
    ProductService.getProductTransactions(productId, fromDate, toDate, locationId)
      .then((results) => results.map((row) => columns.map((column) => {
        if (column === 'date') {
          return dateFormat(row[column]);
        }
        return row[column] || '';
      })))
      .then((data) => this.setState({ productTransactions: data }));
  }

  enableDisableProducts() {
    const { match } = this.props;
    const productId = match.params.id;
    ProductService.disableProduct(productId);
    window.location.reload();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  updateClicked() {
    this.setState({
      openUpdateDialog: true,
    });
  }

  transferClicked() {
    this.setState({
      openTransferDialog: true,
    });
  }

  render() {
    const {
      product,
      productTransactions,
      openTransferDialog,
      openUpdateDialog,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      fromDate,
      toDate,
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
                  &nbsp;&nbsp;
                  {' '}
                  {product.productName}
                </div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12}>
                    <Card>
                      <CardBody>
                        {product && (
                          <div>
                            <GridContainer>
                              <GridItem xs="10">
                                <Button color="primary" onClick={this.updateClicked}>
                                  Update
                                </Button>
                                &nbsp;
                                &nbsp;
                                <Button color="primary" onClick={this.transferClicked}>
                                  Transfer
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
                            <ProductDetailTable product={product} />
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
                              locations.map((l, key) => (
                                <MenuItem
                                  name={key}
                                  value={l.locationId}
                                >
                                  {l.locationName}
                                </MenuItem>
                              )))}
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
          open={openUpdateDialog}
          onClose={this.handleUpdateClose}
          aria-labelledby="form-dialog-title"
          maxWidth="lg"
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
            <InventoryUpdate
              product={product}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleUpdateClose} color="info">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openTransferDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="lg"
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
            <InventoryTransfer
              locations={locations}
              product={product}
              handleClose={this.handleTransferFinished}
            />
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
  productId: PropTypes.number.isRequired,
};

export default withStyles(styles)(Product);
