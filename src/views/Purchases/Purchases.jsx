import React from 'react';
import MUIDataTable from 'mui-datatables';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';

import PurchaseService from '../../services/PurchaseService';

function dateFormat(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()}`;
}

export default class Purchases extends React.Component {
  constructor(props) {
    super(props);

    this.state = { purchases: [] };
    this.rowClicked = this.rowClicked.bind(this);
  }

  componentDidMount() {
    this.purchasesList();
  }

  purchasesList() {
    const columns = ['purchaseId', 'purchaseDate', 'supplier', 'deliveryDate', 'status', 'total', 'createdByUserId'];
    PurchaseService.getPurchases()
      .then((results) => results.map(row => {
          return columns.map(column => {
            if(column === "purchaseDate") {
              return dateFormat(row[column]);
            }
            return row[column] || "";
          });
        }))
      .then(data => this.setState({ purchases: data }));
  }

  rowClicked(rowData, _rowMeta) {
    this.props.history.push(`/purchase/${rowData[0]}`);
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

    const columns = [
      {
        name: 'Purchase Number',
        options: {
          filter: false,
        },
      },
      {
        name: 'Purchase Date',
        options: {
          filter: false,
        },
      },
      {
        name: 'Supplier',
        options: {
          filter: true,
        },
      },
      {
        name: 'Delivery Date',
        options: {
          filter: false,
        },
      },
      {
        name: 'Status',
        options: {
          filter: true,
        },
      },
      {
        name: 'Total',
        options: {
          filter: false,
        },
      },
      'Created By'];

    const options = {
      filterType: 'checkbox',
      onRowClick: this.rowClicked,
      rowHover: true,
      resizableColumns: true,
      selectableRows: false,
      rowsPerPageOptions: [25, 50, 100],
      rowsPerPage: 25,
    };

    const { purchases } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Purchases</div>
              </CardHeader>
              <CardBody>
                <MUIDataTable
                  title="Click on each purchase to navigate to the purchase details"
                  data={purchases}
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
