import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CloudDownload from '@material-ui/icons/CloudDownload';
import DialogContentText from '@material-ui/core/DialogContentText';
import { withStyles } from '@material-ui/core/styles';
import CloudUpload from '@material-ui/icons/CloudUpload';
import Delete from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import TableHead from '@material-ui/core/TableHead';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '../../components/CustomButtons/Button';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import OrderService from '../../services/OrderService';
import FileUpload from '../../components/ImageUpload/FileUpload';

const style = {
};

class OrderAttachments extends React.Component {
  state = {
    attachments: [],
    openDeleteConfirmation: false,
    attachmentId: 0,
  };

  constructor(props) {
    super(props);
    this.deleteAttachmentConfirmedClicked = this.deleteAttachmentConfirmedClicked.bind(this);
    this.deleteAttachmentClicked = this.deleteAttachmentClicked.bind(this);
    this.uploadAttachmentClicked = this.uploadAttachmentClicked.bind(this);
    this.downloadAttachmentClicked = this.downloadAttachmentClicked.bind(this);
    this.handleAttachmentClose = this.handleAttachmentClose.bind(this);
    this.handleConfirmationClose = this.handleConfirmationClose.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  async componentDidMount() {
    await this.loadAttachments()
  }

  async loadAttachments() {
    const { orderId } = this.props;
    const attachments = await OrderService.getOrderAttachments(orderId);
    this.setState({
      attachments
    });
  }

  async uploadAttachmentClicked() {
    const { orderFile } = this.state;
    const { orderId } = this.props;
    const formData = new FormData();
    formData.append('file', orderFile);

    this.setState({
      loading: true,
    });

    await OrderService.uploadAttachmentV2(orderId, formData);

    await this.loadAttachments();

    this.setState({
      orderFile: null,
      loading: false,
    });
  }

  async downloadAttachmentClicked(id, attachmentPath) {
    const { orderId } = this.props;
    this.setState({
      loading: true,
    });

    await OrderService.downloadAttachmentV2(orderId, id, attachmentPath);
    this.setState({
      loading: false,
    });
  }

  handleConfirmationClose() {
    this.setState({
      openDeleteConfirmation: false,
    });
  }

  deleteAttachmentClicked(id) {
    this.setState({
      openDeleteConfirmation: true,
      attachmentId: id,
    });
  }

  async deleteAttachmentConfirmedClicked(id) {
    const { orderId } = this.props;
    this.setState({
      loading: true,
    });
    await OrderService.deleteAttachmentV2(orderId, id);
    this.setState({
      loading: false,
      openDeleteConfirmation: false,
    });
    await this.loadAttachments();
  }

  handleAttachmentClose() {
    this.setState({
      openAttachmentDialog: false,
    });
  }

  handleFileChange(images) {
    this.setState({
      orderFile: images && images.length > 0 ? images[0] : null,
    });
  }

  render() {
    const {
      attachments,
      loading,
      openDeleteConfirmation,
      orderFile,
      attachmentId,
    } = this.state;
    return (
      <Card>
        <CardHeader color="info">
          <div>Invoice Attachments</div>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={4}>
              <InputLabel htmlFor="location">File</InputLabel>
              <FormControl>
                <FileUpload
                  isSingleImage
                  onChange={this.handleFileChange}
                />
              </FormControl>
              {orderFile &&
                <Button size="small" color="primary" disabled={loading} onClick={this.uploadAttachmentClicked}>
                  <CloudUpload />
                  &nbsp;
                  Attach
                </Button>
              }
            </GridItem>
            <GridItem xs={8}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Attachment</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attachments && attachments.map((attachment) => (
                    <TableRow>
                      <TableCell>{attachment.attachmentPath}</TableCell>
                      <TableCell>
                        <Button size="small" color="info" disabled={loading} onClick={() => this.downloadAttachmentClicked(attachment.id, attachment.attachmentPath)}>
                          <CloudDownload />
                          Download
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button size="small" color="error" disabled={loading} onClick={() => this.deleteAttachmentClicked(attachment.id)}>
                          <Delete />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </GridItem>
          </GridContainer>
        </CardBody>
        <Dialog
          open={openDeleteConfirmation}
          onClose={this.handleConfirmationClose}
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this Invoice attachment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleConfirmationClose} color="info">
              Cancel
            </Button>
            <Button onClick={() => this.deleteAttachmentConfirmedClicked(attachmentId)} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    )
  }
}

export default withStyles(style)(OrderAttachments);
