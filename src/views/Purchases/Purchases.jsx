import React from 'react';
import MaterialTable from 'material-table';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import PurchaseService from '../../services/PurchaseService';

// function dateFormat(dateString) {
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = `${date.getMonth() + 1}`.padStart(2, 0);
//   const day = `${date.getDate()}`.padStart(2, 0);
//   const stringDate = [day, month, year].join('/');
//   return `${stringDate} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
// }

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
    this.setState({ loading: true });

    PurchaseService.getPurchaseDetails()
      .then(data => this.setState({ purchases: data, loading: false }));
  }

  rowClicked(_event, rowData) {
    window.open(`/purchase/${rowData[0]}`, "_blank")
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
      { title: 'Purchase Id', field: 'purchaseId' },
      { title: 'PO Number', field: 'poNumber' },
      { title: 'Supplier', field: 'supplier', hidden: true },
      { title: 'Product Code', field: 'productCode' },
      { title: 'Product Name', field: 'productName' },
      { title: 'Plan Amount', field: 'planAmount' },
      { title: 'Plan Price', field: 'planPrice', hidden: true },
      { title: 'Plan Overhead Cost', field: 'planOverheadCost', hidden: true },
      { title: 'Paid Amount', field: 'paidAmount' },
      { title: 'Paid Price', field: 'paidPrice', hidden: true },
      { title: 'Paid Overhead Cost', field: 'paidOverheadCost', hidden: true },
      { title: 'Remain To Pay', field: 'remainToPay' },
      { title: 'OnDelivery Amount', field: 'onDeliveryAmount' },
      { title: 'OnDelivery Price', field: 'onDeliveryPrice', hidden: true },
      { title: 'OnDelivery Overhead Cost', field: 'onDeliveryOverheadCost', hidden: true },
      { title: 'Custom Clearance Amount', field: 'customClearanceAmount' },
      { title: 'Custom Clearance Price', field: 'customClearancePrice', hidden: true },
      { title: 'Custom Clearance Overhead Cost', field: 'customClearanceOverheadCost', hidden: true },
      { title: 'Arrived Amount', field: 'arrivedAmount' },
      { title: 'Arrived Price', field: 'arrivedPrice', hidden: true },
      { title: 'Arrived Overhead Cost', field: 'arrivedOverheadCost', hidden: true },
      { title: 'Location', field: 'locationName', hidden: true },
      { title: 'Remain To Arrive', field: 'remainToArrive' },
      { title: 'Arrived Date', field: 'arrivedDate', hidden: true },
    ];

    const options = {
      paging: true,
      pageSizeOptions: [25, 50, 100],
      pageSize: 25,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      rowStyle: data => {
        if (data.overDue === 'Yes') {
          return {
            backgroundColor: '#ffcccc',
          }
        }
      }
    };

    const { purchases, loading } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Purchases</div>
                {loading && <CircularProgress />}
              </CardHeader>
              <CardBody>

                <MaterialTable
                  columns={columns}
                  data={purchases}
                  options={options}
                  onRowClick={this.rowClicked}
                  title=""
                // title="Click on each order to navigate to the order details"
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
