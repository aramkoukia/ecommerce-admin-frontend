import React from "react";
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
      note: "",
      taxes: []
    };

    this.productChanged = this.productChanged.bind(this);
    this.priceChanged = this.priceChanged.bind(this);
    this.customerChanged = this.customerChanged.bind(this);
    this.clearCustomer = this.clearCustomer.bind(this);
    //this.noteChanged = this.noteChanged.bind(this);
    this.saveAsPaid =  this.saveAsPaid.bind(this);
    this.saveAsDraft = this.saveAsDraft.bind(this);
    this.saveAsHold = this.saveAsHold.bind(this);
    this.saveAsAccount = this.saveAsAccount.bind(this);
  }

  async componentDidMount() {
    const taxes = await TaxService.getTaxes("Canada", "BC");
    this.setState({ taxes: taxes });
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

  priceChanged(subTotal, total, discountPercent, discountAmount) {
    this.setState({ 
      subTotal: subTotal,
      total: total,
      discountPercent: discountPercent,
      discountAmount: discountAmount
    });
  }

  clearCustomer() {
    this.setState({customer: null});
  }

  customerChanged(customer) {
    this.setState({
      customer: customer
    });
  }

  // noteChanged(note) {
  //   this.setState({
  //     note: note
  //   });
  // }

  saveAsPaid() {
    const { customer, rows, total, subTotal, discountPercent, discountAmount, note, taxes } = this.state;
    const status = "Paid";
    const orderDetails = rows.map((row) => {row.productId, row.qty, row.salesPrice});
    const orderTaxes = taxes.map((tax) => { tax.taxId, tax.percentage });

    const order = {
      subTotal: subTotal,
      total: total,
      discountPercent: discountPercent,
      discountAmount: discountAmount,
      customerId: customer.customerId,
      status: status,
      note: note,
      orderTaxes: orderTaxes,
      orderDetails: orderDetails,
    };

    orderService.saveOrder(order);
  }

  saveAsDraft() {
    const order = null;
    orderService.saveOrder(order);
  }

  saveAsHold() {
    const order = null;
    orderService.saveOrder(order);
  }

  saveAsAccount() {
    const order = null;
    orderService.saveOrder(order);
  }

  render() {
    const { classes, note, poNumber } = this.props;
    const { rows, taxes, discountAmount, discountPercent, customer } = this.state;

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
                                value: 0 + " $",
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
                                value: customer.pstNumber  + ' '
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
                      //gstTax={gstTax}
                      //pstTax={pstTax}
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
                          // onChange: this.noteChanged(note)
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
                          value: note,
                          // onChange: this.noteChanged(note)
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
                      <Button color="info" onClick={this.saveAsHold}>Put On Hold</Button>                  
                    </GridItem>
                    ) : ( <div></div> )
                  }
                  { customer ? (                  
                    <GridItem xs>
                      <Button color="info" onClick={this.saveAsAccount}>Use Customers Account</Button>
                    </GridItem>
                    ) : ( <div></div> )
                  }
                </GridContainer> 
              </CardFooter>
            </Card>
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
