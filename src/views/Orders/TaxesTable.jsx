import React from 'react';
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
  state = {
    taxPercent: 0,
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
  }

  handleChange = (name) => (event, { newValue }) => {
    this.setState({
      [name]: newValue,
    });
  };

  render() {
    const { taxes, subTotal } = this.props;
    const { taxPercent } = this.state;
    if (taxes && taxes.length === 0) {
      return (<TableRow>
        <TableCell colspan={4}></TableCell>
        <TableCell colspan={2} align="right">Sales Tax</TableCell>
        <TableCell align="right">
          <TextField
            name="taxPerent"
            value={taxPercent}
            onChange={this.handleChange}
            type="number"
            style={{ width: 70 }}
          />
          {' %'}
        </TableCell>
        <TableCell numeric align="right" colspan={2}>{ccyFormat((Number(taxPercent) / 100) * Number(subTotal))}</TableCell>
      </TableRow>)
    }
    else {
      return (taxes && taxes.map((tax) => (
        <TableRow>
          <TableCell colspan={4}></TableCell>
          <TableCell align="right" colspan={2}>{tax.taxName}</TableCell>
          <TableCell align="right" numeric>{`${(tax.percentage).toFixed(0)} %`}</TableCell>
          <TableCell align="right" numeric>{ccyFormat((tax.percentage / 100) * subTotal)}</TableCell>
        </TableRow>
      ))
      )
    }
  }
}

export default withStyles(style)(TaxesTable);
