import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Success from '../../components/Typography/Success';
import Button from '../../components/CustomButtons/Button';
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

function ccyFormat(num) {
  return `${num.toFixed(2)} $`;
}

function markAsPaidClicked() {

}

function PurchaseItems(props) {
  const { classes, purchase } = props;

  return (
    <div>
      <Card>
        <CardHeader color="info">
          <div className={classes.cardTitleWhite}>Planned Items</div>
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
              {purchase.purchaseDetail.map(row => (
                <TableRow key={row.productId}>
                  <TableCell>
                    <Button color="primary" onClick={markAsPaidClicked(row.productId)}>Paid</Button>
                    &nbsp;
                    &nbsp;
                    {row.product.productCode}
                    &nbsp;
                    &nbsp;
                    {row.product.productName}
                  </TableCell>
                  <TableCell numeric align="right">{row.amount}</TableCell>
                  <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                  <TableCell numeric>{ccyFormat(row.totalPrice)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell rowSpan={5} />
                <TableCell colSpan={2}>Subtotal</TableCell>
                <TableCell numeric>{ccyFormat(purchase.subTotal)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}><h3>Total</h3></TableCell>
                <TableCell numeric><Success><h3>{ccyFormat(purchase.total)}</h3></Success></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <Card>
        <CardHeader color="info">
          <div className={classes.cardTitleWhite}>Paid Items</div>
        </CardHeader>
        <CardBody>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell numeric>Amount</TableCell>
                <TableCell numeric>Unit Price</TableCell>
                <TableCell numeric>Total Price</TableCell>
                <TableCell>Paid Date</TableCell>
                <TableCell>Estimated Delivery</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {purchase.purchaseDetail.map(row => (
              <TableRow key={row.productId}>
                <TableCell>{row.product.productName}</TableCell>
                <TableCell numeric align="right">{row.amount}</TableCell>
                <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                <TableCell numeric>{ccyFormat(row.totalPrice)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={5} />
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell numeric>{ccyFormat(purchase.subTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}><h3>Total</h3></TableCell>
              <TableCell numeric><Success><h3>{ccyFormat(purchase.total)}</h3></Success></TableCell>
            </TableRow> */}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <Card>
        <CardHeader color="info">
          <div className={classes.cardTitleWhite}>On Delivery Items</div>
        </CardHeader>
        <CardBody>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell numeric>Amount</TableCell>
                <TableCell numeric>Unit Price</TableCell>
                <TableCell numeric>Total Price</TableCell>
                <TableCell>Estimated Delivery</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {purchase.purchaseDetail.map(row => (
              <TableRow key={row.productId}>
                <TableCell>{row.product.productName}</TableCell>
                <TableCell numeric align="right">{row.amount}</TableCell>
                <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                <TableCell numeric>{ccyFormat(row.totalPrice)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={5} />
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell numeric>{ccyFormat(purchase.subTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}><h3>Total</h3></TableCell>
              <TableCell numeric><Success><h3>{ccyFormat(purchase.total)}</h3></Success></TableCell>
            </TableRow> */}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <Card>
        <CardHeader color="info">
          <div className={classes.cardTitleWhite}>Custom Clearance Items</div>
        </CardHeader>
        <CardBody>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell numeric>Amount</TableCell>
                <TableCell numeric>Unit Price</TableCell>
                <TableCell numeric>Total Price</TableCell>
                <TableCell>Estimated Delivery</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {purchase.purchaseDetail.map(row => (
              <TableRow key={row.productId}>
                <TableCell>{row.product.productName}</TableCell>
                <TableCell numeric align="right">{row.amount}</TableCell>
                <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                <TableCell numeric>{ccyFormat(row.totalPrice)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={5} />
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell numeric>{ccyFormat(purchase.subTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}><h3>Total</h3></TableCell>
              <TableCell numeric><Success><h3>{ccyFormat(purchase.total)}</h3></Success></TableCell>
            </TableRow> */}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <Card>
        <CardHeader color="info">
          <div className={classes.cardTitleWhite}>Arrived Items</div>
        </CardHeader>
        <CardBody>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell numeric>Amount</TableCell>
                <TableCell numeric>Unit Price</TableCell>
                <TableCell numeric>Total Price</TableCell>
                <TableCell>Arrived Date</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {purchase.purchaseDetail.map(row => (
              <TableRow key={row.productId}>
                <TableCell>{row.product.productName}</TableCell>
                <TableCell numeric align="right">{row.amount}</TableCell>
                <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                <TableCell numeric>{ccyFormat(row.totalPrice)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={5} />
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell numeric>{ccyFormat(purchase.subTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}><h3>Total</h3></TableCell>
              <TableCell numeric><Success><h3>{ccyFormat(purchase.total)}</h3></Success></TableCell>
            </TableRow> */}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}

export default withStyles(style)(PurchaseItems);
