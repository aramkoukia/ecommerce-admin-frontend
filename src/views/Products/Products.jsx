import React from "react";
// @material-ui/core components
// import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
// import Button from "components/CustomButtons/Button.jsx";

import MUIDataTable from "mui-datatables";
// import AddLocation from "views/Locations/AddLocation";
import ProductService from "../../services/ProductService";

export default class Products extends React.Component {
  constructor(props) {
    super(props);

    this.state = { products: [] };
  }

  componentDidMount() {
    this.productsList();
  }

  productsList() {
    const columns = ["productTypeName", "productCode", "productName", "salesPrice", "vancouverBalance", "abbotsfordBalance"];
    ProductService.getProducts()
      .then(results => {
        return results.map(row => {
          return columns.map(column => {
            return row[column] === null ? "" : row[column];
          });
        });
      })
      .then(data => this.setState({ products: data }));
  }

  render() {
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

    const columns = ["Type", "Product Code", "Product Name", "Sales Price ($)", "Vanvouver  Balance", "Abbotsford Balance"];

    const options = {
      filterType: "checkbox",
    };

    const { products } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={styles.cardTitleWhite}>Products List</h4>
              </CardHeader>
              <CardBody>
                <MUIDataTable
                  // title={"Employee List"}
                  data={products}
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
}

// export default withStyles(styles)(Products);
