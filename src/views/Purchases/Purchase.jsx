import React from 'react';
import Check from '@material-ui/icons/Check';
// @material-ui/core components
import { withStyles } from '@material-ui/core/styles';
// core components
import GridItem from 'components/Grid/GridItem.jsx';
import GridContainer from 'components/Grid/GridContainer.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import Card from 'components/Card/Card.jsx';
import CardHeader from 'components/Card/CardHeader.jsx';
import CardBody from 'components/Card/CardBody.jsx';
import CardFooter from 'components/Card/CardFooter.jsx';
import PropTypes from 'prop-types';
import Snackbar from 'components/Snackbar/Snackbar.jsx';
import PurchaseNotes from './PurchaseNotes';
import PurchaseItems from './PurchaseItems';

import PurchaseService from '../../services/PurchaseService';

const styles = {
  chip: {
    margin: 5,
  },
};

function dateFormat(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export class Purchase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      purchase: null,
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      loading: false,
    };
  }

  async componentDidMount() {
    const purchaseId = this.props.match.params.id;
    const purchase = await PurchaseService.getPurchaseDetail(purchaseId);
    this.setState({
      purchase,
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const {
      purchase, openSnackbar, snackbarMessage, snackbarColor, loading,
    } = this.state;

    return (
      <div>
        { purchase && (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div>
                  Purchase #
                  {' '}
                  <b>{purchase.purchaseId}</b>
                  &nbsp;&nbsp; {dateFormat(purchase.purchaseDate)}
                </div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12}>
                    <PurchaseItems purchase={purchase} />
                  </GridItem>
                  <GridItem xs={4}>
                    <PurchaseNotes purchase={purchase} />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter />
            </Card>
            <Snackbar
              place="tl"
              color={snackbarColor}
              icon={Check}
              message={snackbarMessage}
              open={openSnackbar}
              closeNotification={() => this.setState({ openSnackbar: false })}
              close
            />
          </GridItem>
        </GridContainer>
        ) }
      </div>
    );
  }
}

Purchase.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Purchase);
