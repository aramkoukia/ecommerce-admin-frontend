import React from 'react';
import MaterialTable from 'material-table';
import {
  LinearProgress,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import ShopifyStorefrontService from '../../services/ShopifyStorefrontService';

export default class ShopifyCustomers extends React.Component {
  state = {
    customers: [],
    loading: false,
    openSnackbar: false,
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
  }

  componentDidMount() {
    this.listCustomers();
  }

  approve(rowData) {
    const { customerId, shopifyCustomerId } = rowData;
    this.setState({ loading: true });
    ShopifyStorefrontService.approve(
      {
        customerId,
        shopifyCustomerId,
      },
    ).then(() => this.setState({
      loading: false,
    }));
  }

  pushOrders(rowData) {
    const { customerId } = rowData;
    this.setState({ loading: true });
    ShopifyStorefrontService.pushOrders(
      {
        customerId,
      },
    ).then(() => this.setState({
      loading: false,
    }));
  }

  listCustomers() {
    this.setState({ loading: true });
    ShopifyStorefrontService.getCustomers()
      .then((data) => {
        return this.setState({ customers: data, loading: false });
      });
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
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Shopify Customers - Orders Access Requests
                </div>
              </CardHeader>
              <CardBody>
                <MaterialTable
                  columns={columns}
                  data={customers}
                  actions={[
                    {
                      icon: 'check',
                      tooltip: 'Approve',
                      onClick: (event, rowData) => this.approve(rowData),
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
        </GridContainer>
      </div>
    );
  }
}
