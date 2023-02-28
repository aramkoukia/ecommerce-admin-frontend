/* eslint-disable react/prop-types */
import React from 'react';
import Chip from '@material-ui/core/Chip';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '../../components/Table/Table';
import Danger from '../../components/Typography/Danger';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';

const style = {
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
};
function CustomerInfo(props) {
  const { classes, customer } = props;
  return (
    <Card>
      <CardHeader color="info">
        <div className={classes.cardTitleWhite}>
          Customer
          {customer && customer.disabled && (
            <span>
              &nbsp;&nbsp;
              <Chip label="Disabled" color="secondary" />
            </span>
          )}
        </div>
      </CardHeader>
      <CardBody>
        { customer && (
        <>
          <Table
            tableHeaderColor="primary"
            tableHead={['Email', 'Name', 'Company Name', 'Phone Number', 'PST Number']}
            tableData={[
              [customer.email,
                `${customer.firstName} ${customer.lastName}`,
                customer.companyName,
                customer.phoneNumber,
                customer.pstNumber,
              ],
            ]}
          />
          <Table
            tableHeaderColor="primary"
            tableHead={['Awaiting Payment', 'Credit Limit', 'Store Credit', 'Credit Card On File', 'Charge Preference']}
            tableData={[
              [customer.accountBalance,
                customer.creditLimit,
                customer.storeCredit,
                customer.isCreditCardOnFile,
                customer.chargePreference],
            ]}
          />
          <Table
            tableHeaderColor="primary"
            tableHead={['Notes (Shows at time of order)']}
            tableData={[
              [customer.notes],
            ]}
          />
        </>
        ) }
        { (customer === undefined) && (
          <Danger>no customer info available</Danger>)}
      </CardBody>
    </Card>
  );
}

export default withStyles(style)(CustomerInfo);
