import React from 'react';
import Check from '@material-ui/icons/Check';
import Money from '@material-ui/icons/Money';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import MUIDataTable from 'mui-datatables';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Snackbar from '../../components/Snackbar/Snackbar';
import Button from '../../components/CustomButtons/Button';
import CustomerInfo from '../Orders/CustomerInfo';
import CustomerService from '../../services/CustomerService';
import CustomerStoreCreditService from '../../services/CustomerStoreCreditService';

function dateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const stringDate = [day, month, year].join('/');
  return `${stringDate} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export default class CustomerStoreCredit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      notes: '',
      customerStoreCredits: [],
      customer: {},
      showStoreCreditDialog: false,
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      loading: false,
    };

    this.save = this.save.bind(this);
    this.updateStoreCredit = this.updateStoreCredit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.save = this.save.bind(this);
  }

  async componentDidMount() {
    const { match } = this.props;
    const customerId = match.params.id;
    this.setState({ loading: true });
    const customer = await CustomerService.getCustomer(customerId);
    const columns = ['amount', 'notes', 'createdDate', 'createdByUserId'];

    CustomerStoreCreditService.getCustomerStoreCredits(customerId)
      .then(results => results.map(row => columns.map((column) => {
        if (column === 'createdDate') {
          return dateFormat(row[column]);
        }
        return row[column] || '';
      })))
      .then(data => this.setState({ customerStoreCredits: data, loading: false }));

    this.setState({
      customer,
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleClose() {
    this.setState({
      showStoreCreditDialog: false,
    });
  }

  updateStoreCredit() {
    this.setState({
      showStoreCreditDialog: true,
    });
  }

  async save() {
    const { amount, notes } = this.state;
    const { match } = this.props;
    const customerId = match.params.id;

    const storeCredit = {
      customerId,
      amount,
      notes,
    };
    const result = await CustomerStoreCreditService.addCustomerStoreCredits(storeCredit);
    if (result) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Customer Store Credit was saved successfully!',
        snackbarColor: 'success',
        showStoreCreditDialog: false,
      });
      window.location.reload();
    }
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
      textStyle: {
        widt: '200px',
      },
    };

    const columns = [
      {
        name: 'Amount ($)',
        options: {
          filter: false,
        },
      },
      {
        name: 'Notes',
        options: {
          filter: false,
        },
      },
      {
        name: 'Date',
        options: {
          filter: false,
        },
      },
      {
        name: 'Created By User',
      }];

    const options = {
      filterType: 'checkbox',
      rowHover: true,
      resizableColumns: false,
      selectableRows: false,
      rowsPerPageOptions: [25, 50, 100],
      rowsPerPage: 25,
    };

    const {
      customer, customerStoreCredits, showStoreCreditDialog, amount, notes,
      snackbarColor,
      snackbarMessage,
      openSnackbar,
      loading,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={10}>
            <CustomerInfo customer={customer} />
          </GridItem>
          <GridItem>
            <Button color="primary" onClick={this.updateStoreCredit}>
              <Money />
              Add / Deduct Store Credit
            </Button>
          </GridItem>
          <GridItem md={1}>
            {loading && <CircularProgress />}
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Customer Store Credits</div>
              </CardHeader>
              <CardBody>
                <MUIDataTable
                  title=""
                  data={customerStoreCredits}
                  columns={columns}
                  options={options}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Dialog
          open={showStoreCreditDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="info">
                <div>Store Credit</div>
              </CardHeader>
              <CardBody>
                <FormControl component="fieldset">
                  <GridContainer>
                    <GridItem md={12}>
                      <TextField
                        name="amount"
                        label="Amount"
                        type="number"
                        onChange={this.handleChange}
                        value={amount}
                        style={styles.textStyle}
                      />
                    </GridItem>
                    <GridItem md={12}>
                      <TextField
                        name="notes"
                        label="Notes"
                        multiline
                        rows="3"
                        type="text"
                        onChange={this.handleChange}
                        value={notes}
                        style={styles.textStyle}
                      />
                    </GridItem>
                  </GridContainer>
                </FormControl>
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.save} color="primary">
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
