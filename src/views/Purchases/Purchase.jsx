import React from 'react';
import Check from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import PropTypes from 'prop-types';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import Snackbar from '../../components/Snackbar/Snackbar';
import PurchaseNotes from './PurchaseNotes';
import PurchaseItems from './PurchaseItems';
import PurchaseService from '../../services/PurchaseService';
import Button from '../../components/CustomButtons/Button';

const styles = {
  chip: {
    margin: 5,
  },
};

function dateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const stringDate = [day, month, year].join('/');
  return `${stringDate} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export class Purchase extends React.Component {
  state = {
    purchase: null,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    loading: false,
  };

  constructor(props) {
    super(props);
    this.deletePurchase = this.deletePurchase.bind(this);
    this.editPurchase = this.editPurchase.bind(this);
  }

  async componentDidMount() {
    const purchaseId = this.props.purchaseId || this.props.location.state.purchaseId;
    const purchase = await PurchaseService.getPurchaseDetail(purchaseId);
    this.setState({
      purchase,
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async editPurchase() {
    const { history } = this.props;
    const purchaseId = this.props.purchaseId || this.props.location.state.purchaseId;
    history.push({
      pathname: `/addpurchase/${purchaseId}`,
      state: { purchaseId },
    });
  }

  async deletePurchase() {
    this.setState({
      loading: true,
    });
    const { purchaseId, history } = this.props;
    const result = await PurchaseService.deletePurchase(purchaseId);

    if (result === '') {
      history.push('/purchases/');
    }

    this.setState({
      loading: false,
    });
  }

  render() {
    const {
      purchase,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      loading,
      open,
    } = this.state;

    return (
      <div>
        { purchase && (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div>
                  PO Number:
                  {' '}
                  <b>{purchase.poNumber}</b>
                  &nbsp;&nbsp;
                  Purchase #
                  {' '}
                  <b>{purchase.purchaseId}</b>
                  &nbsp;&nbsp;
                  {' '}
                  {dateFormat(purchase.purchaseDate)}
                </div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12}>
                    <Button color="primary" disabled={loading} onClick={this.handleClickOpen}>Delete Purchase</Button>
                    {'   '}
                    <Button color="info" disabled={loading} onClick={this.editPurchase}>Edit Purchase</Button>
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
            <Dialog
              open={open}
              onClose={this.handleClose}
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this Purchase?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="info">
                  Cancel
                </Button>
                <Button onClick={this.deletePurchase} color="primary" autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </GridItem>
        </GridContainer>
        ) }
      </div>
    );
  }
}

Purchase.propTypes = {
  purchaseId: PropTypes.number.isRequired,
};

export default withStyles(styles)(Purchase);
