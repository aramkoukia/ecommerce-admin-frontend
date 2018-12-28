import React from 'react';
import MUIDataTable from 'mui-datatables';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import TaxService from '../../services/TaxService';
// import AddLocation from "views/Locations/AddLocation";

export default class Taxes extends React.Component {
  constructor(props) {
    super(props);

    this.state = { taxes: [] };
  }

  componentDidMount() {
    this.taxesList();
  }

  taxesList() {
    const columns = ['taxName', 'country', 'province', 'percentage', 'effectiveDate'];
    TaxService.getAllTaxes()
      .then(results => results.map(row => columns.map(column => row[column] || '')))
      .then(data => this.setState({ taxes: data }));
  }

  render() {
    const styles = {
      cardCategoryWhite: {
        '&,& a,& a:hover,& a:focus': {
          color: 'rgba(255,255,255,.62)',
          margin: '0',
          fontSize: '14px',
          marginTop: '0',
          marginBottom: '0',
        },
        '& a,& a:hover,& a:focus': {
          color: '#FFFFFF',
        },
      },
      cardTitleWhite: {
        color: '#FFFFFF',
        marginTop: '0px',
        minHeight: 'auto',
        fontWeight: '300',
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: '3px',
        textDecoration: 'none',
        '& small': {
          color: '#777',
          fontSize: '65%',
          fontWeight: '400',
          lineHeight: '1',
        },
      },
    };

    const columns = ['Tax Name', 'Country', 'Province', 'Percentage (%)', 'Effective Date'];

    const options = {
      filterType: 'checkbox',
    };

    const { taxes } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Taxes</div>
              </CardHeader>
              <CardBody>
                <MUIDataTable
                  data={taxes}
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

// export default withStyles(styles)(Customers);
