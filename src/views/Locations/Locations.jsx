import React from 'react';
import MaterialTable from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import LocationService from '../../services/LocationService';

export default class Locations extends React.Component {
  state = {
    locations: [],
    loading: false,
  };

  componentDidMount() {
    this.LocationsList();
  }

  LocationsList() {
    this.setState({ loading: true });
    LocationService.getLocations()
      .then((data) => this.setState({ locations: data, loading: false }));
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

    const columns = [
      {
        title: 'Location Name',
        field: 'locationName',
      },

      {
        title: 'Country',
        field: 'country',
      },

      {
        title: 'Province',
        field: 'province',
      },

      {
        title: 'Postal Code',
        field: 'postalCode',
      },
      {
        title: 'Address',
        field: 'locationAddress',
      },
      {
        title: 'Phone Number',
        field: 'phoneNumber',
      },
      // {
      //   title: 'Disabled',
      //   field: 'disabled',
      //   lookup: {
      //     True: 'True',
      //     False: 'False',
      //   },
      // },
      {
        title: 'Location Id',
        field: 'locationId',
        hidden: true,
        readonly: true,
        editable: 'never',
      },
    ];

    const options = {
      paging: true,
      pageSizeOptions: [25, 50, 100],
      pageSize: 25,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      search: true,
    };

    const { locations, loading } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Locations List</div>
              </CardHeader>
              <CardBody>
                <MaterialTable
                  columns={columns}
                  data={locations}
                  options={options}
                  title=""
                  editable={{
                    onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = locations.indexOf(oldData);
                          locations[index] = newData;
                          LocationService.updateLocation(newData);
                          this.setState({ locations }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    }),
                    onRowAdd: (newData) => new Promise((resolve) => {
                      setTimeout(() => {
                        locations.push(newData);
                        LocationService.addLocation(newData);
                        this.setState({ locations }, () => resolve());
                        resolve();
                      }, 1000);
                    }),
                    onRowDelete: (oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = locations.indexOf(oldData);
                          locations.splice(index, 1);
                          LocationService.deleteLocation(oldData.locationId);
                          this.setState({ locations }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    }),
                  }}
                />
                {loading && (<LinearProgress />)}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
