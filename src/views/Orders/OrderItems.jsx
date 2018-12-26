import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import Success from "components/Typography/Success.jsx";
import TableRow from "@material-ui/core/TableRow";

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

function ccyFormat(num) {
  return `${num.toFixed(2)} $`;
};

function OrderItems(props) {
  const { classes, order } = props;

  return (
    <Card>
      <CardHeader color="info">
        <h4 className={classes.cardTitleWhite}>Order Items</h4>
      </CardHeader>
      <CardBody>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell numeric>Amount</TableCell>
              <TableCell numeric>Unit Price</TableCell>
              <TableCell numeric>Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.orderDetail.map(row => {
              return (
                <TableRow key={row.productId}>
                  <TableCell>{row.product.productName}</TableCell>
                  <TableCell numeric align="right">{row.amount}</TableCell>
                  <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                  <TableCell numeric>{ccyFormat(row.totalPrice)}</TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell rowSpan={5} />
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell numeric>{ccyFormat(order.subTotal)}</TableCell>
            </TableRow>
            {order.orderTax.map((tax) =>
              <TableRow>
                <TableCell>{tax.tax.taxName}</TableCell>
                <TableCell numeric>{`${(tax.tax.percentage).toFixed(0)} %`}</TableCell>
                <TableCell numeric>{ccyFormat(tax.taxAmount)}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={2}><h3>Total</h3></TableCell>
              <TableCell numeric><Success><h3>{ccyFormat(order.total)}</h3></Success></TableCell>
            </TableRow>
          </TableBody>        
        </Table>
      </CardBody>
    </Card>
  );
}

export default withStyles(style)(OrderItems);

