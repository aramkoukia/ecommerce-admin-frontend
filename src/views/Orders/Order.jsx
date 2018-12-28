import React from "react";
import Check from "@material-ui/icons/Check";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import PropTypes from "prop-types";
import OrderService from "../../services/OrderService";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import Chip from '@material-ui/core/Chip';
import OrderNotes from "./OrderNotes";
import OrderItems from "./OrderItems";
import OrderCustomer from "./OrderCustomer";
import Print from "@material-ui/icons/Print";
import Email from "@material-ui/icons/Email";
import CircularProgress from '@material-ui/core/CircularProgress';

let orderService = new OrderService();

const styles = {
  chip: {
    margin: 5,
  },
};

function dateFormat(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export class Order extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: null,
      notes: "",
      poNumber: "",
      openSnackbar: false,
      snackbarMessage: "",
      snackbarColor: "",
      loading: false,
    };

    this.saveAsPaid =  this.saveAsPaid.bind(this);
    this.saveAsHold = this.saveAsHold.bind(this);
    this.refundOrder = this.refundOrder.bind(this);
    this.emailOrder = this.emailOrder.bind(this);
    this.printOrder = this.printOrder.bind(this);
    this.cancelHold = this.cancelHold.bind(this);
  }

  async componentDidMount() {
    const orderId = this.props.match.params.id;
    const order = await orderService.getOrderDetail(orderId);
    this.setState({ 
      order: order,
    });
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  async updateOrderStatus(orderStatus) {
    const { order } = this.state;
    const result = await orderService.updateOrderStatus(order.orderId,  { orderStatus: orderStatus });
    if(result === false || result === null || result.StatusCode === 500 || result.StatusCode === 400) {
      this.setState({ 
        openSnackbar: true,
        snackbarMessage: "Oops, looks like something went wrong!",
        snackbarColor: "danger",
      });
      return false;
    } else {
      return result;
    }
  }

  async refundOrder() {

  }

  async emailOrder() {
    const { order } = this.state;
    this.setState({ 
      loading: true,
    });
    await orderService.emailOrder(order.orderId);
    this.setState({ 
      loading: false,
    });
  }

  async printOrder() {
    const { order } = this.state;
    this.setState({ 
      loading: true,
    });
    await orderService.printOrder(order.orderId);
    this.setState({ 
      loading: false,
    });
  }

  async saveAsPaid() {
    const status = "Paid"
    const result = await this.updateOrderStatus(status)
    if(result && result.orderId) {
      this.setState({ 
        openSnackbar: true,
        snackbarMessage: "Order was marked as Paid successfully!",
        snackbarColor: "success",
      });

      const { order } = this.state;
      order.status = status;
      this.setState({ 
        order: order,
      });
    }
  }

  async saveAsHold() {
    const status = "OnHold"
    const result = await this.updateOrderStatus(status)
    if(result && result.orderId) {
      this.setState({ 
        openSnackbar: true,
        snackbarMessage: "Order was marked as On-Hold successfully!",
        snackbarColor: "success",
      });
      const { order } = this.state;
      order.status = status;
      this.setState({ 
        order: order,
      });   
    }
  }

  async cancelHold() {
    const status = "Draft"
    const result = await this.updateOrderStatus(status)
    if(result && result.orderId) {
      this.setState({ 
        openSnackbar: true,
        snackbarMessage: "Order was marked as Draft and not On-Hold any more!",
        snackbarColor: "success",
      });
      const { order } = this.state;
      order.status = status;
      this.setState({ 
        order: order,
      });      
    }
  }

  render() {
    const { order, openSnackbar, snackbarMessage, snackbarColor, loading } = this.state;

    return (
      <div>
        { order && (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div>
                  Order # <b>{order.orderId}</b> 
                  &nbsp;&nbsp; {dateFormat(order.orderDate)} 
                  &nbsp;&nbsp; <Chip label={order.status} color="primary" />
                </div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem>
                    <GridContainer>
                    <GridItem>
                      <Button color="warning" onClick={this.emailOrder}> <Email /> Email</Button>                  
                    </GridItem>
                    <GridItem>
                      <Button color="warning" onClick={this.printOrder}><Print /> Print</Button>
                    </GridItem>
                    
                    { order.status === "Draft" || order.status === "OnHold" || order.status === "Account" ? 
                    <GridItem xs>
                      <Button color="info" onClick={this.saveAsPaid}>Mark As Paid</Button>
                    </GridItem> : <div></div>}

                    { order.status === "Draft" && (
                    <GridItem xs>
                      <Button color="info" onClick={this.saveAsHold}>Put On Hold</Button>                  
                    </GridItem> )}

                    { order.status === "Paid" && (
                    <GridItem xs>
                      <Button disabled color="info" onClick={this.refundOrder}>Return</Button>
                    </GridItem> )}

                    { order.status === "OnHold" && (                                         
                    <GridItem xs>
                      <Button color="info" onClick={this.cancelHold}>Cancel On Hold</Button>
                    </GridItem> )}                    
                    <GridItem xs>
                      { loading && <CircularProgress /> }
                    </GridItem>
                    </GridContainer>                  
                  </GridItem>
                  <GridItem xs={12}>
                    <OrderItems order={order} />
                  </GridItem>
                  <GridItem xs={8}>
                    <OrderCustomer order={order} />
                  </GridItem>                  
                  <GridItem xs={4}>
                    <OrderNotes order={order} />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
              </CardFooter>
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
        </GridContainer> ) }
      </div>
    );
  }
}

Order.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Order);

