import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

function ccyFormat(num) {
  return `${num.toFixed(2)} $`;
}

const style = {
};

class TaxesTable extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.handleTaxNameChange = this.handleTaxNameChange.bind(this);
    this.handleTaxPercentChange = this.handleTaxPercentChange.bind(this);
  }

  handleTaxPercentChange(event) {
    this.props.taxPercentChanged(Number(event.target.value));
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleTaxNameChange(event) {
    this.props.taxNameChanged(event.target.value);
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const { taxes, subTotal, noTaxForLocation } = this.props;
    if (noTaxForLocation) {
      return (taxes && taxes.length > 0 && taxes.map((tax) => (
        <TableRow>
        <TableCell colspan={4}></TableCell>
          <TableCell colspan={2} align="right">
            <TextField
              name="taxName"
              value={tax.taxName}
              onChange={this.handleTaxNameChange}
              type="string"
              style={{ width: 200 }}
            />
          </TableCell>
          <TableCell align="right">
            <TextField
              name="taxPerent"
              value={tax.percentage}
              onChange={this.handleTaxPercentChange}
              type="number"
              style={{ width: 70 }}
            />
            {' %'}
          </TableCell>
          <TableCell numeric align="right" colspan={2}>{ccyFormat((Number(tax.percentage) / 100) * Number(subTotal))}</TableCell>
      </TableRow>)))
    }
    else {
      return (taxes && taxes.length > 0 && taxes.map((tax) => (
        <TableRow>
          <TableCell colspan={4}></TableCell>
          <TableCell align="right" colspan={2}>{tax.taxName}</TableCell>
          <TableCell align="right" numeric>{`${(tax.percentage).toFixed(2)} %`}</TableCell>
          <TableCell align="right" numeric>{ccyFormat((tax.percentage / 100) * subTotal)}</TableCell>
        </TableRow>
      ))
      )
    }
  }
}

TaxesTable.propTypes = {
  taxPercentChanged: PropTypes.func,
};

export default withStyles(style)(TaxesTable);
