import React from 'react';
import MaterialTable from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import Check from '@material-ui/icons/Check';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Button from '../../components/CustomButtons/Button';
import CardBody from '../../components/Card/CardBody';
import ApplicationService from '../../services/ApplicationService';
import PortalSettingsService from '../../services/PortalSettingsService';
import TagService from '../../services/TagService';

const imagePlaceholder = require('../../assets/img/image-placeholder.jpg');

export default class CustomApplications extends React.Component {
  state = {
    applications: [],
    loading: false,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    showUploadImage: false,
    showTagsModal: false,
    stepDetailTags: [],
    tags: [],
    portalSettings: {},
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showUpdateImage = this.showUpdateImage.bind(this);
    this.showUpdateTags = this.showUpdateTags.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleUpdateTags = this.handleUpdateTags.bind(this);
  }

  componentDidMount() {
    this.applicationsList();
    this.tagsList();
    this.getPortalSettings();
  }

  getPortalSettings() {
    PortalSettingsService.getPortalSettings()
      .then((data) => this.setState({ portalSettings: data }));
  }

  tagsList() {
    TagService.getTags()
      .then((data) => this.setState({ tags: data }));
  }

  handleImageChange(images) {
    this.setState({
      image: images && images.length > 0 ? images[0] : null,
    });
  }

  showUpdateImage(detailRowData) {
    const { applicationStepDetailId } = detailRowData;
    this.setState({ showUploadImage: true, stepDetailId: applicationStepDetailId });
  }

  async handleUploadImage() {
    const { stepDetailId, image } = this.state;
    const formData = new FormData();
    formData.append('file', image);
    await ApplicationService.updateStepDetailImage(stepDetailId, formData);
    this.applicationsList();
    this.setState({
      showUploadImage: false,
      stepDetailId: null,
      image: null,
    });
  }

