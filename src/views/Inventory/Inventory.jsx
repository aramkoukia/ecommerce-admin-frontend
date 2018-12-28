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

const productService = new ProductService();

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
    } = this.state;

    // TODO: only call the ones that has changed compared to the original selection
    // API Call here.. 2 API calls?
    const vancouverInventory = {
      locationId: 1, // vancouver
      productId: 1, // todo, add productid as hidden to grid?,
      amount: vancouverQuantity,
      binCode: vancouverStorageCode,
      notes: vancouverNotes,
    };
    await productService.updateInventory(vancouverInventory);


    const abbotsfordInventory = {
      locationId: 2, // vancouver
      productId: 1, // todo, add productid as hidden to grid?,
      amount: abbotsfordQuantity,
      binCode: abbotsfordStorageCode,
      notes: abbotsfordNotes,
    };
    await productService.updateInventory(abbotsfordInventory);

    this.setState({
      openSnackbar: true,
      snackbarMessage: 'Inventory and Storage location was successfully updated!',
      snackbarColor: 'success',
    });

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
      products, selectedRow, openSnackbar, snackbarMessage, snackbarColor, openDialog,
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
                  value={selectedRow && (selectedRow[3])}
                />
                &nbsp;
                <TextField
                  name="vancouverStorageCode"
                  label="Storage Code"
                  type="text"
                  value={selectedRow && (selectedRow[5])}
                />
                &nbsp;
                <TextField
                  required
                  name="vancouverNotes"
                  label="Notes"
                  type="text"
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
                  value={selectedRow && (selectedRow[4])}
                />
                &nbsp;
                <TextField
                  name="abbotsfordStorageCode"
                  label="Storage Code"
                  type="text"
                  value={selectedRow && (selectedRow[6])}
                />
                &nbsp;
                <TextField
                  required
                  name="abbotsfordNotes"
                  label="Notes"
                  type="text"
                  fullWidth
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
