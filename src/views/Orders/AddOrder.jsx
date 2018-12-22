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
import Search from "@material-ui/icons/Search";
import PropTypes from "prop-types";
import IntegrationAutosuggest from "./ProductSearch";
import SpanningTable from "./SpanningTable";

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
  handleChange = name => (event, { newValue }) => {
    this.setState({
      [name]: newValue
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>New Order</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    <IntegrationAutosuggest />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12} >
                    <SpanningTable />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary">Complete</Button>
                <Button color="secondary">On Hold</Button>
                <Button color="secondary">Draft</Button>
                <Button color="secondary">Account</Button>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardBody profile>
                <Button color="white" aria-label="edit" justIcon round>
                  <Search />
                </Button>
                <Button color="primary">New Customer</Button>
              </CardBody>
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
