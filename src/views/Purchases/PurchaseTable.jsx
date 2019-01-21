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

export default class PurchaseTable extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      purchaseRows: [],
      subTotal: 0,
      total: 0,
    };
  }

  componentDidMount() {
    const { rows } = this.props;
    this.setState({
      purchaseRows: rows
    });

    this.handleQuantityChanged = this.handleQuantityChanged.bind(this);
    this.handleUnitPriceChanged = this.handleUnitPriceChanged.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    const { rows, taxes, priceChanged } = this.props;
    if (rows.length !== prevProps.rows.length
        || JSON.stringify(prevProps.rows) !== JSON.stringify(rows)) {
      let purchaseRows = rows.slice();
      const subTotal = this.subtotal(purchaseRows);
      const total = this.total(subTotal);
      this.setState({
        purchaseRows: rows,
        subTotal: subTotal,
        total: total,  
      });
      priceChanged(subTotal, total);
    }
  }

  handleUnitPriceChanged(event) {
    let { priceChanged } = this.props;
    let purchaseRows = this.state.purchaseRows.slice();
    for(let i in purchaseRows) {
      if(purchaseRows[i].productId == event.target.name) {
          purchaseRows[i].unitPrice = event.target.value;
          this.setState ({purchaseRows});
          break;
      }
    }

    const subTotal = this.subtotal(purchaseRows);
    const total = this.total(subTotal);
    this.setState(
      {
        subTotal: subTotal,
        total: total,
      }
    )

    priceChanged(subTotal, total);
  }

  handleQuantityChanged(event) {
    let { priceChanged } = this.props;
    let purchaseRows = this.state.purchaseRows.slice();
    for(let i in purchaseRows) {
        if(purchaseRows[i].productId == event.target.name){
          purchaseRows[i].qty = event.target.value;
          // purchaseRows[i].unitPrice = event.target.value;
          this.setState ({purchaseRows});
          break;
        }
    }

    const subTotal = this.subtotal(purchaseRows);
    const total = this.total(subTotal);
    this.setState(
      {
        subTotal: subTotal,
        total: total,
      }
    )

    priceChanged(subTotal, total);
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
    return items.map(({ unitPrice, qty }) => unitPrice * qty).reduce((sum, i) => sum + i, 0);
  }

  total(subTotal) {
    return subTotal;
  }

  render() {
    const { purchaseRows, total, subTotal } = this.state;

    return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell numeric>Amount</TableCell>
            <TableCell numeric>Unit Price</TableCell>
            <TableCell numeric>Total Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {purchaseRows.map(row => {
            return (
              <TableRow key={row.productId}>
                <TableCell>{row.productName}</TableCell>
                <TableCell numeric align="right">
                  <TextField
                        name={row.productId}
                        value={row.qty}
                        onChange={this.handleQuantityChanged}
                        type="number"
                      />
                </TableCell>
                <TableCell numeric align="right">
                  <TextField
                        name={row.productId}
                        value={row.unitPrice}
                        onChange={this.handleUnitPriceChanged}
                        type="number"
                      />
                </TableCell>
                <TableCell numeric>{this.ccyFormat(row.unitPrice * row.qty)}</TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell rowSpan={5} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell numeric>{this.ccyFormat(subTotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}><h3>Total</h3></TableCell>
            <TableCell numeric><Success><h3>{this.ccyFormat(total)}</h3></Success></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
    );
  }
}
