import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Success from '../../components/Typography/Success';

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

export default class ReturnOrderItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: {},
    };
  }

  componentDidMount() {
    const { order } = this.props;
    this.setState({ originalOrder: order });

    this.handleQuantityChanged = this.handleQuantityChanged.bind(this);
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleQuantityChanged(event) {
    const { originalOrder, discountAmount, discountPercentage } = this.state;
    const { priceChanged } = this.props;

    const orderRows = originalOrder.orderDetail.slice();
    for (const i in orderRows) {
      if (orderRows[i].productId == event.target.name) {
        orderRows[i].qty = event.target.value;
        this.setState({ orderRows });
        break;
      }
    }

    const subTotal = this.subtotal(orderRows);
    const discount = this.discount(subTotal, discountAmount, discountPercentage);
    const total = this.total(subTotal, discount, originalOrder.orderTax);
    this.setState(
      {
        subTotal,
        total,
        discount,
      },
    );

    priceChanged(subTotal, total, discount, discountPercentage, discountAmount);
  }

  subtotal(items) {
    if (items.length === 0) {
      return 0;
    }
    return items.map(({ salesPrice, qty }) => salesPrice * qty).reduce((sum, i) => sum + i, 0);
  }

  discount(subtotal, discountAmount, discountPercentage) {
    let invoiceDiscount = 0;
    if (discountPercentage > 0) {
      invoiceDiscount = (discountPercentage / 100) * subtotal;
    } else if (discountAmount > 0) {
      invoiceDiscount = discountAmount;
    }
    return invoiceDiscount;
  }

  total(subTotal, discount, taxes) {
    const totalTax = taxes.map(({ percentage }) => (percentage / 100) * subTotal).reduce((sum, i) => sum + i, 0);
    return subTotal + totalTax - discount;
  }

  render() {
    const { originalOrder } = this.state;
    return (
      <Card>
        <CardHeader color="info">
          <div>Order Items</div>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell numeric>Amount</TableCell>
                <TableCell numeric>Unit Price</TableCell>
                <TableCell numeric>Total Price</TableCell>
              </TableRow>
            </TableHead>
            {originalOrder && (
            <TableBody>
              {originalOrder.orderDetail.map(row => (
                <TableRow key={row.productId}>
                  <TableCell>{row.product.productName}</TableCell>
                  <TableCell numeric align="right">
                    <TextField
                      name={row.productId}
                      value={row.amount}
                      onChange={this.handleQuantityChanged}
                      type="number"
                    />
                  </TableCell>
                  <TableCell numeric>{ccyFormat(row.unitPrice)}</TableCell>
                  <TableCell numeric>{ccyFormat(row.totalPrice)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell rowSpan={5} />
                <TableCell colSpan={2}>Subtotal</TableCell>
                <TableCell numeric>{ccyFormat(originalOrder.subTotal)}</TableCell>
              </TableRow>
              {originalOrder.orderTax.map(tax => (
                <TableRow>
                  <TableCell>{tax.tax.taxName}</TableCell>
                  <TableCell numeric>{`${(tax.tax.percentage).toFixed(0)} %`}</TableCell>
                  <TableCell numeric>{ccyFormat(tax.taxAmount)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}><h3>Total</h3></TableCell>
                <TableCell numeric><Success><h3>{ccyFormat(originalOrder.total)}</h3></Success></TableCell>
              </TableRow>
            </TableBody>
            )}
          </Table>
        </CardBody>
      </Card>
    );
  }
}
