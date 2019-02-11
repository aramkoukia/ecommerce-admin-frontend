import React from 'react';
import TextField from '@material-ui/core/TextField';
import Save from '@material-ui/icons/Save';
import Check from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '../../components/Snackbar/Snackbar';
import Button from '../../components/CustomButtons/Button';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import CardHeader from '../../components/Card/CardHeader';
import OrderService from '../../services/OrderService';

export default class OrderNotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderNotes: '',
      orderPoNumber: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.updateOrderInfo = this.updateOrderInfo.bind(this);
  }

  async componentDidMount() {
    const { order } = this.props;
    this.setState({
      orderNotes: order.notes,
      orderPoNumber: order.poNumber,
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async updateOrderInfo() {
    const { order } = this.props;
    const { orderPoNumber, orderNotes } = this.state;

    this.setState({
      loading: true,
    });

    const orderInfo = {
      poNumber: orderPoNumber,
      notes: orderNotes,
    };

    const result = await OrderService.updateOrderInfo(order.orderId, orderInfo);

    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Order Notes and PO Number was updated successfully!',
        snackbarColor: 'success',
        loading: false,
      });
    }

    this.setState({
      loading: false,
    });
  }

  render() {
    const { orderNotes, orderPoNumber, loading, snackbarColor, snackbarMessage, openSnackbar } = this.state;

    return (
      <Card>
        <CardHeader color="info">
          Order Info
        </CardHeader>
      <CardBody>
      <GridContainer>
      <GridItem md={12}>
         <TextField
            name="orderPoNumber"
            label="PO Number"
            type="text"
            onChange={this.handleChange}
            value={orderPoNumber}
            fullWidth="true"
          /> 
          </GridItem>
        <GridItem  md={12}>
        <TextField
            name="orderNotes"
            label="Notes"
            type="text"
            onChange={this.handleChange}
            value={orderNotes}
            multiline="true"
            rows="3"
            fullWidth="true"
          />
          </GridItem>
          <GridItem  md={12}>
            <Button color="primary" onClick={this.updateOrderInfo}>
              <Save />
               &nbsp;
               Save
             </Button>
          </GridItem> 
          <GridItem xs>
            { loading && <CircularProgress /> }
          </GridItem>          
          </GridContainer>
          <Snackbar
              place="tl"
              color={snackbarColor}
              icon={Check}
              message={snackbarMessage}
              open={openSnackbar}
              closeNotification={() => this.setState({ openSnackbar: false })}
              close
            />
      </CardBody>
    </Card>
    );
  }
}