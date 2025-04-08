/* eslint-disable react/prop-types */
import React from 'react';
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
import TaxesTable from './TaxesTable';

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
  state = {
    orderRows: [],
    subTotal: 0,
    total: 0,
    totalDiscount: 0,
    restockingFeePercent: 10,
    restockingFeeAmount: 0,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      rows, taxes, priceChanged,
    } = this.props;

    const orderRows = rows;

    orderRows.forEach((row, index) => {
      row.id = index;
    });

    this.setState({
      orderRows,
    });

    const { restockingFeePercent } = this.state;
    this.handleQuantityChanged = this.handleQuantityChanged.bind(this);
    this.handleRestockingFeeChanged = this.handleRestockingFeeChanged.bind(this);
    this.taxPercentChanged = this.taxPercentChanged.bind(this);
    this.taxNameChanged = this.taxNameChanged.bind(this);

    const totalDiscount = this.discount(rows);
    const subTotal = this.subtotal(rows, totalDiscount);
    const multiplier = subTotal > 0 ? -1 : 1;
    const restockingFeeAmount = Math.abs((subTotal * restockingFeePercent) / 100) * multiplier;
    const total = this.total(subTotal, taxes, restockingFeeAmount);

    this.setState({
      subTotal,
      total,
      restockingFeeAmount,
      totalDiscount,
    });
    priceChanged(rows, subTotal, total, totalDiscount, restockingFeePercent, restockingFeeAmount);
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  }

  taxPercentChanged(taxPercent) {
    this.props.taxPercentChanged(taxPercent);
  }

  taxNameChanged(taxPercent) {
    this.props.taxNameChanged(taxPercent);
  }

  handleRestockingFeeChanged(event) {
    const { taxes, priceChanged } = this.props;
    const orderRows = this.state.orderRows.slice();
    const totalDiscount = this.discount(orderRows);
    const subTotal = this.subtotal(orderRows, totalDiscount);
    const restockingFeePercent = Number(event.target.value);
    const multiplier = subTotal > 0 ? -1 : 1;
    const restockingFeeAmount = Math.abs((subTotal * restockingFeePercent) / 100) * multiplier;
    const total = this.total(subTotal, taxes, restockingFeeAmount);

    this.setState({
      subTotal,
      total,
      totalDiscount,
      restockingFeePercent,
      restockingFeeAmount,
    });

    priceChanged(orderRows, subTotal, total, totalDiscount,
      restockingFeePercent, restockingFeeAmount);
  }

  handleQuantityChanged(event) {
    const { taxes, priceChanged } = this.props;
    const orderRows = this.state.orderRows.slice();
    const { restockingFeePercent } = this.state;
    for (const i in orderRows) {
      if (orderRows[i].id == event.target.name) {
        if (event.target.value < 0) {
          event.target.value = event.target.value * -1;
        }
        orderRows[i].amount = event.target.value;
        orderRows[i].subTotal = event.target.value * orderRows[i].unitPrice * -1;
        const discountAmount = orderRows[i].discountAmount === '' ? 0 : orderRows[i].discountAmount;
        const discountPercent = orderRows[i].discountPercent === '' ? 0 : orderRows[i].discountPercent;
        orderRows[i].totalDiscount = Math.abs((orderRows[i].discountType === 'percent')
          ? (discountPercent / 100) * orderRows[i].subTotal
          : Number(discountAmount));
        orderRows[i].total = event.target.value * orderRows[i].unitPrice * -1 + orderRows[i].totalDiscount;
        this.setState({ orderRows });
        break;
      }
    }

    const totalDiscount = this.discount(orderRows);
    const subTotal = this.subtotal(orderRows, totalDiscount);
    const multiplier = subTotal > 0 ? -1 : 1;
    const restockingFeeAmount = Math.abs((subTotal * restockingFeePercent) / 100) * multiplier;
    const total = this.total(subTotal, taxes, restockingFeeAmount);
    this.setState({
      subTotal,
      total,
      totalDiscount,
      restockingFeeAmount,
    });

    priceChanged(orderRows, subTotal, total, totalDiscount,
      restockingFeePercent, restockingFeeAmount);
  }

  subtotal(items, totalDiscount) {
    if (items.length === 0) {
      return 0;
    }
    return items.map(({ total }) => total).reduce((sum, i) => sum + i, 0);
  }

  discount(orderRows) {
    let totalDiscount = 0;
    for (const i in orderRows) {
      totalDiscount += orderRows[i].totalDiscount === '' ? 0 : orderRows[i].totalDiscount;
    }
    return totalDiscount;
  }

  total(subTotal, taxes, restockingFeeAmount) {
    const totalTax = taxes.map((tax) => (tax.percentage / 100) * (subTotal + restockingFeeAmount)).reduce((sum, i) => sum + i, 0);
    return (subTotal + totalTax) + restockingFeeAmount;
  }

  render() {
    const { taxes, order, noTaxForLocation } = this.props;
    const {
      orderRows, total, subTotal, totalDiscount,
      restockingFeePercent,
      restockingFeeAmount,
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
                {orderRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {row.product.productName}
                      {row.package && (
                        ` ( pkg: ${row.package} ) ${row.amountInMainPackage}x`
                      )}
                    </TableCell>
                    <TableCell numeric align="right">
                      <TextField
                        name={row.id}
                        value={row.amount}
                        onChange={this.handleQuantityChanged}
                        type="number"
                        inputProps={{
                          min: '0',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" numeric>{ccyFormat(row.unitPrice)}</TableCell>
                    <TableCell align="right">
                      {row.discountType === 'amount'
                        && (
                          <div>
                            <TextField
                              disabled
                              name={row.id}
                              value={row.discountAmount}
                              onChange={this.handleDiscountAmountChanged}
                              type="number"
                              style={{ width: 50 }}
                            />
                            <div>
                              $
                            </div>
                          </div>
                        )}
                      {row.discountType === 'percent'
                        && (
                          <div>
                            <TextField
                              disabled
                              name={row.id}
                              value={row.discountPercent}
                              onChange={this.handleDiscountPercentChanged}
                              type="number"
                              style={{ width: 50 }}
                            />
                            <div>
                              %
                            </div>
                          </div>
                        )}
                    </TableCell>
                    <TableCell align="right" numeric>{ccyFormat(row.totalDiscount)}</TableCell>
                    <TableCell align="right" numeric>{ccyFormat(row.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>)}
          </Table>
          <Table>
            <TableBody>
              <TableRow style={{ 'background-color': 'lightgray' }}>
                <TableCell colSpan={6} align="right">Subtotal (after discount)</TableCell>
                <TableCell colSpan={2} numeric align="right">{ccyFormat(subTotal)}</TableCell>
              </TableRow>
              <TableRow style={{ 'background-color': 'lightgray' }}>
                <TableCell colSpan={6} align="right">Total Discount</TableCell>
                <TableCell colSpan={2} numeric align="right">{ccyFormat(totalDiscount)}</TableCell>
              </TableRow>
              <TableRow style={{ 'background-color': 'lightgray' }}>
                <TableCell colSpan={6} align="right"><b>Re-Stocking Fee (%)</b></TableCell>
                <TableCell colSpan={1} numeric align="right">
                  <TextField
                    name="restockingFeePercent"
                    value={restockingFeePercent}
                    onChange={this.handleRestockingFeeChanged}
                    type="number"
                    style={{ width: 70 }}
                  />
                  {' %'}
                </TableCell>
                <TableCell numeric align="right">
                  <b>
                    {ccyFormat(restockingFeeAmount)}
                  </b>
                </TableCell>
              </TableRow>

              <TaxesTable
                taxes={taxes}
                subTotal={subTotal}
                taxPercentChanged={this.taxPercentChanged}
                taxNameChanged={this.taxNameChanged}
                noTaxForLocation={noTaxForLocation}
              />

              <TableRow>
                <TableCell colSpan={6} align="right"><h4>Refund Total</h4></TableCell>
                <TableCell colSpan={2} numeric align="right"><Success><h4>{ccyFormat(total)}</h4></Success></TableCell>
              </TableRow>
                {order.orderPayment && order.orderPayment.map((orderPayment) => (
                  <TableRow>
                    <TableCell colSpan={4} align="right"><h4>Payment</h4></TableCell>
                    <TableCell align="right"><h4>{dateFormat(orderPayment.paymentDate)}</h4></TableCell>
                    <TableCell align="right"><h4>{orderPayment.paymentType.paymentTypeName}</h4></TableCell>
                    <TableCell align="right"><h4>{orderPayment.chequeNo}</h4></TableCell>
                    <TableCell align="right" numeric><h4>{ccyFormat(orderPayment.paymentAmount)}</h4></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    );
  }
}
