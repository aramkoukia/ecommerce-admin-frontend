import React from "react";
import Check from "@material-ui/icons/Check";
import Error from "@material-ui/icons/Error";
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
import ProductSearch from "./ProductSearch";
import CustomerSearch from "./CustomerSearch";
import OrderTable from "./OrderTable";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import OrderService from "../../services/OrderService";
import TaxService from "../../services/TaxService";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import Location from "../../stores/Location";
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import OrderNotes from "./OrderNotes";
import OrderItems from "./OrderItems";
import OrderCustomer from "./OrderCustomer";
import Print from "@material-ui/icons/Print";
import Email from "@material-ui/icons/Email";

let orderService = new OrderService();

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
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
    };

    // this.saveAsPaid =  this.saveAsPaid.bind(this);
    // this.saveAsHold = this.saveAsHold.bind(this);
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

  async saveOrder(orderStatus) {
    const order = null;
    const result = await orderService.saveOrder(order);
    if(result === false || result === null || result.StatusCode === 500 || result.StatusCode === 400) {
      this.setState({ 
        openSnackbar: true,
        snackbarMessage: "Oops, looks like something went wrong!",
        snackbarColor: "danger",
      });
      return false;
    } else {
      return true;
    }
  }

  async saveAsPaid() {
    const result = await this.saveOrder("Paid")
    if(result === true) {
      this.setState({ 
        openSnackbar: true,
        snackbarMessage: "Order was Saved and marked as Paid successfully!",
        snackbarColor: "success",
      });
    }
  }

  async saveAsHold() {
    const result = await this.saveOrder("OnHold");
    if(result === true) {
      this.setState({ 
        openSnackbar: true,
        snackbarMessage: "Order was Saved and marked as On Hold successfully!",
        snackbarColor: "warning",
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { order, openSnackbar, snackbarMessage, snackbarColor } = this.state;

    return (
      <div>
        { order && (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4>
                  Order # <b>{order.orderId}</b> 
                  &nbsp;&nbsp; {dateFormat(order.orderDate)} 
                  &nbsp;&nbsp; <Chip label={order.status} color="primary" />
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem>
                    <GridContainer>
                    <GridItem>
                      <Button color="warning" onClick={this.email}> <Email /> Email</Button>                  
                    </GridItem>
                    <GridItem>
                      <Button color="warning" onClick={this.print}><Print /> Print</Button>
                    </GridItem>
                    
                    { order.status === "Draft" || order.status === "OnHold" ? 
                    <GridItem xs>
                      <Button color="info" onClick={this.saveAsPaid}>Mark As Paid</Button>
                    </GridItem> : <div></div>}

                    { order.status === "Draft" && (
                    <GridItem xs>
                      <Button color="info" onClick={this.saveAsHold}>Put On Hold</Button>                  
                    </GridItem> )}

                    { order.status === "Paid" && (
                    <GridItem xs>
                      <Button color="info" onClick={this.refundOrder}>Return</Button>
                    </GridItem> )}

                    { order.status === "OnHold" && (                                         
                    <GridItem xs>
                      <Button color="info" onClick={this.cancelHold}>Cancel On Hold</Button>
                    </GridItem> )}                    
                    
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

