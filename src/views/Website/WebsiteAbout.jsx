import React from 'react';
import MaterialTable from 'material-table';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Snackbar from '../../components/Snackbar/Snackbar';
import HtmlEditor from '../../components/HtmlEditor/HtmlEditor';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import CardBody from '../../components/Card/CardBody';
import WebsiteHeaderImage from './WebsiteHeaderImage';
import WebsiteAboutService from '../../services/WebsiteAboutService';
import PortalSettingsService from '../../services/PortalSettingsService';

const imagePlaceholder = require('../../assets/img/image-placeholder.jpg');

export default class WebsiteAbout extends React.Component {
  state = {
    websiteAbout: [],
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    id: null,
    showDialog: false,
    portalSettings: {},
  };

  constructor(props) {
    super(props);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.onAddNew = this.onAddNew.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDescriptionBlur = this.handleDescriptionBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.websiteAboutList();
    this.getPortalSettings();
  }

  onEdit(id, title, sortOrder, aboutText) {
    this.setState({
      id,
      showDialog: true,
      title,
      sortOrder,
      aboutText,
      isEdit: true,
    });
  }

  onAddNew() {
    this.setState({
      showDialog: true,
      isEdit: false,
    });
  }

  async onSave() {
    const {
      title,
      sortOrder,
      aboutText,
      isEdit,
      id,
    } = this.state;

    const about = {
      title,
      sortOrder,
      aboutText,
    };
    if (isEdit) {
      about.id = id;
      const result = await WebsiteAboutService.updateWebsiteAbout(about);
      if (result && result.email) {
        this.setState({
          openSnackbar: true,
          snackbarMessage: 'About Us record created!',
          snackbarColor: 'success',
        });
      }
    } else {
      const result = await WebsiteAboutService.createWebsiteAbout(about);
      if (result && result.email) {
        this.setState({
          openSnackbar: true,
          snackbarMessage: 'About Us record created!',
          snackbarColor: 'success',
        });
      }
    }

    this.setState({
      showDialog: false,
      title: '',
      sortOrder: 0,
      aboutText: '',
    });

    this.websiteAboutList();
  }

  getPortalSettings() {
    PortalSettingsService.getPortalSettings()
      .then((data) => this.setState({ portalSettings: data }));
  }

  handleImageChange(images) {
    this.setState({
      image: images && images.length > 0 ? images[0] : null,
    });
  }

  handleDescriptionBlur(aboutText) {
    this.setState({
      aboutText,
    });
  }

  websiteAboutList() {
    WebsiteAboutService.getWebsiteAbouts()
      .then((data) => this.setState({ websiteAbout: data }));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleUploadImage() {
    const { id, image } = this.state;
    const formData = new FormData();
    formData.append('file', image);
    await WebsiteAboutService.updateWebsiteAboutImage(id, formData);
    this.websiteAboutList();
    this.setState({
      id: null,
      image: null,
    });
  }

  handleClose() {
    this.setState({
      showDialog: false,
      id: null,
      image: null,
    });
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

    const {
      websiteAbout,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      showDialog,
      title,
      sortOrder,
      aboutText,
      portalSettings,
    } = this.state;

    const columns = [
      { title: 'Id', field: 'id', editable: 'never' },
      { title: 'Title', field: 'title' },
      { title: 'Sort Order', field: 'sortOrder' },
      {
        field: 'image',
        title: 'Image',
        editable: 'never',
        filtering: false,
        render: (rowData) => (
          <img
            alt={(rowData && rowData.headerImagePath) || 'No Image'}
            src={((rowData && rowData.headerImagePath) || imagePlaceholder)}
            style={{ width: 120 }}
          />
        ),
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

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Website About information. Updated &nbsp;
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={portalSettings.publicWebsiteUrl}
                    style={{ color: 'blue' }}
                  >
                    here
                  </a>
                </div>
              </CardHeader>
              <CardBody>
                <WebsiteHeaderImage url="/about" />
                <br />
                <Button color="primary" onClick={this.onAddNew}>
                  New About Us record
                </Button>
                <MaterialTable
                  columns={columns}
                  data={websiteAbout}
                  options={options}
                  title=""
                  actions={[
                    {
                      icon: 'edit',
                      tooltip: 'Edit',
                      onClick: (event, rowData) => this.onEdit(
                        rowData.id,
                        rowData.title,
                        rowData.sortOrder,
                        rowData.aboutText,
                      ),
                    },
                  ]}
                  editable={{
                    onRowDelete: (oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = websiteAbout.indexOf(oldData);
                          websiteAbout.splice(index, 1);
                          WebsiteAboutService.deleteWebsiteAbout(oldData);
                          this.setState({ websiteAbout }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    }),
                  }}
                />
              </CardBody>
            </Card>
          </GridItem>
          <Snackbar
            place="tl"
            color={snackbarColor}
            icon={Check}
            message={snackbarMessage}
            open={openSnackbar}
            closeNotification={() => this.setState({ openSnackbar: false })}
            close
          />
        </GridContainer>
        <Dialog
          open={showDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">About Us</DialogTitle>
          <DialogContent>
            <GridContainer>
              <GridItem xs={12}>
                <TextField
                  name="title"
                  label="title"
                  type="text"
                  onChange={this.handleChange}
                  value={title}
                  fullWidth="true"
                />
              </GridItem>
              <GridItem xs={12}>
                <HtmlEditor value={aboutText || ''} onBlur={this.handleDescriptionBlur} />
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  name="sortOrder"
                  label="Sort Order"
                  type="text"
                  onChange={this.handleChange}
                  value={sortOrder}
                  fullWidth="false"
                />
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onSave} color="primary">
              Save
            </Button>
            <Button onClick={this.handleClose} color="info">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
