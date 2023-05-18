/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Success from '../../components/Typography/Success';


export default class OrderTable extends React.Component {
  state = {
    orderRows: [],
    subTotal: 0,
    total: 0,
    totalDiscount: 0,
  };

  componentDidMount() {
    const { rows } = this.props;
    this.setState({
      orderRows: rows,
    });

    this.handleQuantityChanged = this.handleQuantityChanged.bind(this);
    this.handleItemNotesChanged = this.handleItemNotesChanged.bind(this);
    this.handleSalePriceChanged = this.handleSalePriceChanged.bind(this);
    this.handleDiscountAmountChanged = this.handleDiscountAmountChanged.bind(this);
    this.handleDiscountPercentChanged = this.handleDiscountPercentChanged.bind(this);
    this.handleDiscountTypeChanged = this.handleDiscountTypeChanged.bind(this);
    this.handleProductRemoved = this.handleProductRemoved.bind(this);
    this.handleProductPackageChanged = this.handleProductPackageChanged.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    const { rows, taxes, priceChanged } = this.props;
    if (rows.length !== prevProps.rows.length
        || JSON.stringify(prevProps.rows) !== JSON.stringify(rows)
        || taxes.length !== prevProps.taxes.length) {
      const orderRows = rows.slice();
      const totalDiscount = this.discount(orderRows);
      const subTotal = this.subtotal(orderRows, totalDiscount);
      const total = this.total(subTotal, taxes);
      this.setState({
        orderRows: rows,
        subTotal,
        total,
        totalDiscount,
      });

      priceChanged(subTotal, total, totalDiscount);
    }
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  }

  handleDiscountTypeChanged(event) {
    const orderRows = this.state.orderRows.slice();
    const { taxes, priceChanged } = this.props;
    for (const i in orderRows) {
      if (orderRows[i].id == event.target.name) {
        orderRows[i].discountType = event.target.value;
        this.setState({ orderRows });
        break;
      }
    }
    const totalDiscount = this.discount(orderRows);
    const subTotal = this.subtotal(orderRows, totalDiscount);
    const total = this.total(subTotal, taxes);
    this.setState(
      {
        subTotal,
        total,
        totalDiscount,
      },
    );

    priceChanged(subTotal, total, totalDiscount);
  }

  handleItemNotesChanged(event) {
    const { orderRows } = this.state;
    for (const i in orderRows) {
      if (orderRows[i].id == event.target.name) {
        orderRows[i].itemNotes = event.target.value;
        this.setState({ orderRows });
        break;
      }
    }
  }

  handleQuantityChanged(event) {
    const { taxes, priceChanged } = this.props;
    const { orderRows } = this.state;
    for (const i in orderRows) {
      if (orderRows[i].id == event.target.name) {
        orderRows[i].qty = event.target.value;
        orderRows[i].total = event.target.value * orderRows[i].salesPrice;
        this.setState({ orderRows });
        break;
      }
    }

    const totalDiscount = this.discount(orderRows);
    const subTotal = this.subtotal(orderRows, totalDiscount);
    const total = this.total(subTotal, taxes);
    this.setState({
      subTotal,
      total,
      totalDiscount,
    });

    priceChanged(subTotal, total, totalDiscount);
  }

  handleProductPackageChanged(event) {
    const { taxes, priceChanged } = this.props;
    const { orderRows } = this.state;
    for (const i in orderRows) {
      if (orderRows[i].id == event.target.name) {
        const rowProductPackage = orderRows[i].productPackages.find(
          (p) => p.productPackageId === event.target.value,
        );
        orderRows[i].salesPrice = rowProductPackage.packagePrice;
        orderRows[i].productPackageId = event.target.value;
        orderRows[i].total = orderRows[i].qty * orderRows[i].salesPrice;
        orderRows[i].package = rowProductPackage.package;
        orderRows[i].amountInMainPackage = rowProductPackage.amountInMainPackage;
        this.setState({ orderRows });
        break;
      }
    }

    const totalDiscount = this.discount(orderRows);
    const subTotal = this.subtotal(orderRows, totalDiscount);
    const total = this.total(subTotal, taxes);
    this.setState({
      subTotal,
      total,
      totalDiscount,
    });

    priceChanged(subTotal, total, totalDiscount);
  }

