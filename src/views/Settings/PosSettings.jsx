import React from 'react';
import Check from '@material-ui/icons/Check';
import ReactTimeout from 'react-timeout';
import TextField from '@material-ui/core/TextField';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Card from '../../components/Card/Card';
import Snackbar from '../../components/Snackbar/Snackbar';
import Button from '../../components/CustomButtons/Button';
import PosSettingsService from '../../services/PosSettingsService';
import PosSetting from '../../stores/PosSetting';


class PosSettings extends React.Component {
  state = {
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    storeId: 'gwca057284',
    terminalId: '',
    localStoreId: 'gwca057284',
    localTerminalId: '',
  };

  constructor(props) {
    super(props);
    this.pairPos = this.pairPos.bind(this);
    this.unpairPos = this.unpairPos.bind(this);
    this.initializePos = this.initializePos.bind(this);
    this.batchClose = this.batchClose.bind(this);
    this.savePosLocalSetting = this.savePosLocalSetting.bind(this);
    this.enableMobilePinpad = this.enableMobilePinpad.bind(this);
    this.disableMobilePinpad = this.disableMobilePinpad.bind(this);
  }

  async componentDidMount() {
    const localStoreId = PosSetting.getPOSStoreId();
    const localTerminalId = PosSetting.getPOSTerminalId();
    this.setState({
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: 'info',
      localStoreId,
      localTerminalId,
    });
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  async pairPos() {
    const { storeId, terminalId, pairingToken } = this.state;

    if (!pairingToken) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Please enter the Pairing Token!',
        snackbarColor: 'Red',
      });
      return;
    }

    const request = {
      storeId,
      terminalId,
      pairingToken,
    };

    const result = await PosSettingsService.pairPos(request);
    let snackbarColor = 'success';
    let snackbarMessage = 'Done!';
    if (result.is_error) {
      snackbarColor = 'danger';
      snackbarMessage = result.error_content;
      this.setState({
        openSnackbar: true,
        snackbarMessage,
        snackbarColor,
      });
    } else {
      this.setState({
        openSnackbar: true,
        snackbarMessage,
        snackbarColor,
      });
    }
  }


  savePosLocalSetting() {
    const { localStoreId, localTerminalId } = this.state;
    const snackbarColor = 'success';
    const snackbarMessage = 'Local POS settings saved!';

    PosSetting.setPOSStoreId(localStoreId);
    PosSetting.setPOSTerminalId(localTerminalId);
    this.setState({
      openSnackbar: true,
      snackbarMessage,
      snackbarColor,
    });
  }

  async unpairPos() {
    const { storeId, terminalId } = this.state;
    const request = {
      storeId,
      terminalId,
    };

    const result = await PosSettingsService.unpairPos(request);
    let snackbarColor = 'success';
    let snackbarMessage = 'Done!';
    if (result.is_error) {
      snackbarColor = 'danger';
      snackbarMessage = result.error_content;
      this.setState({
        openSnackbar: true,
        snackbarMessage,
        snackbarColor,
      });
    } else {
      this.setState({
        openSnackbar: true,
        snackbarMessage,
        snackbarColor,
      });
    }
  }

  async batchClose() {
    const { storeId, terminalId } = this.state;
    const request = {
      storeId,
      terminalId,
    };

    const result = await PosSettingsService.batchClose(request);
    let snackbarColor = 'success';
    let snackbarMessage = 'Done!';
    if (result.is_error) {
      snackbarColor = 'danger';
      snackbarMessage = result.error_content;
      this.setState({
        openSnackbar: true,
        snackbarMessage,
        snackbarColor,
      });
    } else {
      this.setState({
        openSnackbar: true,
        snackbarMessage,
        snackbarColor,
      });
    }
  }

  async initializePos() {
    const { storeId, terminalId } = this.state;
    const request = {
      storeId,
      terminalId,
    };

    const result = await PosSettingsService.initializePos(request);
    let snackbarColor = 'success';
    let snackbarMessage = 'Done!';
    if (result.is_error) {
      snackbarColor = 'danger';
      snackbarMessage = result.error_content;
      this.setState({
        openSnackbar: true,
        snackbarMessage,
        snackbarColor,
      });
    } else {
      this.setState({
        openSnackbar: true,
        snackbarMessage,
        snackbarColor,
      });
    }
  }

  async disableMobilePinpad() {
    const { storeId, terminalId } = this.state;
    const request = {
      storeId,
      terminalId,
    };

    const result = await PosSettingsService.disableMobilePinpad(request);
    let snackbarColor = 'success';
    let snackbarMessage = 'Done!';
    if (result.is_error) {
      snackbarColor = 'danger';
      snackbarMessage = result.error_content;
      this.setState({
        openSnackbar: true,
        snackbarMessage,
        snackbarColor,
      });
    } else {
      this.setState({
        openSnackbar: true,
        snackbarMessage,
        snackbarColor,
      });
    }
  }

  async enableMobilePinpad() {
    const { storeId, terminalId } = this.state;
    const request = {
      storeId,
      terminalId,
    };

    const result = await PosSettingsService.enableMobilePinpad(request);
    let snackbarColor = 'success';
    let snackbarMessage = 'Done!';
    if (result.is_error) {
      snackbarColor = 'danger';
      snackbarMessage = result.error_content;
      this.setState({
        openSnackbar: true,
        snackbarMessage,
        snackbarColor,
      });
    } else {
      this.setState({
        openSnackbar: true,
        snackbarMessage,
        snackbarColor,
      });
    }
  }

  render() {
    const {
      openSnackbar,
      snackbarMessage,
      snackbarColor,
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

    const {
      storeId,
      terminalId,
      pairingToken,
      localStoreId,
      localTerminalId,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>POS Client Setup</div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem md={3}>
                    <TextField
                      name="storeId"
                      label="Store ID"
                      type="text"
                      onChange={this.handleChange}
                      value={storeId}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={3}>
                    <TextField
                      name="terminalId"
                      label="Terminal Id"
                      type="text"
                      onChange={this.handleChange}
                      value={terminalId}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={6}>
                    <TextField
                      name="pairingToken"
                      label="Pairing Token (only needed for Pairing)"
                      type="text"
                      onChange={this.handleChange}
                      value={pairingToken}
                      fullWidth="true"
                    />
                  </GridItem>
                  <br />
                  <br />
                  <GridItem md={12}>
                    <Button color="secondary" onClick={this.initializePos}>
                      Initialize POS
                    </Button>
                    &nbsp;
                    <Button color="secondary" onClick={this.pairPos}>
                      Pair POS
                    </Button>
                    &nbsp;
                    <Button color="secondary" onClick={this.unpairPos}>
                      Unpair POS
                    </Button>
                    &nbsp;
                    <Button color="secondary" onClick={this.batchClose}>
                      Batch Close
                    </Button>
                    &nbsp;
                    <Button color="secondary" onClick={this.enableMobilePinpad}>
                      Enable Mobile Pinpad
                    </Button>
                    &nbsp;
                    <Button color="secondary" onClick={this.disableMobilePinpad}>
                      Disable Mobile Pinpad
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Local Computer POS Device Setting</div>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem md={3}>
                    <TextField
                      name="localStoreId"
                      label="Store ID"
                      type="text"
                      onChange={this.handleChange}
                      value={localStoreId}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={3}>
                    <TextField
                      name="localTerminalId"
                      label="Terminal Id"
                      type="text"
                      onChange={this.handleChange}
                      value={localTerminalId}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={3}>
                    <Button color="primary" onClick={this.savePosLocalSetting}>
                      Save
                    </Button>
                  </GridItem>
                </GridContainer>
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
