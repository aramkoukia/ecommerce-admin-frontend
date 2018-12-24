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

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
  },
  table: {
    minWidth: 700
  }
});

export class OrderTable extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      orderRows: [],
      subTotal: 0,
      total: 0,
      discountAmount: 0,
      discountPercentage: 0,
    };
  }

  componentDidMount() {
    const { rows } = this.props;
    this.setState({
      orderRows: rows
    });

    this.handleQuantityChanged = this.handleQuantityChanged.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    const { rows } = this.props;
    if (this.props.rows.length !== prevProps.rows.length) {
      this.setState({
        orderRows: rows
      });
    }
  }

  handleQuantityChanged(event) {
    // let { orderRows } = this.state;
    let orderRows = this.state.orderRows.slice();
    for(let i in orderRows) {
        if(orderRows[i].productId == event.target.name){
          orderRows[i].qty = event.target.value;
          this.setState ({orderRows});
          break;
        }
    }

    const subtotal = this.subtotal(orderRows);

    this.setState(
      {
        subTotal: subtotal,
        total: subtotal,  // TODO, calculate tax and discount
      }
    )
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
    return items.map(({ salesPrice, qty }) => salesPrice * qty).reduce((sum, i) => sum + i, 0);
  }

  render() {
    const { classes, discountPercent, discountAmount, taxes } = this.props;

    const { orderRows, total, subTotal } = this.state;

    let invoiceDiscount = 0; 
    if(discountPercent > 0) {
      invoiceDiscount = discountPercent * subTotal;
    } else if(discountPercent > 0) {
      invoiceDiscount = discountAmount;
    }
    
    // const invoiceTotal = subTotal + gstInvoiceTaxes + pstInvoiceTaxes - invoiceDiscount;

    return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {/* <TableCell padding="checkbox">
              <Checkbox
              // indeterminate={numSelected > 0 && numSelected < rowCount}
              // checked={numSelected === rowCount}
              // onChange={onSelectAllClick}
              />
            </TableCell> */}
            <TableCell>Product</TableCell>
            <TableCell numeric>Amount</TableCell>
            <TableCell numeric>Unit Price</TableCell>
            <TableCell numeric>Total Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderRows.map(row => {
            return (
              <TableRow key={row.productId}>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                  // indeterminate={numSelected > 0 && numSelected < rowCount}
                  // checked={numSelected === rowCount}
                  // onChange={onSelectAllClick}
                  />
                </TableCell> */}
                <TableCell>{row.productName}</TableCell>
                <TableCell numeric align="right">
                <TextField
                      name={row.productId}
                      value={row.qty}
                      onChange={this.handleQuantityChanged}
                      type="number"
                    />
                </TableCell>
                <TableCell numeric>{this.ccyFormat(row.salesPrice)}</TableCell>
                <TableCell numeric>{this.ccyFormat(row.salesPrice * row.qty)}</TableCell>
                {/* <RestoreFromTrash /> */}
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell rowSpan={5} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell numeric>{this.ccyFormat(subTotal)}</TableCell>
          </TableRow>
          {taxes.map((tax) =>
            <TableRow>
              <TableCell>{tax.taxName}</TableCell>
              <TableCell numeric>{`${(tax.percentage * 100).toFixed(0)} %`}</TableCell>
              <TableCell numeric>{this.ccyFormat(tax * subTotal)}</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>Discount</TableCell>
            <TableCell numeric> 
            </TableCell>
            <TableCell numeric>{this.ccyFormat(invoiceDiscount)}</TableCell>
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

OrderTable.propTypes = {
  classes: PropTypes.object.isRequired,
  priceChanged: PropTypes.func,
};

export default withStyles(styles)(OrderTable);
