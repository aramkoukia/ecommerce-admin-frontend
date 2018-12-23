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

    // const rows = [
    //   ["Paperclips (Box)", 100, 1.15],
    //   ["Paper (Case)", 10, 45.99],
    //   ["Waste Basket", 2, 17.99]
    // ].map((row, productId) => this.createRow(productId, ...row));

    this.state = {
      rows: [],
      discountPercent: 0.08,
      discountAmount:0,
      gstTax: 0.05,
      pstTax: 0.07//rows
    };

    this.productChanged = this.productChanged.bind(this);
  }

  priceRow(qty, unit) {
    return qty * unit;
  }

  createRow(productId, productName, salesPrice) {
    let qty = 2;
    const price = this.priceRow(qty, salesPrice);
    return { productId, productName, qty, salesPrice, price };
  }

  productChanged(product) {
    var newRow = this.createRow(product.productId, product.productName, product.salesPrice);
    this.setState(prevState => ({
      rows: [...prevState.rows, newRow]
    }))
  };

  customerChanged(customer) {
    console.warn(customer);
  };

  render() {
    const { classes } = this.props;
    const { rows, gstTax, pstTax, discountAmount, discountPercent } = this.state;

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
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <ProductSearch productChanged={this.productChanged} />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <OrderTable 
                      rows={rows} 
                      gstTax={gstTax}
                      pstTax={pstTax}
                      discountAmount={discountAmount}
                      discountPercent={discountPercent}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary">Complete</Button>
                <Button color="info">On Hold</Button>
                <Button color="info">Draft</Button>
                <Button color="info">Account</Button>
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
