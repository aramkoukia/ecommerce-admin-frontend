import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from '@material-ui/core/TextField';
// import Checkbox from "@material-ui/core/Checkbox";
import Success from "components/Typography/Success.jsx";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

export default class OrderTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderRows: [],
      subTotal: 0,
      total: 0,
      taxes: [],
      discount: 0,
      discountAmount: 0,
      discountPercentage: 0,
      totalDicount: 0,
      discountType: "percent",
    };
  }

  componentDidMount() {
    const { rows } = this.props;
    this.setState({
      orderRows: rows
    });

    this.handleQuantityChanged = this.handleQuantityChanged.bind(this);
    this.handleDiscountChanged = this.handleDiscountChanged.bind(this);
    this.handleDiscountTypeChanged = this.handleDiscountTypeChanged.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    const { rows, taxes, priceChanged } = this.props;
    if (rows.length !== prevProps.rows.length) {
      let { discountAmount, discountPercentage } = this.state;
      let orderRows = rows.slice();
      const subTotal = this.subtotal(orderRows);
      const discount = this.discount(subTotal, discountAmount, discountPercentage);
      const total = this.total(subTotal, discount, taxes);
      this.setState({
          orderRows: rows,
          subTotal: subTotal,
          total: total,  
          discount: discount,
      });

      priceChanged(subTotal, total, discount, discountPercentage, discountAmount);
    }
  }

  handleDiscountTypeChanged(event, discountType) {
    this.setState({ discountType });
  } 

  handleQuantityChanged(event) {
    let { discountAmount, discountPercentage, discountType } = this.state;
    let { taxes, priceChanged } = this.props;
    let orderRows = this.state.orderRows.slice();
    for(let i in orderRows) {
        if(orderRows[i].productId == event.target.name){
          orderRows[i].qty = event.target.value;
          this.setState ({orderRows});
          break;
        }
    }

    const subTotal = this.subtotal(orderRows);
    const discount = this.discount(subTotal, discountAmount, discountPercentage);
    const total = this.total(subTotal, discount, taxes);
    this.setState(
      {
        subTotal: subTotal,
        total: total,  
        discount: discount,
      }
    )

    priceChanged(subTotal, total, discount, discountPercentage, discountAmount);
  }

  handleDiscountChanged(event) {
    let { discountAmount, discountPercentage } = this.state;
    let { taxes, priceChanged } = this.props;
    let orderRows = this.state.orderRows.slice();
    for(let i in orderRows) {
        if(orderRows[i].productId == event.target.name){
          orderRows[i].qty = event.target.value;
          this.setState ({orderRows});
          break;
        }
    }

    const subTotal = this.subtotal(orderRows);
    const discount = this.discount(subTotal, discountAmount, discountPercentage);
    const total = this.total(subTotal, discount, taxes);
    this.setState(
      {
        subTotal: subTotal,
        total: total,  
        discount: discount,
      }
    )

    priceChanged(subTotal, total, discount, discountPercentage, discountAmount);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  ccyFormat(num) {
    return `${num.toFixed(2)} $`;
  }

  subtotal(items) {
    if(items.length === 0) {
      return 0;
    }
    return items.map(({ salesPrice, qty }) => salesPrice * qty).reduce((sum, i) => sum + i, 0);
  }

  discount(subtotal, discountAmount, discountPercentage) {
    let invoiceDiscount= 0;
    if(discountPercentage > 0) {
      invoiceDiscount = (discountPercentage / 100) * subtotal;
    } else if(discountAmount > 0) {
      invoiceDiscount = discountAmount;
    }
    return invoiceDiscount;
  }

  total(subTotal, discount, taxes) {
    const totalTax = taxes.map(({ percentage }) => (percentage / 100) * subTotal).reduce((sum, i) => sum + i, 0);
    return subTotal + totalTax - discount;
  }

  render() {
    const { taxes } = this.props;
    const { orderRows, total, subTotal, totalDicount, discountType } = this.state;

    return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell numeric>Amount</TableCell>
            <TableCell numeric>Unit Price</TableCell>
            <TableCell numeric>Discount</TableCell>
            <TableCell numeric>Total Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderRows.map(row => {
            return (
              <TableRow key={row.productId}>
                <TableCell>{row.productName}</TableCell>
                <TableCell numeric align="right">
                <TextField
                      name={row.productId}
                      value={row.qty}
                      onChange={this.handleQuantityChanged}
                      type="number"
                      style = {{width: 100}}
                    />
                </TableCell>                
                <TableCell numeric>{this.ccyFormat(row.salesPrice)}</TableCell>
                <TableCell numeric align="right">
                  <ToggleButtonGroup 
                    value={discountType} 
                    exclusive 
                    onChange={this.handleDiscountTypeChanged}
                    style = {{width: 100}}>
                    <ToggleButton value="percent">
                      %
                    </ToggleButton>
                    <ToggleButton value="amount">
                      $
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <TextField
                    name={row.productId}
                    value={row.discount}
                    onChange={this.handleDiscountChanged}
                    type="number"
                    style = {{width: 100}}
                  />                  
                </TableCell>                
                <TableCell numeric>{this.ccyFormat(row.salesPrice * row.qty)}</TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell rowSpan={4} />
            <TableCell colSpan={3}>Total Discount</TableCell>
            <TableCell numeric>{this.ccyFormat(totalDicount)}</TableCell>
          </TableRow>          
          <TableRow>
            <TableCell colSpan={3}>Subtotal</TableCell>
            <TableCell numeric>{this.ccyFormat(subTotal)}</TableCell>
          </TableRow>
          {taxes.map((tax) =>
            <TableRow>
              <TableCell>{tax.taxName}</TableCell>
              <TableCell numeric>{`${(tax.percentage).toFixed(0)} %`}</TableCell>
              <TableCell numeric>{this.ccyFormat((tax.percentage / 100) * subTotal)}</TableCell>
            </TableRow>
          )}

          {/* <TableRow>
            <TableCell>Discount</TableCell>
            <TableCell numeric> 
            </TableCell>
            <TableCell numeric>{this.ccyFormat(discount)}</TableCell>
          </TableRow> */}

          <TableRow>
            <TableCell colSpan={3}><h3>Total</h3></TableCell>
            <TableCell numeric><Success><h3>{this.ccyFormat(total)}</h3></Success></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
    );
  }
}
