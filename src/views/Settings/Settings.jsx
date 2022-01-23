import React from 'react';
import Check from '@material-ui/icons/Check';
import SchemaForm from 'jsonschema-form-for-material-ui';
import ReactTimeout from 'react-timeout';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Card from '../../components/Card/Card';
import Snackbar from '../../components/Snackbar/Snackbar';
import SettingsService from '../../services/SettingsService';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: 'info',
      settings: {},
    };
  }

  async componentDidMount() {
    const settings = await SettingsService.getSettings();
    this.setState({
      settings,
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: 'info',
    });
  }

  async onSubmit(form) {
    const settings = await SettingsService.updateSettings(form.formData);
    this.setState({
      settings,
      openSnackbar: true,
      snackbarMessage: 'System settings is updated!',
      snackbarColor: 'success',
    });
  }

  render() {
    const {
      openSnackbar, snackbarMessage, snackbarColor, settings,
    } = this.state;
    const styles = {
      field: {
        display: 'grid',
      },
      root: {
        display: 'grid',
      },
    };

    const schema = {
      type: 'object',
      required: [
        'adminEmail',
        'reportEmail',
        'fromEmail',
        'fromEmailPassword',
        'smtpPort',
        'smtpHost',
        'smtpUseSsl',
        'warnInSufficientStockOnOrder',
        'blockInSufficientStockOnOrder',
        'enablePosIntegration',
        'allowedIPAddresses',
      ],
      properties: {
        adminEmail: {
          type: 'string',
          title: 'Admin Email',
        },
        reportEmail: {
          type: 'string',
          title: 'Report Email',
        },
        fromEmail: {
          type: 'string',
          title: 'From Email',
        },
        fromEmailPassword: {
          type: 'string',
          title: 'From Email Password',
        },
        smtpPort: {
          type: 'string',
          title: 'SMTP Port',
        },
        smtpHost: {
          type: 'string',
          title: 'SMTP Host',
        },
        smtpUseSsl: {
          type: 'boolean',
          title: 'Use SSL for SMTP',
        },
        warnInSufficientStockOnOrder: {
          type: 'boolean',
          title: 'Warn InSufficient Stock On Order',
        },
        blockInSufficientStockOnOrder: {
          type: 'boolean',
          title: 'Block InSufficient Stock On Order',
        },
        enablePosIntegration: {
          type: 'boolean',
          title: 'Enable Moneris POS integration',
        },
        allowedIPAddresses: {
          type: 'string',
          title: 'Allowed IP Addresses (Comma seperated)',
        },
      },
    };

    const uiSchema = {
      // "ui:orientation": "row",
      adminEmail: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      reportEmail: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      fromEmail: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      fromEmailPassword: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      smtpPort: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      smtpHost: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      smtpUseSsl: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
        'ui:widget': 'checkbox',
      },
      warnInSufficientStockOnOrder: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
        'ui:widget': 'checkbox',
      },
      blockInSufficientStockOnOrder: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
        'ui:widget': 'checkbox',
      },
      enablePosIntegration: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
        'ui:widget': 'checkbox',
      },
      allowedIPAddresses: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },

    };

    const initialFormData = {
      adminEmail: settings.adminEmail,
      reportEmail: settings.reportEmail,
      fromEmail: settings.fromEmail,
      fromEmailPassword: settings.fromEmailPassword,
      smtpPort: settings.smtpPort,
      smtpHost: settings.smtpHost,
      smtpUseSsl: settings.smtpUseSsl,
      warnInSufficientStockOnOrder: settings.warnInSufficientStockOnOrder,
      blockInSufficientStockOnOrder: settings.blockInSufficientStockOnOrder,
      allowedIPAddresses: settings.allowedIPAddresses,
      enablePosIntegration: settings.enablePosIntegration,
    };

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={9}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Update Settings</div>
              </CardHeader>
              <CardBody>
                <SchemaForm
                  classes={styles}
                  schema={schema}
                  uiSchema={uiSchema}
                  formData={initialFormData}
                  onSubmit={this.onSubmit}
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

export default ReactTimeout(Settings);
