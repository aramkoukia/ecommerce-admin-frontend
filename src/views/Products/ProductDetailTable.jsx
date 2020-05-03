import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function ProductDetailTable({ ...props }) {
  const {
    product,
  } = props;
  return (
    <>
      <Table size="small" style={{ backgroundColor: '#DFEDFC' }}>
        <TableHead>
          <TableRow>
            <TableCell>Product Type</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell numeric>Sale Price</TableCell>
            <TableCell numeric>Total Balance</TableCell>
            <TableCell numeric>Total On Hold</TableCell>
            <TableCell>Disabled</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{product.productTypeName}</TableCell>
            <TableCell>{product.productCode}</TableCell>
            <TableCell>{product.productName}</TableCell>
            <TableCell numeric>{product.salesPrice}</TableCell>
            <TableCell numeric>{product.balance}</TableCell>
            <TableCell numeric>{product.onHoldAmount}</TableCell>
            <TableCell>{product.disabled}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table size="small" style={{ backgroundColor: '#DFFCF7' }}>
        <TableHead>
          <TableRow>
            <TableCell>Location</TableCell>
            <TableCell numeric>Balance</TableCell>
            <TableCell numeric>On Hold</TableCell>
            <TableCell numeric>Bin Code</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {product.inventory.map((row) => (
            <TableRow key={row.productId}>
              <TableCell>{row.locationName}</TableCell>
              <TableCell numeric>{row.balance}</TableCell>
              <TableCell numeric>{row.onHoldAmount}</TableCell>
              <TableCell>{row.binCode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

ProductDetailTable.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductDetailTable;
