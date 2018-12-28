import React from 'react';
import MUIDataTable from 'mui-datatables';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import AddLocation from 'views/Locations/AddLocation';
import LocationService from '../../services/LocationService';

export default class Locations extends React.Component {
  constructor(props) {
    super(props);

    this.state = { locations: [] };
  }

  componentDidMount() {
    this.LocationsList();
  }

  LocationsList() {
    const columns = ['locationId', 'locationName', 'locationAddress'];
    LocationService.getLocations()
      .then(results => results.map(row => columns.map(column => (row[column] === null ? '' : row[column]))))
      .then(data => this.setState({ locations: data }));
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
        fontFamily: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
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

    const columns = ['Location Id', 'Location Name', 'Location Address'];
    const options = {
      filterType: 'checkbox',
    };

    const { locations } = this.state;

    return (
      <div>
        {/* <Button color='primary'>Add Location</Button>
        <AddLocation /> */}
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Locations List</div>
              </CardHeader>
              <CardBody>
                <MUIDataTable
                  data={locations}
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
