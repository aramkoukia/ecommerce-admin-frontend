import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
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
  constructor(props) {
    super(props);
  }

    ccyFormat(num) {
    return `${num.toFixed(2)}`;
  }

  subtotal(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
  }

  render() {
    const { classes, rows } = this.props;
    const invoiceSubtotal = this.subtotal(rows);
    const invoiceTaxes = TAX_RATE * invoiceSubtotal;
    const invoiceTotal = invoiceTaxes + invoiceSubtotal;
    const TAX_RATE = 0.07;

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
              <TableRow key={row.id}>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                  // indeterminate={numSelected > 0 && numSelected < rowCount}
                  // checked={numSelected === rowCount}
                  // onChange={onSelectAllClick}
                  />
                </TableCell> */}
                <TableCell>{row.desc}</TableCell>
                <TableCell numeric>{row.qty}</TableCell>
                <TableCell numeric>{row.unit}</TableCell>
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
            <TableCell numeric>{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
            <TableCell numeric>{this.ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>PST Tax</TableCell>
            <TableCell numeric>{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
            <TableCell numeric>{this.ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Discount</TableCell>
            <TableCell numeric>{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
            <TableCell numeric>{this.ccyFormat(invoiceTaxes)}</TableCell>
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
