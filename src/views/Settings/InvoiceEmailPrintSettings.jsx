import React from 'react';
import Check from '@material-ui/icons/Check';
import ReactTimeout from 'react-timeout';
import { Button, TextField } from '@material-ui/core';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Card from '../../components/Card/Card';
import Snackbar from '../../components/Snackbar/Snackbar';
import InvoiceEmailPrintSettingsService from '../../services/InvoiceEmailPrintSettingsService';

class InvoiceEmailPrintSettings extends React.Component {
  state = {
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    emailSubject: '',
    emailAttachmentFileName: '',
    ccEmailAddress: '',
    emailBody: '',
    attention: '',
    storePolicy: '',
    footer1: '',
    signature: '',
    payNote1: '',
    payNote2: '',
    payNote3: '',
    additionalChargesNote: '',
  };

  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    const {
      emailSubject,
      emailAttachmentFileName,
      ccEmailAddress,
      emailBody,
      attention,
      storePolicy,
      footer1,
      signature,
      payNote1,
      payNote2,
      payNote3,
      additionalChargesNote,
    } = await InvoiceEmailPrintSettingsService.getSettings();
    this.setState({
      emailSubject,
      emailAttachmentFileName,
      ccEmailAddress,
      emailBody,
      attention,
      storePolicy,
      footer1,
      signature,
      payNote1,
      payNote2,
      payNote3,
      additionalChargesNote,
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
    });
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleDescriptionBlur(emailBody) {
    this.setState({
      emailBody,
    });
  }

  async handleSave() {
    const {
      emailSubject,
      emailAttachmentFileName,
      ccEmailAddress,
      emailBody,
      attention,
      storePolicy,
      footer1,
      signature,
      payNote1,
      payNote2,
      payNote3,
      additionalChargesNote,
    } = this.state;

    const settings = {
      emailSubject,
      emailAttachmentFileName,
      ccEmailAddress,
      emailBody,
      attention,
      storePolicy,
      footer1,
      signature,
      payNote1,
      payNote2,
      payNote3,
      additionalChargesNote,
    };

    const result = await InvoiceEmailPrintSettingsService.updateSettings(settings);
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'Settings is updated!',
      snackbarColor: 'success',
    });
  }

  render() {
    const {
      openSnackbar, snackbarMessage, snackbarColor,
      emailSubject,
      emailAttachmentFileName,
      ccEmailAddress,
      emailBody,
      attention,
      storePolicy,
      footer1,
      signature,
      payNote1,
      payNote2,
      payNote3,
      additionalChargesNote,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={9}>
            <Card>
              <CardHeader color="primary">
                <div>Update Invoice Email and PDF Print Settings</div>
              </CardHeader>
              <CardBody>
                <GridContainer md={12}>
                  <GridItem md={12}>
                    <br />
                    <TextField
                      name="emailSubject"
                      label="Invoice Email Subject"
                      type="text"
                      onChange={this.handleChange}
                      value={emailSubject}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={12}>
                    <br />
                    <TextField
                      name="emailAttachmentFileName"
                      label="Invoice Email Attachment File Name"
                      type="text"
                      onChange={this.handleChange}
                      value={emailAttachmentFileName}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={12} m={20}>
                    <br />
                    <TextField
                      name="ccEmailAddress"
                      label="Invoice CC Email Address"
                      type="text"
                      onChange={this.handleChange}
                      value={ccEmailAddress}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={12} m={20}>
                    <br />
                    <TextField
                      multiline
                      rowsMax={50}
                      name="emailBody"
                      label="Invoice Email Body"
                      type="text"
                      onChange={this.handleChange}
                      value={emailBody}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={12} m={20}>
                    <br />
                    <TextField
                      multiline
                      rowsMax={5}
                      name="attention"
                      label="Attention Section"
                      type="text"
                      onChange={this.handleChange}
                      value={attention}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={12} m={20}>
                    <br />
                    <TextField
                      multiline
                      rowsMax={6}
                      name="storePolicy"
                      label="Store Policy"
                      type="text"
                      onChange={this.handleChange}
                      value={storePolicy}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={12} m={20}>
                    <br />
                    <TextField
                      name="footer1"
                      label="Footer"
                      type="text"
                      onChange={this.handleChange}
                      value={footer1}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={12} m={20}>
                    <br />
                    <TextField
                      multiline
                      rowsMax={3}
                      name="signature"
                      label="Signature"
                      type="text"
                      onChange={this.handleChange}
                      value={signature}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={12} m={20}>
                    <br />
                    <TextField
                      name="payNote1"
                      label="Pay Note 1"
                      type="text"
                      onChange={this.handleChange}
                      value={payNote1}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={12} m={20}>
                    <br />
                    <TextField
                      name="payNote2"
                      label="Pay Note 2"
                      type="text"
                      onChange={this.handleChange}
                      value={payNote2}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={12} m={20}>
                    <br />
                    <TextField
                      name="payNote3"
                      label="Pay Note 4"
                      type="text"
                      onChange={this.handleChange}
                      value={payNote3}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={12} m={20}>
                    <br />
                    <TextField
                      name="additionalChargesNote"
                      label="Additional Charges Note"
                      type="text"
                      onChange={this.handleChange}
                      value={additionalChargesNote}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={12}>
                    <Button onClick={this.handleSave} color="primary">
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

export default ReactTimeout(InvoiceEmailPrintSettings);
