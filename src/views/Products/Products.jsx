import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";

import MUIDataTable from "mui-datatables";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

function Products(props) {
  const { classes } = props;
  const columns = ["Type", "Code", "Name", "Total Inventory", "Price"];

  const data = [
    ["Accesories", "1234", "LED 23232", "12", "123$"],
    ["Accesories", "1234", "LED 23232", "132", "123$"],
    ["Accesories", "1234", "LED 23232", "1542", "123$"],
    ["Accesories", "1234", "LED 23232", "126", "123$"],
    ["Accesories", "1234", "LED 23232", "152", "123$"],
  ];

  const options = {
    filterType: "checkbox",
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Products List</h4>
            </CardHeader>
            <CardBody>
              <MUIDataTable
                // title={"Employee List"}
                data={data}
                columns={columns}
                options={options}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default withStyles(styles)(Products);
