import React from 'react';
import Check from '@material-ui/icons/Check';
import ReactTimeout from 'react-timeout';
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

  render() {
    const {
      openSnackbar, snackbarMessage, snackbarColor,
    } = this.state;
    const styles = {
      field: {
        display: 'grid',
      },
      root: {
        display: 'grid',
      },
    };

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={9}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>POS Settings</div>
              </CardHeader>
              <CardBody>
                <Button color="Info" onClick={this.pairPos}>
                  &nbsp;
                  Pair POS
                </Button>
                <Button color="Info" onClick={this.initializePos}>
                  &nbsp;
                  Initialize POS
                </Button>
                <Button color="Info" onClick={this.unpairPos}>
                  &nbsp;
                  Unpair POS
                </Button>
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
