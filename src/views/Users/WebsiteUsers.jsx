import React from 'react';
import MaterialTable from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import Check from '@material-ui/icons/Check';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Portal from '@material-ui/core/Portal';
import Button from '../../components/CustomButtons/Button';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridItem from '../../components/Grid/GridItem';
import Snackbar from '../../components/Snackbar/Snackbar';
import UserService from '../../services/UserService';
import CustomerSearch from '../Orders/CustomerSearch';

export default class WebsiteUsers extends React.Component {
  state = {
    users: [],
    openDialog: false,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
  };

  constructor(props) {
    super(props);

    this.linkClicked = this.linkClicked.bind(this);
    this.customerChanged = this.customerChanged.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.linkCustomer = this.linkCustomer.bind(this);
  }

  componentDidMount() {
    this.usersList();
  }

  usersList() {
    UserService.getWebsiteUsers()
      .then((data) => this.setState({ users: data }));
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  }

  async customerChanged(customer) {
    this.setState({ customer });
  }

  async linkCustomer() {
    const { customer, userName } = this.state;
    const result = await UserService.linkCustomer({
      customerCode: customer.customerCode,
      userName,
    });

    if (result) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'User is linked to the Customer account!',
        snackbarColor: 'success',
      });
      this.setState({ openDialog: false, customer: null, userName: null });
    } else {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Oops, somthing went wrong!',
        snackbarColor: 'danger',
      });
    }
  }

  linkClicked(selectedRow) {
    const { userName } = selectedRow;
    this.setState({ user: selectedRow, userName, openDialog: true });
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
        title: 'Given Name',
        field: 'givenName',
      },
      {
        title: 'Email',
        field: 'email',
      },
      {
        title: 'User Name',
        field: 'userName',
        readonly: true,
        editable: 'never',
      },
      {
        title: 'Customer Code',
        field: 'customerCode',
        readonly: true,
        editable: 'never',
      },
      {
        title: 'Company Name',
        field: 'companyName',
        readonly: true,
        editable: 'never',
      },
      {
        title: 'User Id',
        field: 'id',
        hidden: true,
        readonly: true,
        editable: 'never',
      },
    ];

    const options = {
      paging: true,
      pageSizeOptions: [25, 50, 100],
      pageSize: 25,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      search: true,
    };

    const {
      user,
      users,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      loading,
      openDialog,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Website Users List</div>
              </CardHeader>
              <CardBody>
                <MaterialTable
                  columns={columns}
                  data={users}
                  options={options}
                  title=""
                  actions={[
                    {
                      icon: 'group',
                      tooltip: 'Link to Customer',
                      onClick: (event, rowData) => this.linkClicked(rowData),
                    },
                  ]}
                />
                {loading && (<LinearProgress />)}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Dialog
          open={openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          fullWidth
          maxWidth={"md"}
        >
          <DialogContent>
            <Card>
              <CardHeader color="info">
                <div>Link User to Customer Account</div>
              </CardHeader>
              <CardBody>
                <p>
                  <b>Link User:</b>
                </p>
                <p>
                  {user && (
                    `User Name: ${user.userName}`
                  )}
                </p>
                <p>
                  {user && (
                    `Given Name: ${user.givenName}`
                  )}
                </p>
                <p>
                  {user && (
                    `Email: ${user.email}`
                  )}
                </p>
                <p>
                  <b>To Customer:</b>
                </p>
                <CustomerSearch customerChanged={this.customerChanged} />
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.linkCustomer} color="primary">
              Link
            </Button>
            <Button onClick={this.handleClose} color="info">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Portal>
          <Snackbar
            place="tl"
            color={snackbarColor}
            icon={Check}
            message={snackbarMessage}
            open={openSnackbar}
            closeNotification={() => this.setState({ openSnackbar: false })}
            close
          />
        </Portal>
      </div>
    );
  }
}
