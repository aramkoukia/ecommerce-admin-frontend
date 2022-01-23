import React from 'react';
import MaterialTable from 'material-table';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import CardBody from '../../components/Card/CardBody';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import WebsiteSliderService from '../../services/WebsiteSliderService';
import PortalSettingsService from '../../services/PortalSettingsService';

const imagePlaceholder = require('../../assets/img/image-placeholder.jpg');

export default class WebsiteAboutPopOver extends React.Component {
  state = {
    websiteSliders: [],
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    showUploadImage: false,
    id: null,
    portalSettings: {},
  };

  constructor(props) {
    super(props);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.websiteSlidersList();
    this.getPortalSettings();
  }

  getPortalSettings() {
    PortalSettingsService.getPortalSettings()
      .then((data) => this.setState({ portalSettings: data }));
  }

  websiteSlidersList() {
    // WebsiteSliderService.getWebsiteSliders()
    //   .then((data) => this.setState({ websiteSliders: data }));
  }

  handleImageChange(images) {
    this.setState({
      image: images && images.length > 0 ? images[0] : null,
    });
  }

  async handleUploadImage() {
    const { id, image } = this.state;
    const formData = new FormData();
    formData.append('file', image);
    await WebsiteSliderService.updateWebsiteSliderImage(id, formData);
    this.websiteSlidersList();
    this.setState({
      showUploadImage: false,
      id: null,
      image: null,
    });
  }

  showUploadImage(id) {
    this.setState({
      showUploadImage: true,
      id,
    });
  }

  handleClose() {
    this.setState({
      showUploadImage: false,
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
      websiteSliders,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      showUploadImage,
      portalSettings,
    } = this.state;

    const columns = [
      { title: 'Id', field: 'id', editable: 'never' },
      { title: 'Sub Title', field: 'subTitle' },
      { title: 'Title', field: 'title' },
      { title: 'Url', field: 'url' },
      { title: 'Background Color', field: 'bgColor' },
      {
        field: 'image',
        title: 'Image',
        editable: 'never',
        filtering: false,
        render: (rowData) => (
          <img
            alt={(rowData && rowData.image && rowData.title) || 'No Image'}
            src={((rowData && rowData.image) || imagePlaceholder)}
            style={{ width: 70 }}
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
                  Website About Pop Over information. Updated &nbsp;
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
                <MaterialTable
                  columns={columns}
                  data={websiteSliders}
                  options={options}
                  title=""
                  actions={[
                    {
                      icon: 'image',
                      tooltip: 'Upload Website Image',
                      onClick: (event, rowData) => this.showUploadImage(
                        rowData.id,
                      ),
                    },
                  ]}
                  editable={{
                    onRowAdd: (newData) => new Promise((resolve) => {
                      setTimeout(() => {
                        websiteSliders.push(newData);
                        WebsiteSliderService.createWebsiteSlider(newData);
                        this.setState({ websiteSliders }, () => resolve());
                        resolve();
                      }, 1000);
                    }),
                    onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = websiteSliders.indexOf(oldData);
                          websiteSliders[index] = newData;
                          WebsiteSliderService.updateWebsiteSlider(newData);
                          this.setState({ websiteSliders }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    }),
                    onRowDelete: (oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = websiteSliders.indexOf(oldData);
                          websiteSliders.splice(index, 1);
                          WebsiteSliderService.deleteWebsiteSlider(oldData);
                          this.setState({ websiteSliders }, () => resolve());
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
          maxWidth="xl"
          open={showUploadImage}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <p>
              Use one of the following sizes:
              <ul>
                <li>469 * 708</li>
                <li>935 * 621</li>
                <li>341 * 651</li>
              </ul>
            </p>
            <ImageUpload singleImage onChange={this.handleImageChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleUploadImage} color="primary">
              Save
            </Button>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