  handleSalePriceChanged(event) {
    const { taxes, priceChanged } = this.props;
    const { orderRows } = this.state;
    for (const i in orderRows) {
      if (orderRows[i].id == event.target.name) {
        orderRows[i].salesPrice = event.target.value;
        orderRows[i].total = event.target.value * orderRows[i].qty;
        this.setState({ orderRows });
        break;
      }
    }

    const totalDiscount = this.discount(orderRows);
    const subTotal = this.subtotal(orderRows, totalDiscount);
    const total = this.total(subTotal, taxes);
    this.setState({
      subTotal,
      total,
      totalDiscount,
    });

    priceChanged(subTotal, total, totalDiscount);
  }

  handleDiscountAmountChanged(event) {
    const { taxes, priceChanged } = this.props;
    const orderRows = this.state.orderRows.slice();
    for (const i in orderRows) {
      if (orderRows[i].id == event.target.name) {
        orderRows[i].discountAmount = event.target.value;
        orderRows[i].discountPercent = 0;
        this.setState({ orderRows });
        break;
      }
    }

    const totalDiscount = this.discount(orderRows);
    const subTotal = this.subtotal(orderRows, totalDiscount);
    const total = this.total(subTotal, taxes);
    this.setState(
      {
        subTotal,
        total,
        totalDiscount,
      },
    );

    priceChanged(subTotal, total, totalDiscount);
  }

  handleDiscountPercentChanged(event) {
    const { taxes, priceChanged } = this.props;
    const orderRows = this.state.orderRows.slice();
    for (const i in orderRows) {
      if (orderRows[i].id == event.target.name) {
        orderRows[i].discountAmount = 0;
        orderRows[i].discountPercent = event.target.value;
        this.setState({ orderRows });
        break;
      }
    }

    const totalDiscount = this.discount(orderRows);
    const subTotal = this.subtotal(orderRows, totalDiscount);
    const total = this.total(subTotal, taxes);
    this.setState(
      {
        subTotal,
        total,
        totalDiscount,
      },
    );

    priceChanged(subTotal, total, totalDiscount);
  }

  handleProductRemoved(event) {
    const { productRemoved } = this.props;
    productRemoved(Number(event.currentTarget.name));
  }

  ccyFormat(num) {
    return `${num.toFixed(2)} $`;
  }

  subtotal(items, totalDiscount) {
    if (items.length === 0) {
      return 0;
    }

    const subTotal = items.map(({ salesPrice, qty }) => salesPrice * qty).reduce((sum, i) => sum + i, 0);
    return subTotal - totalDiscount;
  }

  discount(orderRows) {
    let totalDiscount = 0;
    for (const i in orderRows) {
      const discountAmount = orderRows[i].discountAmount === '' ? 0 : orderRows[i].discountAmount;
      const discountPercent = orderRows[i].discountPercent === '' ? 0 : orderRows[i].discountPercent;
      totalDiscount += (orderRows[i].discountType === 'percent')
        ? (discountPercent / 100) * orderRows[i].total : Number(discountAmount);
    }
    return totalDiscount;
  }

  total(subTotal, taxes) {
    if (taxes) {
      const totalTax = taxes.map(({ percentage }) => (percentage / 100) * subTotal).reduce((sum, i) => sum + i, 0);
      return subTotal + totalTax;
    }
    return 0;
  }

