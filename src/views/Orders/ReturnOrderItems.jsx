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

function ccyFormat(num) {
  return `${num.toFixed(2)} $`;
}

export default class ReturnOrderItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderRows: [],
      subTotal: 0,
      total: 0,
      discount: 0,
      discountAmount: 0,
      discountPercentage: 0,
    };
  }

  componentDidMount() {
    const {
      rows, discountAmount, discountPercentage, taxes, priceChanged,
    } = this.props;
    this.setState({
      orderRows: rows,
    });

    this.handleQuantityChanged = this.handleQuantityChanged.bind(this);

    const subTotal = this.subtotal(rows);
    const discount = this.discount(subTotal, discountAmount, discountPercentage);
    const total = this.total(subTotal, discount, taxes);
    this.setState({
      subTotal,
      total,
      discount,
    });
    priceChanged(rows, subTotal, total, discount, discountPercentage, discountAmount);
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleQuantityChanged(event) {
    const { discountAmount, discountPercentage } = this.state;
    const { taxes, priceChanged } = this.props;
    const orderRows = this.state.orderRows.slice();
    for (const i in orderRows) {
      if (orderRows[i].productId == event.target.name) {
        orderRows[i].amount = event.target.value;
        this.setState({ orderRows });
        break;
      }
    }

    const subTotal = this.subtotal(orderRows);
    const discount = this.discount(subTotal, discountAmount, discountPercentage);
    const total = this.total(subTotal, discount, taxes);
    this.setState({
      subTotal,
      total,
      discount,
    });

    priceChanged(orderRows, subTotal, total, discount, discountPercentage, discountAmount);
  }

  subtotal(items) {
    if (items.length === 0) {
      return 0;
    }
    return items.map(({ unitPrice, amount }) => unitPrice * amount).reduce((sum, i) => sum + i, 0);
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
    const totalTax = taxes.map((tax => (tax.tax.percentage / 100) * subTotal)).reduce((sum, i) => sum + i, 0);
    return subTotal + totalTax - discount;
  }

  render() {
    const { taxes } = this.props;
    const {
      orderRows, total, subTotal, discount,
    } = this.state;
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
            {orderRows && taxes && (
            <TableBody>
              {orderRows.map(row => (
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
                <TableCell numeric>{ccyFormat(subTotal)}</TableCell>
              </TableRow>
              {taxes.map(tax => (
                <TableRow>
                  <TableCell>{tax.tax.taxName}</TableCell>
                  <TableCell numeric>{`${(tax.tax.percentage).toFixed(0)} %`}</TableCell>
                  <TableCell numeric>{ccyFormat((tax.tax.percentage / 100) * subTotal)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}><h3>Refund Total</h3></TableCell>
                <TableCell numeric><Success><h3>{ccyFormat(total)}</h3></Success></TableCell>
              </TableRow>
            </TableBody>
            )}
          </Table>
        </CardBody>
      </Card>
    );
  }
}
