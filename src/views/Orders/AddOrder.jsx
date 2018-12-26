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
  }
};

export class AddOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      customer: null,
      rows: [],
      discountPercent: 0.08,
      discountAmount:0,
      gstTax: 0.05,
      pstTax: 0.07,
      notes: "",
      poNumber: "",
      taxes: [],
      allTaxes: [],
      openSnackbar: false,
    };

    this.productChanged = this.productChanged.bind(this);
    this.priceChanged = this.priceChanged.bind(this);
    this.customerChanged = this.customerChanged.bind(this);
    this.clearCustomer = this.clearCustomer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveAsPaid =  this.saveAsPaid.bind(this);
    this.saveAsDraft = this.saveAsDraft.bind(this);
    this.saveAsHold = this.saveAsHold.bind(this);
    this.saveAsAccount = this.saveAsAccount.bind(this);
  }

  async componentDidMount() {
    const taxes = await TaxService.getTaxes("Canada", "BC");
    this.setState({ 
      taxes: taxes,
      allTaxes: taxes 
    });
  }

  priceRow(qty, unit) {
    return qty * unit;
  }

  createRow(productId, productName, salesPrice) {
    let qty = 1;
    const price = this.priceRow(qty, salesPrice);
    return { productId, productName, qty, salesPrice, price };
  }

  productChanged(product) {
    var newRow = this.createRow(product.productId, product.productName, product.salesPrice);
    this.setState(prevState => ({
      rows: [...prevState.rows, newRow]
    }))
  }

  priceChanged(subTotal, total, discount, discountPercent, discountAmount) {
    this.setState({ 
      subTotal: subTotal,
      total: total,
      discountPercent: discountPercent,
      discountAmount: discountAmount,
      discount: discount,
    });
  }

  clearCustomer() {
    this.setState({customer: null});
  }

  customerChanged(customer) {
    const { allTaxes } = this.state;
    if(customer && customer.pstNumber) { // removing taxes with name like "pst" from the list if the selected customer has PST number in their profile
      const filterTaxes = allTaxes.reduce((filterTaxes, tax) => {
        if(!tax.taxName.toLowerCase().includes("pst")) {
          filterTaxes.push(tax);
        }
        return filterTaxes;
      }, []);

      this.setState({
        taxes: filterTaxes,
      });
      this.setState({ 
        openSnackbar: true,
        snackbarMessage: "PST Tax not charged for this customer!",
        snackbarColor: "warning",
      });
    } else {
      this.setState({
        taxes: allTaxes,
      });
    }

    this.setState({
      customer: customer
    });
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  validateCustomerCredit()
  {
    const { customer, total } = this.state;
    if(customer && customer.creditLimit > customer.accountBalance + total) {
      return false;
    }

    return true;
  }

  async saveOrder(orderStatus) {
    const { customer, rows, total, subTotal, discountPercent, discountAmount, notes, taxes, poNumber } = this.state;
    const status = orderStatus;
    const orderDetails = rows.map(row => (
      { 
        orderId: 0,
        orderDetailId: 0,
        productId: row.productId, 
        amount: row.qty, 
        unitPrice: row.salesPrice,
        totalPrice: row.qty * row.salesPrice,
      })
    );
    const orderTaxes = taxes.map(tax => (
      { 
        taxId: tax.taxId, 
        taxAmount: (tax.percentage / 100) * subTotal, 
      })
    );
    // let orderPayment = null;
    // if(status === "Paid") {
    //   orderPayment = {
    //     paymentAmount: total,
    //     paymentTypeId: 1,  // Credit Debit by default for now
    //   }
    // }

    const order = {
      locationId: Location.getStoreLocation(),
      subTotal: subTotal,
      total: total,
      discountPercent: discountPercent,
      discountAmount: discountAmount,
      customerId: customer !== null ? customer.customerId : null,
      status: status,
      notes: notes,
      poNumber: poNumber,
      pstNumber: customer !== null ? customer.pstNumber : null,
      orderTax: orderTaxes,
      orderDetail: orderDetails,
      // orderPayment: orderPayment, will set this in the API
    };

    const result = await orderService.saveOrder(order);
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

  async saveAsPaid() {
    const result = await this.saveOrder("Paid")
    if(result && result.orderId) {
      this.setState({ 
        openSnackbar: true,
        snackbarMessage: "Order was Saved and marked as Paid successfully!",
        snackbarColor: "success",
      });
      this.props.history.push(`/order/${result.orderId}`);
    }
  }

  async saveAsDraft() {
    const result = await this.saveOrder("Draft");
    if(result && result.orderId) {
      this.setState({ 
        openSnackbar: true,
        snackbarMessage: "Order was Saved as Draft successfully!",
        snackbarColor: "warning",
      });
      this.props.history.push(`/order/${result.orderId}`);      
    }
  }

  async saveAsHold() {
    const result = await this.saveOrder("OnHold");
    if(result && result.orderId) {
      this.setState({ 
        openSnackbar: true,
        snackbarMessage: "Order was Saved and marked as On Hold successfully!",
        snackbarColor: "warning",
      });
      this.props.history.push(`/order/${result.orderId}`);      
    }
  }

  async saveAsAccount() {
    if(this.validateCustomerCredit()){
      this.setState({ 
        openSnackbar: true,
        snackbarMessage: "Customer is exceeding the credit limit!",
        snackbarColor: "danger",
      });      
      return;
    }

    const result = await this.saveOrder("Account");
    if(result && result.orderId) {
      this.setState({ 
        openSnackbar: true,
        snackbarMessage: "Order was Saved and Added to customer's Credit successfully!",
        snackbarColor: "info",
      });
      this.props.history.push(`/order/${result.orderId}`);      
    }
  }

  render() {
    const { classes } = this.props;
    const { rows, taxes, discountAmount, discountPercent, customer, openSnackbar, snackbarMessage, snackbarColor, notes, poNumber } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>New Order</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomerSearch customerChanged={this.customerChanged} />
                  </GridItem>
                </GridContainer>
                { customer ? (
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <Card>
                      <CardBody>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={3}>
                            <CustomInput
                              labelText="Full Name"
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                disabled: true,
                                value: customer.firstName + ' ' + customer.firstName
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={3}>
                            <CustomInput
                              labelText="User Name"
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                disabled: true,
                                value: customer.userName  + ' '
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={3}>
                            <CustomInput
                              labelText="Email"
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                disabled: true,
                                value: customer.userName  + ' '
                              }}                            
                            />
                          </GridItem>
                      </GridContainer>
                      <GridContainer alignItems="flex-end">
                          <GridItem xs={12} sm={12} md={3}>
                            <CustomInput
                              labelText="Credit Limit"
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                disabled: true,
                                value: customer.creditLimit + " $",
                                error: "error"
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={3}>
                            <CustomInput
                              labelText="Unpaid Orders Amount"
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                disabled: true,
                                value: customer.accountBalance + " $",
                                error: "error"
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={3}>
                            <CustomInput
                              labelText="PST Number"
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                disabled: true,
                                value: customer.pstNumber === null ? 'Not Provided' : customer.pstNumber + ' '
                              }}                            
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={3}>
                            <Button color="info" onClick={this.clearCustomer}>Clear</Button>
                          </GridItem>
                      </GridContainer>                      
                      </CardBody>
                    </Card>
                  </GridItem>
                </GridContainer>                
                ) : ( <div></div> )
                }
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <ProductSearch productChanged={this.productChanged} />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <OrderTable 
                      rows={rows}
                      taxes={taxes}
                      discountAmount={discountAmount}
                      discountPercent={discountPercent}
                      priceChanged={this.priceChanged}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                        labelText="PO Number"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: poNumber,
                          name: "poNumber",
                          onChange: this.handleChange
                        }}                            
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={9}>
                    <CustomInput
                        labelText="Notes"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          multiline:true,
                          rows:1,
                          value: notes,
                          name: "notes",
                          onChange: this.handleChange
                        }}                            
                    />
                  </GridItem>
                </GridContainer>                
              </CardBody>
              <CardFooter>
                <GridContainer>
                  <GridItem xs>
                    <Button color="primary" onClick={this.saveAsPaid}>Mark As Paid</Button>
                  </GridItem>
                  <GridItem xs>
                    <Button color="info" onClick={this.saveAsDraft}>Save As Draft</Button>
                  </GridItem>
                  { customer ? (                  
                    <GridItem xs>
                      <Button color="info" onClick={this.saveAsAccount}>Use Customers Account</Button>
                    </GridItem>
                    ) : ( <div></div> )
                  }
                  { customer ? (
                    <GridItem xs>
                      <Button color="info" onClick={this.saveAsHold}>Put On Hold</Button>                  
                    </GridItem>
                    ) : ( <div></div> )
                  }                  
                </GridContainer> 
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
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(AddOrder);

AddOrder.propTypes = {
  classes: PropTypes.object.isRequired,
};