  render() {
    const { taxes } = this.props;
    const {
      orderRows, total, subTotal, totalDiscount,
    } = this.state;

    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell />
              <TableCell>Amount</TableCell>
              <TableCell numeric>Unit Price ($)</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell />
              <TableCell numeric>Total Price ($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderRows
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell size="small">
                    <IconButton
                      aria-label="Delete"
                      name={row.id}
                      onClick={this.handleProductRemoved}
                    >
                      <DeleteIcon
                        name={row.id}
                        fontSize="small"
                      />
                    </IconButton>
                    {row.productName}
                    <br />
                    <TextField
                      multiline
                      rowsMax={3}
                      name={row.id}
                      label="Notes"
                      type="text"
                      onChange={this.handleItemNotesChanged}
                      value={row.itemNotes}
                      fullWidth="true"
                    />
                  </TableCell>
                  <TableCell size="small">
                    {row.productPackages && row.productPackages.length !== 0 && (
                    <FormControl>
                      <Select
                        value={row.productPackageId}
                        name={row.id}
                        onChange={this.handleProductPackageChanged}
                        input={<Input name="variations" id="variations" />}
                        fullWidth="true"
                      >
                        {
                        row.productPackages.map((l, key) => (
                          <MenuItem name={key} value={l.productPackageId}>
                            {l.package}
                            {' ('}
                            {l.amountInMainPackage}
                            {'x)'}
                          </MenuItem>
                        ))
                      }
                      </Select>
                    </FormControl>
                    )}
                  </TableCell>
                  <TableCell size="small">
                    <TextField
                      name={row.id}
                      value={row.qty}
                      onChange={this.handleQuantityChanged}
                      type="number"
                      style={{ width: 70 }}
                    />
                  </TableCell>
                  <TableCell size="small" numeric>
                    <TextField
                      name={row.id}
                      value={row.salesPrice}
                      onChange={this.handleSalePriceChanged}
                      type="number"
                      style={{ width: 70 }}
                    />
                  </TableCell>
                  <TableCell
                    style={{ width: 50 }}
                    size="small"
                  >
                    { row.discountType === 'amount'
                  && (
                  <div>
                    <TextField
                      name={row.id}
                      value={row.discountAmount}
                      onChange={this.handleDiscountAmountChanged}
                      type="number"
                      style={{ width: 50 }}
                    />
                  </div>
                  )}
                    { row.discountType === 'percent'
                  && (
                  <div>
                    <TextField
                      name={row.id}
                      value={row.discountPercent}
                      onChange={this.handleDiscountPercentChanged}
                      type="number"
                      style={{ width: 50 }}
                    />
                  </div>
                  )}
                  </TableCell>
                  <TableCell size="small">
                    <FormControlLabel
                      value="end"
                      control={(
                        <Radio
                          checked={row.discountType === 'percent'}
                          onChange={this.handleDiscountTypeChanged}
                          value="percent"
                          name={row.id}
                          aria-label="B"
                        />
                    )}
                      label="%"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="end"
                      control={(
                        <Radio
                          checked={row.discountType === 'amount'}
                          onChange={this.handleDiscountTypeChanged}
                          value="amount"
                          name={row.id}
                          aria-label="B"
                        />
                    )}
                      label="$"
                      labelPlacement="end"
                    />
                  </TableCell>
                  <TableCell size="small" numeric>{this.ccyFormat(row.salesPrice * row.qty)}</TableCell>
                </TableRow>
              ))}
            <TableRow style={{ 'background-color': 'lightgray' }}>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell>Total Discount</TableCell>
              <TableCell />
              <TableCell numeric>{this.ccyFormat(totalDiscount)}</TableCell>
            </TableRow>
            <TableRow style={{ 'background-color': 'lightgray' }}>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell>Subtotal</TableCell>
              <TableCell />
              <TableCell numeric>{this.ccyFormat(subTotal)}</TableCell>
            </TableRow>
            {taxes && taxes.map((tax) => (
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell>{tax.taxName}</TableCell>
                <TableCell numeric>{`${(tax.percentage).toFixed(0)} %`}</TableCell>
                <TableCell numeric>{this.ccyFormat((tax.percentage / 100) * subTotal)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell><h3>Total</h3></TableCell>
              <TableCell />
              <TableCell numeric><Success><h3>{this.ccyFormat(total)}</h3></Success></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

OrderTable.propTypes = {
  taxes: PropTypes.object.isRequired,
  rows: PropTypes.object.isRequired,
  priceChanged: PropTypes.func.isRequired,
};
