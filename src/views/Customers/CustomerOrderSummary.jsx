import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@material-ui/core';
import CardHeader from '../../components/Card/CardHeader';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';

const style = {
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
};
function CustomerOrderSummary(props) {
  const { customerOrderSummary, classes } = props;
  return (
    <Card>
      <CardHeader color="info">
        Orders Summary ( All Time )
      </CardHeader>
      <CardBody>
        { customerOrderSummary && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Order Status</TableCell>
              <TableCell numeric>Order Count</TableCell>
              <TableCell numeric>Sub Total $</TableCell>
              <TableCell numeric>Total $</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customerOrderSummary.map((row) => (
              <TableRow>
                <TableCell>{row.status}</TableCell>
                <TableCell numeric>{row.orderCount}</TableCell>
                <TableCell numeric>{row.orderSubTotal}</TableCell>
                <TableCell numeric>{row.orderTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        ) }
      </CardBody>
    </Card>
  );
}

export default withStyles(style)(CustomerOrderSummary);
