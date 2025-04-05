/* eslint-disable react/prop-types */
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Success from '../../components/Typography/Success';
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

function dateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const stringDate = [day, month, year].join('/');
  return `${stringDate} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function ccyFormat(num) {
  return `${num.toFixed(2)} $`;
}

function OrderItems(props) {
  const { classes, order } = props;

  return (
    <Card>
      <CardHeader color="info">
        <div className={classes.cardTitleWhite}>Order Items</div>
      </CardHeader>
      <CardBody>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Row</TableCell>
              <TableCell>Product</TableCell>
              <TableCell numeric>Amount</TableCell>
              <TableCell numeric>Unit Price</TableCell>
              <TableCell numeric>Discount</TableCell>
              <TableCell numeric align="right">Total Price (After discount)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.orderDetail
              .sort((a, b) => (a.rowOrder > b.rowOrder ? 1 : -1))
              .map((row) => (
                <TableRow key={row.productId}>
                  <TableCell>{row.rowOrder}</TableCell>
                  <TableCell>
                    {row.product.productName}
                    {row.package && (
                      ` ( pkg: ${row.package} ) ${row.amountInMainPackage}x`
                    )}
                    <i>
                      {row.itemNotes && <br />}
                      {row.itemNotes && <span dangerouslySetInnerHTML={{ __html: row.itemNotes.replace(/(?:\r\n|\r|\n)/g, '<br>') }} />}
                    </i>
                  </TableCell>
                  <TableCell numeric align="right">{row.amount}</TableCell>
                  <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                  <TableCell numeric>{ccyFormat(row.totalDiscount)}</TableCell>
                  <TableCell numeric align="right">{ccyFormat(row.total)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <GridContainer>
          <GridItem md={6} />
          <GridItem md={6}>
            <Table className={classes.table}>
              <TableBody>
                <TableRow></TableRow>
                <TableRow>
                  <TableCell colspan="2" align="right">Subtotal (after discount)</TableCell>
                  <TableCell numeric align="right">{ccyFormat(order.subTotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colspan="2" align="right">Total Discount</TableCell>
                  <TableCell numeric align="right">
                    {ccyFormat(order.orderDetail.map((item) => item.totalDiscount).reduce((prev, next) => prev + next, 0))}
                  </TableCell>
                </TableRow>
                {(order.status === 'Return' || order.status === 'RMA') && (
                <TableRow>
                  <TableCell align="right"><b>Re-Stocking Fee (%)</b></TableCell>
                  <TableCell numeric align="right">
                    <b>
                      {order.restockingFeePercent}
                      %
                    </b>
                  </TableCell>
                  <TableCell numeric align="right">
                    <b>
                      {ccyFormat(order.restockingFeeAmount)}
                    </b>
                  </TableCell>
                </TableRow>
                )}
                {order.orderTax.map((tax) => (
                  <TableRow>
                    <TableCell align="right">{tax.tax.taxName}</TableCell>
                    <TableCell align="right" numeric>{`${(tax.tax.percentage).toFixed(0)} %`}</TableCell>
                    <TableCell align="right" numeric>{ccyFormat(tax.taxAmount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colspan="2" align="right"><h3>Total</h3></TableCell>
                  <TableCell numeric align="right">
                    <Success>
                      <h3>
                        {ccyFormat(order.total)}
                      </h3>
                    </Success>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </GridItem>
        </GridContainer>
        <Table className={classes.table}>
          <TableBody>
            {order.orderPayment && order.orderPayment.map((orderPayment) => (
              <TableRow>
                <TableRow></TableRow>
                <TableCell><h4>Payment</h4></TableCell>
                <TableCell><h4>{dateFormat(orderPayment.paymentDate)}</h4></TableCell>
                <TableCell><h4>{orderPayment.paymentType.paymentTypeName}</h4></TableCell>
                <TableCell><h4>{orderPayment.chequeNo}</h4></TableCell>
                <TableCell numeric align="right"><h4>{ccyFormat(orderPayment.paymentAmount)}</h4></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}

export default withStyles(style)(OrderItems);
