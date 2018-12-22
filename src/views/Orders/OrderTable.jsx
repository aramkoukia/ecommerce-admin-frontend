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

const TAX_RATE = 0.07;

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

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(id, desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { id, desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  ["Paperclips (Box)", 100, 1.15],
  ["Paper (Case)", 10, 45.99],
  ["Waste Basket", 2, 17.99]
].map((row, id) => createRow(id, ...row));

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

function OrderTable(props) {
  const { classes } = props;
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
                <TableCell numeric>{ccyFormat(row.price)}</TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell rowSpan={5} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell numeric>{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>GST Tax</TableCell>
            <TableCell numeric>{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
            <TableCell numeric>{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>PST Tax</TableCell>
            <TableCell numeric>{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
            <TableCell numeric>{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Discount</TableCell>
            <TableCell numeric>{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
            <TableCell numeric>{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell numeric>{ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

OrderTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OrderTable);
