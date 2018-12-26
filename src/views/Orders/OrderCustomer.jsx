import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Primary from "components/Typography/Primary.jsx";
import Danger from "components/Typography/Danger";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Table from "components/Table/Table.jsx";

const style = {
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};
function OrderCustomer(props) {
  const { classes, order } = props;
  return (
    <Card>
      <CardHeader color="info">
        <h4 className={classes.cardTitleWhite}>Customer</h4>
      </CardHeader>
      <CardBody>
        { order.customer.firstName && (
            <Table
              tableHeaderColor="primary"
              tableHead={["Email", "Name", "Company Name", "Credit Limit", "PST Number"]}
              tableData={[
                [order.customer.email, 
                 order.customer.firstName + ' ' + order.customer.lastName, 
                 order.customer.companyName, 
                 order.customer.creditLimit , 
                 order.customer.pstNumber],
              ]}
            />  ) }
        { !order.customer.firstName && (
          <Danger>This Order has no customer</Danger> )
        }
      </CardBody>
    </Card>
  );
}

export default withStyles(style)(OrderCustomer);

