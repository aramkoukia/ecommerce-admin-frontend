/* eslint-disable react/prop-types */
import React from 'react';
import MaterialTable from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Card from '../../components/Card/Card';
import CustomerService from '../../services/CustomerService';

export default class Customers extends React.Component {
  state = {
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
        field: 'accountBalance',
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
        defaultFilter: ['No'],
        lookup: {
          Yes: 'Yes',
          No: 'No',
        },
      },
      {
        title: 'Notes',
        field: 'notes',
        readonly: true,
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

  async componentDidMount() {
    await this.customersList();
  }

  async customersList() {
    this.setState({ loading: true });
    const showDisabled = true;
    const result = await CustomerService.getCustomersWithBalance(showDisabled);
    this.setState({ customers: result, loading: false });
  }

  showDetails(customerId) {
    const { history } = this.props;
    history.push(`/customer/${customerId}`);
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
      customers, loading, columns, options,
    } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Customers List</div>
              </CardHeader>
              <CardBody>
                {customers && (
                <MaterialTable
                  columns={columns}
                  data={customers}
                  actions={[
                    {
                      icon: 'menu',
                      tooltip: 'See Details',
                      onClick: (event, rowData) => this.showDetails(rowData.customerId),
                    },
                  ]}
                  options={options}
                  title=""
                />
                )}
              </CardBody>
            </Card>
            { loading && (<LinearProgress />) }
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
