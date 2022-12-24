/* eslint-disable react/destructuring-assignment */
import React from 'react';
import {
  CircularProgress,
  TextField,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import MaterialTable from 'material-table';
import { StylesProvider, createGenerateClassName } from '@material-ui/styles';
import Snackbar from '../../components/Snackbar/Snackbar';
import GridItem from '../../components/Grid/GridItem';
import Button from '../../components/CustomButtons/Button';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import OrderService from '../../services/OrderService';
import LocationService from '../../services/LocationService';

const generateClassName = createGenerateClassName({
  productionPrefix: 'mt',
  seed: 'mt',
});

// function dateFormat(dateString) {
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = `${date.getMonth() + 1}`.padStart(2, 0);
//   const day = `${date.getUTCDate()}`.padStart(2, 0);
//   const stringDate = [year, month, day].join('-');
//   return stringDate;
// }

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

export default class IncomingOrders extends React.Component {
  state = {
    orders: [],
    loading: false,
    openDialog: false,
    selectedRow: {},
    locations: [],
    totalAmount: 0,
    snackbarMessage: '',
    openSnackbar: false,
    snackbarColor: 'info',
    columns: [
      { title: 'Brand Name', field: 'brandName' },
      { title: 'Order No', field: 'brandOrderNo' },
      { title: 'Order Date', field: 'orderDate' },
      { title: 'Product Code', field: 'productCode' },
      { title: 'Product Name', field: 'productName' },
      { title: 'Amount', field: 'amount' },
      { title: 'Status', field: 'status' },
      { title: 'Processed', field: 'processed' },
    ],
    options: {
      paging: true,
      pageSizeOptions: [25, 50, 100],
      pageSize: 25,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      search: true,
    },
  };

  constructor(props) {
    super(props);
    this.showProcessInventory = this.showProcessInventory.bind(this);
    this.processInventory = this.processInventory.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  async componentDidMount() {
    this.getIncomingOrdersList();
  }

  getIncomingOrdersList() {
    this.setState({ loading: true });

    OrderService.getIncomingOrdersList()
      .then((data) => this.setState({ orders: data, loading: false }));

    LocationService.getLocations()
      .then((data) => this.setState({ locations: data, loading: false }));
  }

  showProcessInventory(rowData) {
    this.setState({
      openDialog: true,
      selectedRow: rowData,
    });
  }

  processInventory() {
    this.setState({ loading: true });

    const { locations, totalAmount, selectedRow } = this.state;
    if (selectedRow.amount !== totalAmount) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: `Total amount entered ${totalAmount} does not match the incoming order amount ${selectedRow.amount} !`,
        snackbarColor: 'danger',
        loading: false
      });
      return;
    }

    const locationAmounts = [];
    locations.forEach((location) => {
      if ((this.state[location.locationName] || 0) > 0) {
        locationAmounts.push(
          {
            locationId: location.locationId,
            amount: parseFloat(this.state[location.locationName] || 0),
          },
        );
      }
    });

    const inventoryProcessData = {
      productId: selectedRow.productId,
      brandOrderDetailId: selectedRow.brandOrderDetailId,
      locationAmounts,
    };

    OrderService.processInventory(inventoryProcessData)
      .then(() => {
        OrderService.getIncomingOrdersList()
          .then((data) => this.setState({ orders: data, loading: false, openDialog: false }));
      });

    this.setState({ openDialog: false });
  }

  handleAmountChange(event) {
    const { locations } = this.state;
    let totalAmount = 0;
    locations.forEach((location) => {
      if (location.locationName !== event.target.name) {
        totalAmount += (parseFloat(this.state[location.locationName]) || 0);
      }
    });

    totalAmount += parseFloat(event.target.value) || 0;

    this.setState({
      totalAmount,
      [event.target.name]: event.target.value,
    });
  }

  handleClose() {
    this.setState({ openDialog: false });
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
      formControl: {
        margin: 10,
        padding: 10,
        minWidth: 300,
      },
      selectEmpty: {
        marginTop: 10 * 2,
      },
    };

    // const detailPanel = [
    //   {
    //     tooltip: 'Details',
    //     render: (rowData) => (
    //       <div
    //         style={{
    //           width: '60%',
    //           backgroundColor: '#ccf9ff',
    //         }}
    //       >
    //         <Table>
    //           <TableHead>
    //             <TableRow>
    //               <TableCell>Location</TableCell>
    //               <TableCell numeric>Balance</TableCell>
    //               <TableCell numeric>Amount</TableCell>
    //               <TableCell>createdDate</TableCell>
    //               <TableCell>createdByUserId</TableCell>
    //             </TableRow>
    //           </TableHead>
    //           <TableBody>
    //             {rowData.processedDetails.map((row) => (
    //               <TableRow key={row.BrandOrderDetailProcessedId}>
    //                 <TableCell>{row.locationName}</TableCell>
    //                 <TableCell numeric align="right">{row.balance}</TableCell>
    //                 <TableCell numeric align="right">{row.amount}</TableCell>
    //                 <TableCell>{dateFormat(row.createdDate)}</TableCell>
    //                 <TableCell>{row.createdByUserId}</TableCell>
    //               </TableRow>
    //             ))}
    //           </TableBody>
    //         </Table>
    //       </div>
    //     ),
    //   },
    // ];

    const {
      orders,
      loading,
      openDialog,
      selectedRow,
      columns,
      options,
      totalAmount,
      snackbarMessage,
      openSnackbar,
      snackbarColor,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Incoming Orders from Veroboard and GEK Power
                </div>
              </CardHeader>
              <CardBody>
                <StylesProvider generateClassName={generateClassName}>
                  {loading && <CircularProgress />}
                  <MaterialTable
                    columns={columns}
                    data={orders}
                    // detailPanel={detailPanel}
                    options={options}
                    actions={[
                      {
                        icon: 'move_up',
                        tooltip: 'Process Inventory',
                        onClick: (event, rowData) => this.showProcessInventory(rowData),
                      },
                    ]}

                    title=""
                  />
                </StylesProvider>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Dialog
          open={openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="lg"
        >
          <DialogContent>
            <Card>
              <CardHeader color="info">
                <div>Enter amount to transfer from each location</div>
              </CardHeader>
              <CardBody>
                <FormControl component="fieldset">
                  <GridContainer>
                    <GridItem md={12}>
                      Order From:
                      {' '}
                      {selectedRow && (selectedRow.brandName)}
                    </GridItem>
                    <GridItem md={12}>
                      Product Code:
                      {' '}
                      {selectedRow && (selectedRow.productCode)}
                    </GridItem>
                    <GridItem md={12}>
                      Product Name:
                      {' '}
                      {selectedRow && (selectedRow.productName)}
                    </GridItem>
                    <GridItem md={12}>
                      Amount:
                      {' '}
                      {selectedRow && (selectedRow.amount)}
                    </GridItem>
                    <GridItem>
                      <Table size="small" style={{ backgroundColor: '#DFFCF7' }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Location</TableCell>
                            <TableCell numeric>Balance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedRow && selectedRow.inventoryList
                            && (selectedRow.inventoryList.map((row) => (
                              <TableRow key={row.productId}>
                                <TableCell>{row.locationName}</TableCell>
                                <TableCell numeric>{row.balance}</TableCell>
                                <TableCell>
                                  <TextField
                                    name={`${row.locationName}`}
                                    label={row.locationName}
                                    type="text"
                                    onChange={this.handleAmountChange}
                                    style={styles.smallText}
                                    value={this.state[`${row.locationName}`]}
                                  />
                                </TableCell>
                              </TableRow>
                            )))}
                        </TableBody>
                      </Table>
                    </GridItem>
                    <GridItem md={12}>
                      Total:
                      {' '}
                      {totalAmount}
                    </GridItem>

                  </GridContainer>
                </FormControl>
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button disabled={loading} onClick={this.processInventory} color="primary">
              Save
            </Button>
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
