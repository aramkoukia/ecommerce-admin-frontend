import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// core components
import Primary from '../../components/Typography/Primary';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
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

function dateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const stringDate = [day, month, year].join('/');
  return stringDate;
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
