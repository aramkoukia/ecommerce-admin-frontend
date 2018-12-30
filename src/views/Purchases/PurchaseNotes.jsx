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

function dateFormat(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()}`;
}

function OrderNotes(props) {
  const { classes, purchase } = props;
  return (
    <Card>
      <CardHeader color="info">
        <div className={classes.cardTitleWhite}>Purchase Info</div>
      </CardHeader>
      <CardBody>
        <h6>Notes:</h6>
        <Primary>
          {' '}
          { purchase.notes }
          {' '}
        </Primary>

        <h6>Supplier:</h6>
        <Primary>
          {' '}
          { purchase.supplier }
          {' '}
        </Primary>

        <h6>Delivery Date:</h6>
        <Primary>
          {' '}
          { dateFormat(purchase.deliveryDate) }
          {' '}
        </Primary>
      </CardBody>
    </Card>
  );
}

export default withStyles(style)(OrderNotes);
