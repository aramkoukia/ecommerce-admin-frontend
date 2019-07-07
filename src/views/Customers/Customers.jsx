import React from 'react';
import MUIDataTable from 'mui-datatables';
import LinearProgress from '@material-ui/core/LinearProgress';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Card from '../../components/Card/Card';
import CustomerService from '../../services/CustomerService';

export default class Customers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      customers: [],
      loading: false,
    };
    this.rowClicked = this.rowClicked.bind(this);
  }

  componentDidMount() {
    this.customersList();
  }

  customersList() {
    this.setState({ loading: true });
    const columns = ['customerCode', 'companyName', 'firstName', 'lastName', 'email', 'accountBalance', 'creditLimit', 'pstNumber', 'storeCredit', 'phoneNumber', 'pstExempt', 'isDisabled'];
    const showDisabled = true;
    CustomerService.getCustomersWithBalance(showDisabled)
      .then(results => results.map(row => columns.map(column => row[column] || '')))
      .then(data => this.setState({ customers: data, loading: false }));
  }

  rowClicked(rowData) {
    const { history } = this.props;
    history.push(`/customer/${rowData[0]}`);
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
        name: 'Customer Code',
        options: {
          filter: false,
        },
      },
      {
        name: 'Company Name',
        options: {
          filter: false,
        },
      },
      {
        name: 'First Name',
        options: {
          filter: false,
        },
      },
      {
        name: 'Last Name',
        options: {
          filter: false,
        },
      },
      {
        name: 'Email',
        options: {
          filter: false,
        },
      },
      {
        name: 'Awaiting Payment ($)',
        options: {
          filter: false,
        },
      },

      {
        name: 'Credit Limit ($)',
        options: {
          filter: false,
        },
      },
      {
        name: 'PST Number',
        options: {
          filter: false,
        },
      },
      {
        name: 'Store Credit ($)',
        options: {
          filter: false,
        },
      },
      {
        name: 'Phone Number',
        options: {
          filter: false,
        },
      },
      {
        name: 'PST Exempt',
        options: {
          filter: true,
        },
      },
      {
        name: 'Disabled',
        options: {
          filter: true,
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

    const { customers, loading } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Customers List</div>
              </CardHeader>
              <CardBody>
                <MUIDataTable
                  title="Click on each customer record below to see their previous orders."
                  data={customers}
                  columns={columns}
                  options={options}
                />
              </CardBody>
            </Card>
            { loading && (<LinearProgress />) }
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
