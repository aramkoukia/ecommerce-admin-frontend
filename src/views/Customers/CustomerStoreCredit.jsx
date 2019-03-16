import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import MUIDataTable from 'mui-datatables';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Button from '../../components/CustomButtons/Button';
import CustomerInfo from '../Orders/CustomerInfo';
import CustomerService from '../../services/CustomerService';
import CustomerStoreCreditService from '../../services/CustomerStoreCreditService';

export default class CustomerStoreCredit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      customerStoreCredits: [],
      customer: {},
    };
    this.updateStoreCredit = this.updateStoreCredit.bind(this);
  }

  async componentDidMount() {
    const { match } = this.props;
    const customerId = match.params.id;
    const customer = await CustomerService.getCustomer(customerId);
    const customerStoreCredits = await CustomerStoreCreditService.getCustomerStoreCredit(customerId);
    this.setState({
      customerStoreCredits,
      customer,
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

    const columns = [
      {
        name: 'Amount',
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
      resizableColumns: true,
      selectableRows: false,
      rowsPerPageOptions: [25, 50, 100],
      rowsPerPage: 25,
    };

    const { customer, customerStoreCredits } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <CustomerInfo customer={customer} />
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
      </div>
    );
  }
}
