import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// core components
import Primary from 'components/Typography/Primary.jsx';
import Card from 'components/Card/Card.jsx';
import CardHeader from 'components/Card/CardHeader.jsx';
import CardBody from 'components/Card/CardBody.jsx';

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
function OrderNotes(props) {
  const { classes, order } = props;
  return (
    <Card>
      <CardHeader color="info">
        <div className={classes.cardTitleWhite}>Order Info</div>
      </CardHeader>
      <CardBody>
        <h6>Notes:</h6>
        <Primary>
          {' '}
          { order.notes }
          {' '}
        </Primary>

        <h6>PO Number:</h6>
        <Primary>
          {' '}
          { order.poNumber }
          {' '}
        </Primary>
      </CardBody>
    </Card>
  );
}

export default withStyles(style)(OrderNotes);
