import React from 'react';
import Check from '@material-ui/icons/Check';
import ReactTimeout from 'react-timeout';
import MaterialTable from 'material-table';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Card from '../../components/Card/Card';
import Snackbar from '../../components/Snackbar/Snackbar';
import Button from '../../components/CustomButtons/Button';
import PosSettingsService from '../../services/PosSettingsService';

class PosSettings extends React.Component {
  constructor(props) {
    super(props);

    this.pairPos = this.pairPos.bind(this);
    this.unpairPos = this.unpairPos.bind(this);
    this.initializePos = this.initializePos.bind(this);

    this.state = {
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
    };
  }

  async componentDidMount() {
    this.setState({
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
    });
    this.clientPosSettingsList();
  }

  pairPos() {
    PosSettingsService.pairPos();
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'POS Paired!',
      snackbarColor: '',
    });
  }

  unpairPos() {
    PosSettingsService.unpairPos();
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'POS Unpaired!',
      snackbarColor: '',
    });
  }

  initializePos() {
    PosSettingsService.initializePos();
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'POS Initialized!',
      snackbarColor: '',
    });
  }

  clientPosSettingsList() {
    PosSettingsService.getClientPosSettings()
      .then(data => this.setState({ clientPosSettings: data }));
  }

  render() {
    const {
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      clientPosSettings,
    } = this.state;

    const styles = {
      field: {
        display: 'grid',
      },
      root: {
        display: 'grid',
      },
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
      { title: 'Store ID', field: 'storeId' },
      { title: 'Terminal ID', field: 'terminalId' },
      { title: 'Client IP', field: 'clientIp' },
      { title: 'Id', field: 'Id', hidden: true },
    ];

    const options = {
      paging: true,
      pageSizeOptions: [15, 30, 100],
      pageSize: 15,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      search: true,
    };

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={9}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>POS Setup</div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={3}>
                    <Button color="primary" onClick={this.initializePos}>
                      &nbsp;
                      Initialize POS
                    </Button>
                  </GridItem>
                  <GridItem xs={3}>
                    <Button color="primary" onClick={this.pairPos}>
                      &nbsp;
                        Pair POS
                    </Button>
                  </GridItem>
                  <GridItem xs={3}>
                    <Button color="warning" onClick={this.unpairPos}>
                      &nbsp;
                      Unpair POS
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={9}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>POS Client Setup</div>
              </CardHeader>
              <CardBody>
                <MaterialTable
                  columns={columns}
                  data={clientPosSettings}
                  options={options}
                  title=""
                  editable={{
                    onRowAdd: newData => new Promise((resolve) => {
                      setTimeout(() => {
                        clientPosSettings.push(newData);
                        PosSettingsService.createClientPosSetting(newData);
                        this.setState({ clientPosSettings }, () => resolve());
                        resolve();
                      }, 1000);
                    }),
                    onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = clientPosSettings.indexOf(oldData);
                          clientPosSettings[index] = newData;
                          PosSettingsService.updateClientPosSetting(newData);
                          this.setState({ clientPosSettings }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    }),
                    onRowDelete: oldData => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = clientPosSettings.indexOf(oldData);
                          clientPosSettings.splice(index, 1);
                          PosSettingsService.deleteClientPosSetting(oldData);
                          this.setState({ clientPosSettings }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    }),
                  }}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Snackbar
          place="tl"
          color={snackbarColor}
          icon={Check}
          message={snackbarMessage}
          open={openSnackbar}
          closeNotification={() => this.setState({ openSnackbar: false })}
          close
        />
      </div>
    );
  }
}

export default ReactTimeout(PosSettings);
