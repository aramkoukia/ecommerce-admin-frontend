import React from 'react';
import MaterialTable from 'material-table';
import {
  LinearProgress,
  DialogActions,
  Dialog,
  DialogContent,
  Button,
  TextField,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import CustomerSearch from '../Orders/CustomerSearch';
import ShopifyStorefrontService from '../../services/ShopifyStorefrontService';

export default class ShopifyCustomers extends React.Component {
  state = {
    customers: [],
    loading: false,
    openSnackbar: false,
    showApproveModal: false,
    email: '',
    firstName: '',
    lastName: '',
    shopifyCustomerId: '',
    customerId: '',
    snackbarMessage: '',
    snackbarColor: '',
    columns: [
      {
        title: 'Shopify Customer Id',
        field: 'shopifyCustomerId',
        readonly: true,
      },
      {
        title: 'Shopify Email',
        field: 'email',
        readonly: true,
      },
      {
        title: 'Shopify First Name',
        field: 'firstName',
        readonly: true,
      },
      {
        title: 'Shopify Last Name',
        field: 'lastName',
        readonly: true,
      },
      {
        title: 'Request Date',
        field: 'createdDate',
        readonly: true,
      },
      {
        title: 'POS Customer Code',
        field: 'customerId',
        readonly: true,
      },
      {
        title: 'Access Status',
        field: 'accessStatus',
        readonly: true,
      },
    ],
    options: {
      paging: true,
      pageSizeOptions: [25, 50, 100],
      pageSize: 25,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      search: true,
      rowStyle: (data) => {
        if (!data.customerId) {
          return {
            backgroundColor: '#ffcccc',
          };
        }
      },
    },
  };

  constructor(props) {
    super(props);
    this.approve = this.approve.bind(this);
    this.pushOrders = this.pushOrders.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.customerChanged = this.customerChanged.bind(this);
  }

  componentDidMount() {
    this.listCustomers();
  }

  handleClose() {
    this.setState({ showApproveModal: false });
  }

  async customerChanged(customer) {
    this.setState({
      customerId: customer.customerId,
    });
  }

  removeApproval(rowData) {
    const { shopifyCustomerId } = rowData;
    this.setState({ loading: true });
    ShopifyStorefrontService.removeApproval(shopifyCustomerId)
      .then(() => {
        this.setState({
          loading: false,
        });
        this.listCustomers();
      });
  }

  approve() {
    const { customerId, shopifyCustomerId } = this.state;
    if (!customerId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Please select a customer!',
        snackbarColor: 'danger',
      });
      return;
    }

    this.setState({ loading: true });
    ShopifyStorefrontService.approve(customerId, shopifyCustomerId)
      .then(() => {
        this.setState({
          loading: false,
          showApproveModal: false,
        });
        this.listCustomers();
      });
  }

  showApprove(rowData) {
    const {
      customerId, shopifyCustomerId,
      email, firstName, lastName,
    } = rowData;
    this.setState({
      loading: true,
      customerId,
      email,
      firstName,
      lastName,
      shopifyCustomerId,
      showApproveModal: true,
    });
  }

  pushOrders(rowData) {
    const { customerId } = rowData;
    this.setState({ loading: true });

    if (!customerId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'This Shopify Customer is not linked to a POS Customer!',
        snackbarColor: 'danger',
      });
      return;
    }

    ShopifyStorefrontService.pushOrders(customerId)
      .then(() => this.setState({
        loading: false,
      }));
  }

  listCustomers() {
    this.setState({ loading: true });
    ShopifyStorefrontService.getCustomers()
      .then((data) => this.setState({ customers: data, loading: false }));
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
      customers,
      loading,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      columns,
      options,
      showApproveModal,
      email,
      firstName,
      lastName,
      shopifyCustomerId,
      customerId,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Shopify Customers: Link to POS Customers and Approve Online Orders Access
                </div>
              </CardHeader>
              <CardBody>
                <MaterialTable
                  columns={columns}
                  data={customers}
                  actions={[
                    {
                      icon: 'link',
                      tooltip: 'Approve & Link POS Customer',
                      onClick: (event, rowData) => this.showApprove(rowData),
                    },
                    {
                      icon: 'link_off',
                      tooltip: 'Remove Approval & POS Customer',
                      onClick: (event, rowData) => this.removeApproval(rowData),
                    },
                    {
                      icon: 'sync',
                      tooltip: 'Push Orders to Shopify',
                      onClick: (event, rowData) => this.pushOrders(rowData),
                    },
                  ]}
                  options={options}
                  title=""
                />
              </CardBody>
            </Card>
            {loading && (<LinearProgress />)}
          </GridItem>
          <Snackbar
            place="tl"
            color={snackbarColor}
            icon={Check}
            message={snackbarMessage}
            open={openSnackbar}
            closeNotification={() => this.setState({ openSnackbar: false })}
            close
          />
          <Dialog
            maxWidth="xl"
            open={showApproveModal}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogContent>
              <Card>
                <CardHeader color="primary">
                  <div className={styles.cardTitleWhite}>
                    Shopify Customer: Link to POS Customers and Approve Online Orders Access
                  </div>
                </CardHeader>
                <CardBody>
                  <GridContainer md={12}>
                    <GridItem md={6}>
                      <TextField
                        name="email"
                        label="Shopify Customer Email"
                        type="text"
                        disabled
                        value={email}
                        fullWidth="true"
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <TextField
                        name="firstName"
                        label="First Name"
                        type="text"
                        disabled
                        value={firstName}
                        fullWidth="true"
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <TextField
                        name="lastName"
                        label="Last Name"
                        type="text"
                        disabled
                        value={lastName}
                        fullWidth="true"
                      />
                    </GridItem>
                    <GridItem md={6}>
                      <TextField
                        name="shopifyCustomerId"
                        label="Shopify Customer Code"
                        type="text"
                        disabled
                        value={shopifyCustomerId}
                        fullWidth="true"
                      />
                    </GridItem>
                    <GridItem md={12}>
                      <h4>Select a POS Customer to link to this Shopify Customer</h4>
                      <CustomerSearch customerChanged={this.customerChanged} />
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </DialogContent>
            <DialogActions>
              {loading && (<LinearProgress />)}
              <Button disabled={!customerId} onClick={this.approve} color="primary">
                Approve Access
              </Button>
              <Button onClick={this.handleClose} color="info">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </GridContainer>
      </div>
    );
  }
}
