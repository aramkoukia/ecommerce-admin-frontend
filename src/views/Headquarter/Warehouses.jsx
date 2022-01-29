import React from 'react';
import MaterialTable from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import WarehouseService from '../../services/WarehouseService';

export default class Brands extends React.Component {
  state = {
    warehouses: [],
    loading: false,
  };

  componentDidMount() {
    this.WarehousesList();
  }

  WarehousesList() {
    this.setState({ loading: true });
    WarehouseService.getWarehouses()
      .then((data) => this.setState({ warehouses: data, loading: false }));
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
        title: 'Warehouse Code',
        field: 'warehouseId',
      },
      {
        title: 'Warehouse Name',
        field: 'warehouseName',
      },
    ];

    const options = {
      paging: true,
      pageSizeOptions: [5, 50, 100],
      pageSize: 5,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      search: true,
    };

    const { warehouses, loading } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Warehouses</div>
              </CardHeader>
              <CardBody>
                <MaterialTable
                  columns={columns}
                  data={warehouses}
                  options={options}
                  title=""
                />
                {loading && (<LinearProgress />)}

                <br />

              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
