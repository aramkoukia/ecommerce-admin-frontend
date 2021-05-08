import React from 'react';
import MaterialTable from 'material-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Card from '../../components/Card/Card';
import CustomerService from '../../services/CustomerService';

function ccyFormat(num) {
  return `${num.toFixed(2)} $`;
}

function dateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getUTCDate()}`.padStart(2, 0);
  const stringDate = [year, month, day].join('-');
  return stringDate;
}

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

export default class AwaitingPayments extends React.Component {
  state = {
    showOverDue: true,
    customers: [],
    loading: false,
    columns: [
      {
        title: 'Customer Code',
        field: 'customerCode',
        readonly: true,
      },
      {
        title: 'Company Name',
        field: 'companyName',
        readonly: true,
      },
      {
        title: 'First Name',
        field: 'firstName',
        readonly: true,
      },
      {
        title: 'Last Name',
        field: 'lastName',
        readonly: true,
      },
      {
        title: 'Email',
        field: 'email',
        readonly: true,
      },
      {
        title: 'Awaiting Payment ($)',
        field: 'total',
        cellStyle: {
          color: '#0716CB',
        },
        headerStyle: {
          color: '#0716CB',
        },
        readonly: true,
      },
      {
        title: 'Credit Limit ($)',
        field: 'creditLimit',
        readonly: true,
      },
      {
        title: 'PST Number',
        field: 'pstNumber',
        readonly: true,
      },
      {
        title: 'Store Credit',
        field: 'storeCredit',
        readonly: true,
      },
      {
        title: 'Phone Number',
        field: 'phoneNumber',
        readonly: true,
      },
      {
        title: 'PST Exempt',
        field: 'pstExempt',
        readonly: true,
      },
      {
        title: 'Credit Card On File',
        field: 'isCreditCardOnFile',
        readonly: true,
        lookup: {
          Yes: 'Yes',
          No: 'No',
        },
      },
      {
        title: 'Disabled',
        field: 'isDisabled',
        readonly: true,
        // defaultFilter: ['No'],
        lookup: {
          Yes: 'Yes',
          No: 'No',
        },
      },
      {
        title: 'Customer Id',
        field: 'customerId',
        readonly: true,
        hidden: true,
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
    },
  };

  constructor(props) {
    super(props);
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  async componentDidMount() {
    const { showOverDue } = this.state;
    await this.customersList(showOverDue);
  }

  async handleCheckChange(event) {
    this.setState({ [event.target.name]: event.target.checked });
    await this.customersList(event.target.checked);
  }

  async customersList(showOverDue) {
    this.setState({ loading: true });
    const result = await CustomerService.getCustomersAwaitingPayments(showOverDue);
    this.setState({ customers: result, loading: false });
  }

  showDetails(customerId) {
    const { history } = this.props;
    history.push(`/customer/${customerId}`);
  }

  async email(customerId) {
    this.setState({ loading: true });
    const lastMonthDate = new Date().addHours(-8);
    const fromDate = dateFormat(new Date(lastMonthDate.setMonth(lastMonthDate.getMonth() - 12)));
    const toDate = dateFormat((new Date()).addHours(-8));
    await CustomerService.emailStatement(customerId, fromDate, toDate);
    this.setState({ loading: false });
  }

  async print(customerId) {
    const lastMonthDate = new Date().addHours(-8);
    const fromDate = dateFormat(new Date(lastMonthDate.setMonth(lastMonthDate.getMonth() - 12)));
    const toDate = dateFormat((new Date()).addHours(-8));
    this.setState({ loading: true });
    await CustomerService.printStatement(customerId, fromDate, toDate);
    this.setState({ loading: false });
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
                  <TableCell>Order Id</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell numeric>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>PO Number</TableCell>
                  <TableCell>Paid Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Overdue</TableCell>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>User</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowData.customerAwaitingPaymentDetail.map((row) => (
                  <TableRow key={row.orderId}>
                    <TableCell>{row.orderId}</TableCell>
                    <TableCell>{row.orderDate}</TableCell>
                    <TableCell numeric>{ccyFormat(row.total)}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.poNumber}</TableCell>
                    <TableCell>{row.paidAmount}</TableCell>
                    <TableCell>{row.dueDate}</TableCell>
                    <TableCell>{row.overDue}</TableCell>
                    <TableCell>{row.companyName}</TableCell>
                    <TableCell>{row.locationName}</TableCell>
                    <TableCell>{row.givenName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ),
      },
    ];

    const {
      customers, loading, columns, options,
      showOverDue,
    } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Customers With Awaiting Payment Orders</div>
              </CardHeader>
              <CardBody>
                <FormControlLabel
                  control={(
                    <Checkbox
                      name="showOverDue"
                      checked={showOverDue}
                      onChange={this.handleCheckChange}
                      value="payCash"
                    />
                  )}
                  label="Ony Show Overdue Invoices"
                />
                {customers && (
                  <MaterialTable
                    columns={columns}
                    data={customers}
                    detailPanel={detailPanel}
                    actions={[
                      {
                        icon: 'menu',
                        tooltip: 'See All Orders',
                        onClick: (event, rowData) => this.showDetails(rowData.customerId),
                      },
                      {
                        icon: 'print',
                        tooltip: 'Print Statement',
                        onClick: (event, rowData) => this.print(rowData.customerId),
                      },
                      {
                        icon: 'email',
                        tooltip: 'Email Statement',
                        onClick: (event, rowData) => this.email(rowData.customerId),
                      },
                    ]}
                    options={options}
                    title=""
                  />
                )}
              </CardBody>
            </Card>
            {loading && (<LinearProgress />)}
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
