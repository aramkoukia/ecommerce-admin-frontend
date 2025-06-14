import React from 'react';
import MaterialTable from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import Check from '@material-ui/icons/Check';
import Portal from '@material-ui/core/Portal';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridItem from '../../components/Grid/GridItem';
import Snackbar from '../../components/Snackbar/Snackbar';
import TaxService from '../../services/TaxService';

export default class Taxes extends React.Component {
  state = {
    taxes: [],
    openDialog: false,
    openPasswordDialog: false,
    selectedRow: null,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
  };

  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this.taxesList();
  }

  async handleUpdate() {
    const {
      selectedRow,
    } = this.state;

    const tax = {
      email: selectedRow.email,
    };

    const result = await TaxService.updateTax(tax);
    if (result) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Tax successfully updated!',
        snackbarColor: 'success',
      });
    }

    this.setState({
      openDialog: false,
      selectedRow: null,
    });

    window.location.reload();
  }

  taxesList() {
    TaxService.getAllTaxes()
      .then((data) => this.setState({ taxes: data }));
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
        title: 'Tax Name',
        field: 'taxName',
        readonly: true,
        editable: 'never',
      },
      {
        title: 'Country',
        field: 'country',
        readonly: true,
        editable: 'never',
      },
      {
        title: 'Province',
        field: 'province',
        readonly: true,
        editable: 'never',
      },
      {
        title: 'Percentage',
        field: 'percentage',
      },
      {
        title: 'Tax Id',
        field: 'taxId',
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

    const {
      taxes,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      loading,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Taxes</div>
              </CardHeader>
              <CardBody>
                <MaterialTable
                  columns={columns}
                  data={taxes}
                  options={options}
                  title=""
                  editable={{
                    onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = taxes.indexOf(oldData);
                          taxes[index] = newData;
                          TaxService.updateTax(newData);
                          this.setState({ taxes }, () => resolve());
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
        <Portal>
          <Snackbar
            place="tl"
            color={snackbarColor}
            icon={Check}
            message={snackbarMessage}
            open={openSnackbar}
            closeNotification={() => this.setState({ openSnackbar: false })}
            close
          />
        </Portal>
      </div>
    );
  }
}