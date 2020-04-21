import React from 'react';
import Check from '@material-ui/icons/Check';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import LinearProgress from '@material-ui/core/LinearProgress';
import MUIDataTable from 'mui-datatables';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CardBody from '../../components/Card/CardBody';
import CardHeader from '../../components/Card/CardHeader';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import Auth from '../../services/Auth';
import ProductService from '../../services/ProductService';


export default class Inventory extends React.Component {
  state = {
    products: [],
    openDialog: false,
    selectedRow: null,
    vancouverQuantity: 0,
    vancouverStorageCode: '',
    vancouverNotes: '',
    abbotsfordQuantity: 0,
    abbotsfordStorageCode: '',
    abbotsfordNotes: '',
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    loading: false,
    transferNotes: '',
    transferQuantity: 0,
    fromLocation: 1,
    toLocation: 2,
  };

  constructor(props) {
    super(props);
    this.rowClicked = this.rowClicked.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this);
  }

  componentDidMount() {
    this.productsList();
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      selectedRow: null,
      vancouverQuantity: 0,
      vancouverStorageCode: '',
      vancouverNotes: '',
      abbotsfordQuantity: 0,
      abbotsfordStorageCode: '',
      abbotsfordNotes: '',
    });
  };

  rowClicked(rowData) {
    this.setState({
      openDialog: true,
      selectedRow: rowData,
      vancouverQuantity: rowData[4],
      vancouverStorageCode: rowData[6],
      vancouverNotes: '',
      abbotsfordQuantity: rowData[5],
      abbotsfordStorageCode: rowData[7],
      abbotsfordNotes: '',
    });
  }

  async handleTransfer() {
    const {
      selectedRow,
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
        productId: selectedRow[0],
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
      selectedRow: null,
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
      selectedRow,
    } = this.state;

    if (vancouverQuantity !== selectedRow[3] || vancouverStorageCode !== selectedRow[5]) {
      const productInventoryHistory = {
        locationId: 1, // vancouver
        productId: selectedRow[0],
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

    if (abbotsfordQuantity !== selectedRow[4] || abbotsfordStorageCode !== selectedRow[6]) {
      const productInventoryHistory = {
        locationId: 2, // abbotsford
        productId: selectedRow[0],
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
      selectedRow: null,
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

  productsList() {
    this.setState({ loading: true });
    const columns = ['productId', 'productCode', 'productName', 'salesPrice', 'vancouverBalance', 'abbotsfordBalance', 'vancouverBinCode', 'abbotsfordBinCode'];
    ProductService.getProducts()
      .then((results) => results.map((row) => columns.map((column) => (row[column] === null ? '' : row[column]))))
      .then((data) => this.setState({ products: data, loading: false }));
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

    const columns = [
      {
        name: 'product Id',
        options: {
          filter: false,
          display: false,
        },
      },
      {
        name: 'Product Code',
        options: {
          filter: false,
        },
      },
      {
        name: 'Product Name',
        options: {
          filter: false,
        },
      },
      {
        name: 'Sales Price ($)',
        options: {
          filter: false,
          display: false,
        },
      },
      {
        name: 'Van  Balance',
        options: {
          filter: false,
        },
      },
      {
        name: 'Abb Balance',
        options: {
          filter: false,
        },
      },
      {
        name: 'Van Storage',
        options: {
          filter: false,
        },
      },
      {
        name: 'Abb Storage',
        options: {
          filter: false,
        },
      },
    ];

    const options = {
      filterType: 'checkbox',
      onRowClick: this.rowClicked,
      rowHover: true,
      resizableColumns: false,
      selectableRows: false,
      rowsPerPageOptions: [25, 50, 100],
      rowsPerPage: 25,
    };

    const {
      products,
      selectedRow,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
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
    } = this.state;

    const locations = Auth.getUserLocations();

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Inventory List</div>
              </CardHeader>
              <CardBody>
                <MUIDataTable
                  title="To Transfer or Update the inventory or Storage Code, click on the product record bellow."
                  data={products}
                  columns={columns}
                  options={options}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        <Dialog
          open={openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Code:
              {' '}
              { selectedRow && (selectedRow[1]) }
              {' '}
              <br />
              Name:
              {' '}
              { selectedRow && (selectedRow[2]) }
              {' '}
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
                        { locations && (
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
                        { locations && (
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
            { loading && (<LinearProgress />) }
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

// export default withStyles(styles)(Products);
