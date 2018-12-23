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
  // constructor(props) {
  //   super(props);
  // }

    ccyFormat(num) {
    return `${num.toFixed(2)} $`;
  }

  subtotal(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
  }

  render() {
    const { classes, rows, discountPercent, discountAmount, gstTax, pstTax } = this.props;
    const invoiceSubtotal = this.subtotal(rows);
    const gstInvoiceTaxes = gstTax * invoiceSubtotal
    const pstInvoiceTaxes = pstTax * invoiceSubtotal;
    let invoiceDiscount = 0; 
    if(discountPercent > 0) {
      invoiceDiscount = discountPercent * invoiceSubtotal;
    } else if(discountPercent > 0) {
      invoiceDiscount = discountAmount;
    }
    
    const invoiceTotal = invoiceSubtotal + gstInvoiceTaxes + pstInvoiceTaxes - invoiceDiscount;

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
            <TableCell numeric>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => {
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
                <TableCell numeric>
                <TextField
                      value={row.qty}
                      // onChange={this.handleChange('age')}
                      type="number"
                    />
                </TableCell>
                <TableCell numeric>{this.ccyFormat(row.salesPrice)}</TableCell>
                <TableCell numeric>{this.ccyFormat(row.price)}</TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell rowSpan={5} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell numeric>{this.ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>GST Tax</TableCell>
            <TableCell numeric>{`${(gstTax * 100).toFixed(0)} %`}</TableCell>
            <TableCell numeric>{this.ccyFormat(gstInvoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>PST Tax</TableCell>
            <TableCell numeric>{`${(pstTax * 100).toFixed(0)} %`}</TableCell>
            <TableCell numeric>{this.ccyFormat(pstInvoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Discount</TableCell>
            <TableCell numeric> 
              {/* {`${(TAX_RATE * 100).toFixed(0)} %`} */}
            </TableCell>
            <TableCell numeric>{this.ccyFormat(invoiceDiscount)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell numeric>{this.ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
    );
  }

}

OrderTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OrderTable);
