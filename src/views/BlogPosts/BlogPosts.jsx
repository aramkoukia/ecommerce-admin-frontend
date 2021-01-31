import React from 'react';
import MaterialTable from 'material-table';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  CircularProgress,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Slide,
} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';
import HtmlEditor from '../../components/HtmlEditor/HtmlEditor';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import CardBody from '../../components/Card/CardBody';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import BlogPostService from '../../services/BlogPostService';
import PortalSettingsService from '../../services/PortalSettingsService';

export default class BlogPosts extends React.Component {
  state = {
    blogPosts: [],
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    showUploadImage: false,
    showPostDialog: false,
    title: '',
    shortDescription: '',
    longDescription: '',
    tags: '',
    id: null,
    portalSettings: {},
  };

  constructor(props) {
    super(props);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.newPost = this.newPost.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDescriptionBlur = this.handleDescriptionBlur.bind(this);
  }

  componentDidMount() {
    this.blogPostsList();
    this.getPortalSettings();
  }

  handleClose = () => {
    this.setState({
      showPostDialog: false,
    });
  }

  handleImageChange(images) {
    this.setState({
      image: images && images.length > 0 ? images[0] : null,
    });
  }

  async handleUploadImage() {
    const { image } = this.state;
    const formData = new FormData();
    formData.append('file', image);
    // await ProductCategoryService.updateProductCategoryImage(productTypeId, formData);
    // this.productCategoriesList();
    this.setState({
      showUploadImage: false,
      image: null,
    });
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleDescriptionBlur(longDescription) {
    this.setState({
      longDescription,
    });
  }

  blogPostsList() {
    BlogPostService.getBlogPosts()
      .then((data) => this.setState({ blogPosts: data }));
  }

  getPortalSettings() {
    PortalSettingsService.getPortalSettings()
      .then((data) => this.setState({ portalSettings: data }));
  }

  newPost() {
    this.setState({
      showPostDialog: true,
    });
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
    await BlogPostService.updateBlogPostImage(id, formData);
    this.blogPostsList();
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
      blogPosts,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      showUploadImage,
      showPostDialog,
      title,
      shortDescription,
      longDescription,
      tags,
      portalSettings,
    } = this.state;

    const columns = [
      { title: 'Title', field: 'title' },
      { title: 'Modified Date', field: 'modifiedDate', editable: 'never' },
      { title: 'Published Date', field: 'publishedDate', editable: 'never' },
      { title: 'Published', field: 'published', editable: 'never' },
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
                  Blog Posts. Updated &nbsp;
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
                <Button color="primary" onClick={this.newPost}>
                  <Add />
                  New Post
                </Button>
                <MaterialTable
                  columns={columns}
                  data={blogPosts}
                  options={options}
                  title=""
                  actions={[
                    {
                      icon: 'image',
                      tooltip: 'Publish',
                      onClick: (event, rowData) => this.showUploadImage(
                        rowData.id,
                      ),
                    },
                  ]}
                  editable={{
                    onRowDelete: (oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = blogPosts.indexOf(oldData);
                          blogPosts.splice(index, 1);
                          BlogPostService.deleteBlogPost(oldData);
                          this.setState({ blogPosts }, () => resolve());
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
          fullScreen
          open={showPostDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <AppBar style={{ position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                <CloseIcon />
                Close
              </IconButton>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <GridContainer md={12}>
              <GridItem md={12}>
                <TextField
                  name="title"
                  label="Title"
                  type="text"
                  onChange={this.handleChange}
                  value={title}
                  fullWidth="true"
                />
              </GridItem>
              <GridItem md={12} m={20}>
                Small Post Image
                <p>
                  Use one of the following sizes:
                  <ul>
                    <li>370 * 200</li>
                  </ul>
                </p>
                <ImageUpload singleImage onChange={this.handleImageChange} />
              </GridItem>
              <GridItem md={12} m={20}>
                Large Heading Image
                <p>
                  Use one of the following sizes:
                  <ul>
                    <li>X * X</li>
                  </ul>
                </p>
                <ImageUpload singleImage onChange={this.handleImageChange} />
              </GridItem>
              <GridItem md={12} m={20}>
                <TextField
                  name="shortDescription"
                  label="Short Description"
                  type="text"
                  onChange={this.handleChange}
                  value={shortDescription}
                  fullWidth="true"
                  multiline
                  rowsMax={5}
                />
              </GridItem>
              <GridItem md={12}>
                <HtmlEditor value={longDescription || ''} onBlur={this.handleDescriptionBlur} />
              </GridItem>
              <GridItem md={12}>
                <TextField
                  name="tags"
                  label="Tags"
                  type="text"
                  onChange={this.handleChange}
                  value={tags}
                  fullWidth="true"
                />
              </GridItem>
              <GridItem md={12}>
                <Button color="primary" onClick={this.onSubmit}>
                  Save
                </Button>
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
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