  async handleUpdateTags() {
    this.setState({ loading: true });
    const { stepDetailId, stepDetailTags } = this.state;
    // const index = applications.findIndex(((obj) => obj.productId === productId));
    // applications[index].tags = productTags;
    await ApplicationService.updateStepDetailTags(stepDetailId, stepDetailTags);
    this.applicationsList();
    this.setState({
      showTagsModal: false,
      stepDetailId: null,
      // applications,
      stepDetailTags: [],
      loading: false,
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleClose() {
    this.setState({
      showUploadImage: false,
    });
  }

  showUpdateTags(detailRowData) {
    const { applicationStepDetailId, tags } = detailRowData;
    this.setState({
      showTagsModal: true,
      stepDetailTags: tags,
      stepDetailId: applicationStepDetailId,
    });
  }

  applicationsList() {
    this.setState({ loading: true });
    ApplicationService.getStepsAndStepDetails()
      .then((data) => this.setState({ applications: data, loading: false }));
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
      { title: 'Step Title', field: 'stepTitle' },
      { title: 'Step Description', field: 'stepDescription' },
      { title: 'Sort Order', field: 'sortOrder' },
      {
        title: 'Application Step Id', field: 'applicationStepId', readonly: true, hidden: true,
      },
    ];

    const {
      applications,
      loading,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      showUploadImage,
      showTagsModal,
      portalSettings,
      stepDetailTags,
      tags,
    } = this.state;

    const detailColumns = [
      { title: 'Title', field: 'stepDetailTitle' },
      { title: 'Description', field: 'stepDetailDescription' },
      {
        field: 'tags',
        title: 'Tags',
        readonly: true,
        editable: 'never',
        filtering: false,
        render: (rowData) => (
          rowData.tags.map((tag) => (<Chip key={tag.tagId} label={tag.tagName} />))
        ),
      },
      { title: 'Sort Order', field: 'sortOrder' },
      {
        title: 'Image',
        field: 'thumbnailImagePath',
        filtering: false,
        readonly: true,
        editable: 'never',
        render: (detailRowData) => (
          <img
            alt={(detailRowData && detailRowData.thumbnailImagePath) || 'No Image'}
            src={(detailRowData && detailRowData.thumbnailImagePath) || imagePlaceholder}
            style={{ width: 100 }}
          />
        ),
      },
      {
        title: 'applicationStepDetailId', field: 'applicationStepDetailId', hidden: true, readonly: true,
      },
    ];

    const options = {
      paging: true,
      pageSizeOptions: [10, 20, 50],
      pageSize: 10,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      search: true,
    };

    const detailOptions = {
      paging: false,
      columnsButton: false,
      exportButton: false,
      filtering: false,
      search: false,
    };

    const detailPanel = [
      {
        tooltip: 'Details',
        render: (rowData) => (
          <div
            style={{
              width: '90%',
              backgroundColor: 'green',
            }}
          >
            <MaterialTable
              columns={detailColumns}
              data={rowData.stepDetails}
              options={detailOptions}
              title=""
              actions={[
                {
                  icon: 'image',
                  tooltip: 'Image',
                  onClick: (event, detailRowData) => this.showUpdateImage(detailRowData),
                },
                {
                  icon: 'local_offer',
                  tooltip: 'Tags',
                  onClick: (event, detailRowData) => this.showUpdateTags(detailRowData),
                }]}
              editable={{
                onRowUpdate: (newData) => new Promise(() => {
                  ApplicationService.updateStepDetail(newData.applicationStepDetailId, newData);
                  window.location.reload();
                }),
                onRowAdd: (newData) => new Promise((resolve) => {
                  setTimeout(() => {
                    newData.applicationStepId = rowData.applicationStepId;
                    ApplicationService.createStepDetail(newData);
                    window.location.reload();
                    // rowData.stepDetails.push(newData);
                    // this.setState({ applications }, () => resolve());
                  }, 1000);
                }),
                onRowDelete: (oldData) => new Promise((resolve) => {
                  setTimeout(() => {
                    // const index = rowData.stepDetails.indexOf(oldData);
                    // rowData.stepDetails.splice(index, 1);
                    ApplicationService.deleteStepDetail(oldData.applicationStepDetailId);
                    window.location.reload();
                    // this.setState({ applications }, () => resolve());
                  }, 1000);
                }),

              }}
            />
          </div>
        ),
      },
    ];

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Custom Applications. Updated &nbsp;
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
                  data={applications}
                  detailPanel={detailPanel}
                  options={options}
                  onRowClick={this.rowClicked}
                  title=""
                  editable={{
                    onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = applications.indexOf(oldData);
                          applications[index] = newData;
                          ApplicationService.updateStep(newData.applicationStepId, newData);
                          this.setState({ applications }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    }),
                    onRowAdd: (newData) => new Promise((resolve) => {
                      setTimeout(() => {
                        ApplicationService.createStep(newData);
                        window.location.reload();
                        // applications.push(newData);
                        // this.setState({ applications }, () => resolve());
                      }, 1000);
                    }),
                    onRowDelete: (oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = applications.indexOf(oldData);
                          applications.splice(index, 1);
                          ApplicationService.deleteStep(oldData.applicationStepId);
                          this.setState({ applications }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    }),
                  }}
                />
              </CardBody>
            </Card>
            {loading && (<LinearProgress />)}

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
          open={showUploadImage}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <p>
              Use one of the following sizes:
              <ul>
                <li><h3>438 * 438</h3></li>
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
        <Dialog
          fullWidth
          maxWidth="md"
          open={showTagsModal}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Update Custom Application Step Tags
                </div>
              </CardHeader>
              <CardBody>
                <FormControl style={{ minWidth: 800 }}>
                  <InputLabel id="demo-mutiple-chip-label">Select Tags</InputLabel>
                  <Select
                    fullWidth
                    autoWidth="true"
                    labelId="demo-mutiple-chip-label"
                    id="stepDetailTags"
                    multiple
                    name="stepDetailTags"
                    value={stepDetailTags}
                    onChange={this.handleChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={(selectedTags) => (
                      <div>
                        {selectedTags.map((tag) => (
                          <Chip key={tag.tagId} label={tag.tagName} />
                        ))}
                      </div>
                    )}
                  >
                    {tags.map((tag) => (
                      <MenuItem key={tag.tagId} value={tag}>
                        {tag.tagName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            {loading && (<LinearProgress />)}
            <Button onClick={this.handleUpdateTags} color="primary">
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
