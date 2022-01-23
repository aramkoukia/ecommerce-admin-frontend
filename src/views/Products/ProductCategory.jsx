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
import HtmlEditor from '../../components/HtmlEditor/HtmlEditor';
import ProductCategoryService from '../../services/ProductCategoryService';
import PortalSettingsService from '../../services/PortalSettingsService';

const imagePlaceholder = require('../../assets/img/image-placeholder.jpg');

export default class ProductCategory extends React.Component {
  state = {
    productCategories: [],
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    showHtmlEditor: false,
    showUploadImage: false,
    showUploadHeaderImageModal: false,
    description: '',
    productTypeId: null,
    portalSettings: {},
  };

  constructor(props) {
    super(props);
    this.handleDescriptionBlur = this.handleDescriptionBlur.bind(this);
    this.handleUpdateDescription = this.handleUpdateDescription.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleUploadHeaderImage = this.handleUploadHeaderImage.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleImageHeaderChange = this.handleImageHeaderChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.productCategoriesList();
    this.getPortalSettings();
  }

  getPortalSettings() {
    PortalSettingsService.getPortalSettings()
      .then((data) => this.setState({ portalSettings: data }));
  }

  productCategoriesList() {
    ProductCategoryService.getProductCategories()
      .then((data) => this.setState({ productCategories: data }));
  }

  showHtmlEditor(productTypeId, description) {
    this.setState({
      showHtmlEditor: true,
      description,
      productTypeId,
    });
  }

  handleDescriptionBlur(description) {
    this.setState({
      description,
    });
  }

  handleImageChange(images) {
    this.setState({
      image: images && images.length > 0 ? images[0] : null,
    });
  }

  handleImageHeaderChange(images) {
    this.setState({
      headerImage: images && images.length > 0 ? images[0] : null,
    });
  }

  async handleUpdateDescription() {
    const { productTypeId, description } = this.state;
    const productType = {
      productTypeId,
      description,
    };
    await ProductCategoryService.updateProductCategoryDescription(productType);
    this.productCategoriesList();
    this.setState({
      showHtmlEditor: false,
      productTypeId: null,
      description: '',
    });
  }

  async handleUploadImage() {
    const { productTypeId, image } = this.state;
    const formData = new FormData();
    formData.append('file', image);
    await ProductCategoryService.updateProductCategoryImage(productTypeId, formData);
    this.productCategoriesList();
    this.setState({
      showUploadImage: false,
      productTypeId: null,
      image: null,
    });
  }

  async handleUploadHeaderImage() {
    const { productTypeId, headerImage } = this.state;
    const formData = new FormData();
    formData.append('file', headerImage);
    await ProductCategoryService.updateProductCategoryHeaderImage(productTypeId, formData);
    this.productCategoriesList();
    this.setState({
      showUploadHeaderImageModal: false,
      productTypeId: null,
      headerImage: null,
    });
  }

  showUploadImage(productTypeId) {
    this.setState({
      showUploadImage: true,
      productTypeId,
    });
  }

  showUploadHeaderImage(productTypeId) {
    this.setState({
      showUploadHeaderImageModal: true,
      productTypeId,
    });
  }

  handleClose() {
    this.setState({
      showUploadImage: false,
      showHtmlEditor: false,
      showUploadHeaderImageModal: false,
      productTypeId: null,
      description: '',
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
      productCategories,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      showHtmlEditor,
      showUploadImage,
      showUploadHeaderImageModal,
      description,
      portalSettings,
    } = this.state;

    const columns = [
      { title: 'Category', field: 'productTypeName' },
      {
        title: 'Website Description',
        field: 'description',
        editable: 'never',
        hidden: true,
      },
      { title: 'Product Count', field: 'productCount', editable: 'never' },
      { title: 'Sales Rank', field: 'rank', editable: 'never' },
      {
        title: 'Show On Website',
        field: 'showOnWebsite',
        lookup: { true: 'Yes', false: 'No' },
      },
      {
        field: 'thumbnailImagePath',
        title: 'Website Image',
        filtering: false,
        render: (rowData) => (
          <img
            alt={(rowData.thumbnailImagePath && rowData.productTypeName) || 'No Image'}
            src={rowData.thumbnailImagePath || imagePlaceholder}
            style={{ width: 70 }}
          />
        ),
      },
      {
        field: 'thumbnailImagePath',
        title: 'Header Image',
        filtering: false,
        render: (rowData) => (
          <img
            alt={(rowData.headerImagePath && rowData.productTypeName) || 'No Image'}
            src={rowData.headerImagePath || imagePlaceholder}
            style={{ width: 170, height: 50 }}
          />
        ),
      },
      { title: 'Id', field: 'productTypeId', hidden: true },
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
                  Product Categories. Updated &nbsp;
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
                  data={productCategories}
                  options={options}
                  title=""
                  actions={[
                    {
                      icon: 'subject',
                      tooltip: 'Update Website Description',
                      onClick: (event, rowData) => this.showHtmlEditor(
                        rowData.productTypeId,
                        rowData.description,
                      ),
                    },
                    {
                      icon: 'wallpaper',
                      tooltip: 'Upload Website Image',
                      onClick: (event, rowData) => this.showUploadImage(
                        rowData.productTypeId,
                      ),
                    },
                    {
                      icon: 'panorama',
                      tooltip: 'Upload Header Image',
                      onClick: (event, rowData) => this.showUploadHeaderImage(
                        rowData.productTypeId,
                      ),
                    },
                  ]}
                  editable={{
                    onRowAdd: (newData) => new Promise((resolve) => {
                      setTimeout(() => {
                        productCategories.push(newData);
                        ProductCategoryService.createProductCategory(newData);
                        this.setState({ productCategories }, () => resolve());
                        resolve();
                      }, 1000);
                    }),
                    onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = productCategories.indexOf(oldData);
                          productCategories[index] = newData;
                          ProductCategoryService.updateProductCategory(newData);
                          this.setState({ productCategories }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    }),
                    onRowDelete: (oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = productCategories.indexOf(oldData);
                          productCategories.splice(index, 1);
                          ProductCategoryService.deleteProductCategory(oldData);
                          this.setState({ productCategories }, () => resolve());
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
          open={showHtmlEditor}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <HtmlEditor value={description || ''} onBlur={this.handleDescriptionBlur} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleUpdateDescription} color="primary">
              Save
            </Button>
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
          maxWidth="xl"
          open={showUploadHeaderImageModal}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <p>
              Use one of the following sizes:
              <ul>
                <li><h3>1920 * 380</h3></li>
              </ul>
            </p>
            <ImageUpload singleImage onChange={this.handleImageHeaderChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleUploadHeaderImage} color="primary">
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
