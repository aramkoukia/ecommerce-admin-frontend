import React from 'react';
// @material-ui/core components
// import withStyles from "@material-ui/core/styles/withStyles";
import Check from '@material-ui/icons/Check';
// core components

import MUIDataTable from 'mui-datatables';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CardBody from '../../components/Card/CardBody';
import CardHeader from '../../components/Card/CardHeader';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';

import ProductService from '../../services/ProductService';

export default class Inventory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
    };
    this.rowClicked = this.rowClicked.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
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
      vancouverQuantity: rowData[3],
      vancouverStorageCode: rowData[5],
      vancouverNotes: '',
      abbotsfordQuantity: rowData[4],
      abbotsfordStorageCode: rowData[6],
      abbotsfordNotes: '',
    });
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
        productId: 1, // todo, add productid as hidden to grid?,
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
        productId: 1, // todo, add productid as hidden to grid?,
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
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  productsList() {
    const columns = ['productCode', 'productName', 'salesPrice', 'vancouverBalance', 'abbotsfordBalance', 'vancouverBinCode', 'abbotsfordBinCode'];
    ProductService.getProducts()
      .then(results => results.map(row => columns.map(column => (row[column] === null ? '' : row[column]))))
      .then(data => this.setState({ products: data }));
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
      resizableColumns: true,
      selectableRows: false,
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
    } = this.state;

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
                  title="To update the inventory or storage code click on the product record bellow."
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
          <DialogTitle id="form-dialog-title">Inventory Update</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Code:
              {' '}
              { selectedRow && (selectedRow[0]) }
              {' '}
              <br />
              Name:
              {' '}
              { selectedRow && (selectedRow[1]) }
              {' '}
              <br />
            </DialogContentText>

            <Card>
              <CardHeader color="info">
                <div>Vancouver</div>
              </CardHeader>
              <CardBody>
                <TextField
                  name="vancouverQuantity"
                  label="Quantity"
                  type="number"
                  onChange={this.handleChange}
                  value={vancouverQuantity}
                />
                &nbsp;
                <TextField
                  name="vancouverStorageCode"
                  label="Storage Code"
                  type="text"
                  onChange={this.handleChange}
                  value={vancouverStorageCode}
                />
                &nbsp;
                <TextField
                  required
                  name="vancouverNotes"
                  label="Notes"
                  type="text"
                  onChange={this.handleChange}
                  value={vancouverNotes}
                  fullWidth
                />
              </CardBody>
            </Card>
            <Card>
              <CardHeader color="info">
                <div>Abbotsford</div>
              </CardHeader>
              <CardBody>
                <TextField
                  name="abbotsfordQuantity"
                  label="Quantity"
                  type="number"
                  onChange={this.handleChange}
                  value={abbotsfordQuantity}
                />
                &nbsp;
                <TextField
                  name="abbotsfordStorageCode"
                  label="Storage Code"
                  type="text"
                  onChange={this.handleChange}
                  value={abbotsfordStorageCode}
                />
                &nbsp;
                <TextField
                  required
                  name="abbotsfordNotes"
                  label="Notes"
                  type="text"
                  onChange={this.handleChange}
                  fullWidth
                  value={abbotsfordNotes}
                />
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button onClick={this.handleUpdate} color="primary">
              Update
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
