import React from 'react';
import {
  MenuItem,
  CircularProgress,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MaterialTable from 'material-table';
import { StylesProvider, createGenerateClassName } from '@material-ui/styles';
import GridItem from '../../components/Grid/GridItem';
import Button from '../../components/CustomButtons/Button';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import OrderService from '../../services/OrderService';
import LocationService from '../../services/LocationService';
import { Order } from './Order';

const generateClassName = createGenerateClassName({
  productionPrefix: 'mt',
  seed: 'mt',
});

function dateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getUTCDate()}`.padStart(2, 0);
  const stringDate = [year, month, day].join('-');
  return stringDate;
}

function ccyFormat(num) {
  return `${num.toFixed(2)} $`;
}

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default class IncomingOrders extends React.Component {
  state = {
    orders: [],
    loading: false,
    showOrder: false,
    columns: [
      { title: 'Brand Name', field: 'brandName' },
      { title: 'Order No', field: 'brandOrderNo' },
      { title: 'Order Date', field: 'orderDate' },
      { title: 'Product Code', field: 'productCode' },
      { title: 'Product Name', field: 'productName' },
      { title: 'Amount', field: 'amount' },
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
  }

  async componentDidMount() {
    this.getIncomingOrdersList();
  }

  getIncomingOrdersList() {
    this.setState({ loading: true });

    OrderService.getIncomingOrdersList()
      .then((data) => this.setState({ orders: data, loading: false }));
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

    const detailPanel = [
      {
        tooltip: 'Details',
        render: (rowData) => (
          <div
            style={{
              width: '60%',
              backgroundColor: '#ccf9ff',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell numeric>Amount</TableCell>
                  <TableCell>createdDate</TableCell>
                  <TableCell>createdByUserId</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {rowData.processedDetails.map((row) => (
                  <TableRow key={row.BrandOrderDetailProcessedId}>
                    <TableCell>{row.locationName}</TableCell>
                    <TableCell numeric align="right">{row.amount}</TableCell>
                    <TableCell>{row.createdDate}</TableCell>
                    <TableCell>{row.createdByUserId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ),
      },
    ];

    const {
      orders,
      loading,
      orderId,
      showOrder,
      columns,
      options,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Incoming Orders from Veroboard and GEK Power</div>
              </CardHeader>
              <CardBody>
                <StylesProvider generateClassName={generateClassName}>
                  {loading && <CircularProgress />}
                  <MaterialTable
                    columns={columns}
                    data={orders}
                    detailPanel={detailPanel}
                    options={options}
                    onRowClick={this.rowClicked}
                    title=""
                  />
                </StylesProvider>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Dialog
          fullScreen
          open={showOrder}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          TransitionComponent={Transition}
        >
          <AppBar style={{ position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                <CloseIcon />
                Close
              </IconButton>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <Order orderId={orderId} {...this.props} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
