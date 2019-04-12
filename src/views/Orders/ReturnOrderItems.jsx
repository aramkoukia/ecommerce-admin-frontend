import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Success from '../../components/Typography/Success';

function ccyFormat(num) {
  return `${num.toFixed(2)} $`;
}


function dateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const stringDate = [day, month, year].join('/');
  return `${stringDate} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export default class ReturnOrderItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderRows: [],
      subTotal: 0,
      total: 0,
      totalDiscount: 0,
      restockingFeePercent: 10,
      restockingFeeAmount: 0,
    };
  }

  componentDidMount() {
    const {
      rows, taxes, priceChanged,
    } = this.props;
    this.setState({
      orderRows: rows,
    });

    const { restockingFeePercent } = this.state;
    this.handleQuantityChanged = this.handleQuantityChanged.bind(this);
    this.handleRestockingFeeChanged = this.handleRestockingFeeChanged.bind(this);

    const totalDiscount = this.discount(rows);
    const subTotal = this.subtotal(rows, totalDiscount);
    const restockingFeeAmount = subTotal * restockingFeePercent / 100 * -1;
    const total = this.total(subTotal, taxes, restockingFeeAmount);

    this.setState({
      subTotal,
      total,
      restockingFeeAmount,
      totalDiscount,
    });
    priceChanged(rows, subTotal, total, totalDiscount, restockingFeePercent, restockingFeeAmount);
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleRestockingFeeChanged(event) {
    const { taxes, priceChanged } = this.props;
    const orderRows = this.state.orderRows.slice();
    const totalDiscount = this.discount(orderRows);
    const subTotal = this.subtotal(orderRows, totalDiscount);
    const restockingFeePercent = Number(event.target.value);
    const restockingFeeAmount = subTotal * restockingFeePercent / 100 * -1;
    const total = this.total(subTotal, taxes, restockingFeeAmount);

    this.setState({
      subTotal,
      total,
      totalDiscount,
      restockingFeeAmount,
      restockingFeePercent,
    });

    priceChanged(orderRows, subTotal, total, totalDiscount);
  }

  handleQuantityChanged(event) {
    const { taxes, priceChanged } = this.props;
    const orderRows = this.state.orderRows.slice();
    const { restockingFeePercent } = this.state;
    for (const i in orderRows) {
      if (orderRows[i].productId == event.target.name) {
        orderRows[i].amount = event.target.value;
        orderRows[i].subTotal = event.target.value * orderRows[i].unitPrice * -1;
        let discountAmount = orderRows[i].discountAmount === "" ? 0 : orderRows[i].discountAmount;
        let discountPercent = orderRows[i].discountPercent === "" ? 0 : orderRows[i].discountPercent;
        orderRows[i].totalDiscount = -1 * ((orderRows[i].discountType === 'percent') ? (discountPercent / 100) * orderRows[i].subTotal : Number(discountAmount));
        orderRows[i].total = event.target.value * orderRows[i].unitPrice * -1 + orderRows[i].totalDiscount;
        this.setState({ orderRows });
        break;
      }
    }

    const totalDiscount = this.discount(orderRows);
    const subTotal = this.subtotal(orderRows, totalDiscount);
    const restockingFeeAmount = subTotal * restockingFeePercent / 100 * -1;
    const total = this.total(subTotal, taxes, restockingFeeAmount);
    this.setState({
      subTotal,
      total,
      totalDiscount,
      restockingFeeAmount,
    });

    priceChanged(orderRows, subTotal, total, totalDiscount, restockingFeePercent, restockingFeeAmount);
  }

  subtotal(items, totalDiscount) {
    if(items.length === 0) {
      return 0;
    }
    return items.map(({ total }) => total).reduce((sum, i) => sum + i, 0);
  }

  discount(orderRows) {
    let totalDiscount= 0;
    for(let i in orderRows) {
      totalDiscount += orderRows[i].totalDiscount === "" ? 0 : orderRows[i].totalDiscount;
    }
    return totalDiscount * -1;
  }

  total(subTotal, taxes, restockingFeeAmount) {
    const totalTax = taxes.map(({ tax }) => (tax.percentage / 100) * subTotal).reduce((sum, i) => sum + i, 0);
    return (subTotal + totalTax) + restockingFeeAmount;
  }

  render() {
    const { taxes, order } = this.props;
    const {
      orderRows, total, subTotal, totalDiscount, restockingFeeAmount,
      restockingFeePercent,
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
                <TableCell numeric>Discount</TableCell>
                <TableCell numeric>Discount Amount</TableCell>
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
                  <TableCell>
                    <ToggleButtonGroup
                      hidden
                      name={row.productId}
                      value={row.discountType}
                      exclusive
                      onChange={this.handleDiscountTypeChanged}
                      style={{ width: 50 }}
                    >
                      <ToggleButton value="percent" name={row.productId}>
                        %
                      </ToggleButton>
                      {/* <ToggleButton value="amount" name={row.productId}>
                      $
                    </ToggleButton> */}
                    </ToggleButtonGroup>
                    {row.discountType === 'amount'
                      && (
                      <TextField
                        disabled
                        name={row.productId}
                        value={row.discountAmount}
                        onChange={this.handleDiscountAmountChanged}
                        type="number"
                        style={{ width: 50 }}
                      />
                      )}
                    {row.discountType === 'percent'
                      && (
                      <TextField
                        disabled
                        name={row.productId}
                        value={row.discountPercent}
                        onChange={this.handleDiscountPercentChanged}
                        type="number"
                        style={{ width: 50 }}
                      />
                      )}
                    {' '}
                       %
                  </TableCell>
                  <TableCell numeric>{ccyFormat(row.totalDiscount)}</TableCell>
                  <TableCell numeric>{ccyFormat(row.total)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell rowSpan={6} />
                <TableCell colSpan={3}>Subtotal</TableCell>
                <TableCell numeric>{ccyFormat(subTotal)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}>Total Discount</TableCell>
                <TableCell numeric>{ccyFormat(totalDiscount)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Re-Stocking Fee (%)</b></TableCell>
                <TableCell numeric>
                  <TextField
                    name="restockingFeePercent"
                    value={restockingFeePercent}
                    onChange={this.handleRestockingFeeChanged}
                    type="number"
                    style={{ width: 70 }}
                  />
                  {' '}
%
                </TableCell>
                <TableCell numeric>
                  <b>
                    {ccyFormat(restockingFeeAmount)}
                  </b>
                </TableCell>
              </TableRow>
              {taxes.map(tax => (
                <TableRow>
                  <TableCell>{tax.tax.taxName}</TableCell>
                  <TableCell numeric>{`${(tax.tax.percentage).toFixed(0)} %`}</TableCell>
                  <TableCell numeric>{ccyFormat((tax.tax.percentage / 100) * subTotal)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3}><h4>Refund Total</h4></TableCell>
                <TableCell numeric><Success><h4>{ccyFormat(total)}</h4></Success></TableCell>
              </TableRow>
                {order.orderPayment && order.orderPayment.map(orderPayment => (
                  <TableRow>
                    <TableCell><h4>Payment</h4></TableCell>
                    <TableCell><h4>{dateFormat(orderPayment.paymentDate)}</h4></TableCell>
                    <TableCell><h4>{orderPayment.paymentType.paymentTypeName}</h4></TableCell>
                    <TableCell><h4>{orderPayment.chequeNo}</h4></TableCell>
                    <TableCell numeric><h4>{ccyFormat(orderPayment.paymentAmount)}</h4></TableCell>
                  </TableRow>
                ))}
            </TableBody>
            )}
          </Table>
        </CardBody>
      </Card>
    );
  }
}
