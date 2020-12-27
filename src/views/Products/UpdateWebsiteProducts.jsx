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
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Button from '../../components/CustomButtons/Button';
import ProductService from '../../services/ProductService';
import TagService from '../../services/TagService';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import FileUpload from '../../components/ImageUpload/FileUpload';
import HtmlEditor from '../../components/HtmlEditor/HtmlEditor';

// const imagePlaceholder = require('../../assets/img/image-placeholder.jpg');

export default class UpdateWebsiteProducts extends React.Component {
  state = {
    products: [],
    tags: [],
    productTags: [],
    loading: false,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    showDescriptionModal: false,
    showDetailModal: false,
    showWarrantyModal: false,
    showTagsModal: false,
    showUploadImageModal: false,
    showUploadHeaderImageModal: false,
    headerImage: null,
    images: null,
    productId: null,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.showUploadHeaderImage = this.showUploadHeaderImage.bind(this);
    this.handleImageHeaderChange = this.handleImageHeaderChange.bind(this);
    this.handleUploadHeaderImage = this.handleUploadHeaderImage.bind(this);

    this.showUploadImages = this.showUploadImages.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);

    this.showUpdateCatalog = this.showUpdateCatalog.bind(this);
    this.handleCatalogChange = this.handleCatalogChange.bind(this);
    this.handleUploadCatalog = this.handleUploadCatalog.bind(this);

    this.showUpdateDescription = this.showUpdateDescription.bind(this);
    this.handleDescriptionBlur = this.handleDescriptionBlur.bind(this);
    this.handleUpdateDescription = this.handleUpdateDescription.bind(this);

    this.showUpdateDetail = this.showUpdateDetail.bind(this);
    this.handleDetailBlur = this.handleDetailBlur.bind(this);
    this.handleUpdateDetail = this.handleUpdateDetail.bind(this);

    this.showUpdateWarranty = this.showUpdateWarranty.bind(this);
    this.handleWarrantyBlur = this.handleWarrantyBlur.bind(this);
    this.handleUpdateWarranty = this.handleUpdateWarranty.bind(this);

    this.showUpdateAdditionalInfo = this.showUpdateAdditionalInfo.bind(this);
    this.handleAdditionalInfoBlur = this.handleAdditionalInfoBlur.bind(this);
    this.handleUpdateAdditionalInfo = this.handleUpdateAdditionalInfo.bind(this);

    this.showUpdateTags = this.showUpdateTags.bind(this);
    this.handleUpdateTags = this.handleUpdateTags.bind(this);
  }

  componentDidMount() {
    this.productsList();
    this.tagsList();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleClose() {
    this.setState({
      showDescriptionModal: false,
      showDetailModal: false,
      showWarrantyModal: false,
      showAdditionalInfoModal: false,
      showUploadImageModal: false,
      showUploadHeaderImageModal: false,
      showCatalogModal: false,
      showTagsModal: false,
      productId: null,
    });
  }

  productsList() {
    this.setState({ loading: true });
    ProductService.getWebsiteProducts()
      .then((data) => this.setState({ products: data, loading: false }));
  }

  tagsList() {
    TagService.getTags()
      .then((data) => this.setState({ tags: data }));
  }

  showUpdateTags() {
    this.setState({
      showTagsModal: true,
    });
  }

  showUploadImages(productId, images) {
    const existingImages = images.map((item) => item.imagePath);
    this.setState({
      showUploadImageModal: true,
      productId,
      existingImages,
    });
  }

  showUploadHeaderImage(productId, existingHeaderImage) {
    this.setState({
      showUploadHeaderImageModal: true,
      productId,
      existingHeaderImage,
    });
  }

  showUpdateCatalog(productId, existingCatalog) {
    this.setState({
      showCatalogModal: true,
      productId,
      existingCatalog,
    });
  }

  handleImageChange(images) {
    this.setState({
      images,
    });
  }

  handleImageHeaderChange(images) {
    this.setState({
      headerImage: images && images.length > 0 ? images[0] : null,
    });
  }

  handleCatalogChange(images) {
    this.setState({
      catalogFile: images && images.length > 0 ? images[0] : null,
    });
  }

  showUpdateDescription(productId, description) {
    this.setState({
      showDescriptionModal: true,
      description,
      productId,
    });
  }

  handleDescriptionBlur(description) {
    this.setState({
      description,
    });
  }

  async handleUpdateDescription() {
    this.setState({ loading: true });
    const { products, productId, description } = this.state;
    const product = {
      productId,
      description,
    };
    const index = products.findIndex(((obj) => obj.productId === productId));
    products[index].description = description;
    await ProductService.updateProductDescription(product);
    this.setState({
      showDescriptionModal: false,
      productId: null,
      description: '',
      products,
      loading: false,
    });
  }

  showUpdateDetail(productId, detail) {
    this.setState({
      showDetailModal: true,
      detail,
      productId,
    });
  }

  handleDetailBlur(detail) {
    this.setState({
      detail,
    });
  }

  async handleUpdateDetail() {
    this.setState({ loading: true });
    const { products, productId, detail } = this.state;
    const product = {
      productId,
      detail,
    };
    const index = products.findIndex(((obj) => obj.productId === productId));
    products[index].detail = detail;
    await ProductService.updateProductDetail(product);
    this.setState({
      showDetailModal: false,
      productId: null,
      detail: '',
      products,
      loading: false,
    });
  }

  showUpdateWarranty(productId, warrantyInformation) {
    this.setState({
      showWarrantyModal: true,
      warrantyInformation,
      productId,
    });
  }

  handleWarrantyBlur(warrantyInformation) {
    this.setState({
      warrantyInformation,
    });
  }

  async handleUpdateWarranty() {
    this.setState({ loading: true });
    const { products, productId, warrantyInformation } = this.state;
    const product = {
      productId,
      warrantyInformation,
    };
    const index = products.findIndex(((obj) => obj.productId === productId));
    products[index].warrantyInformation = warrantyInformation;
    await ProductService.updateProductWarranty(product);
    this.setState({
      showWarrantyModal: false,
      productId: null,
      warrantyInformation: '',
      products,
      loading: false,
    });
  }

  showUpdateAdditionalInfo(productId, additionalInformation) {
    this.setState({
      showAdditionalInfoModal: true,
      additionalInformation,
      productId,
    });
  }

  handleAdditionalInfoBlur(additionalInformation) {
    this.setState({
      additionalInformation,
    });
  }

  async handleUpdateAdditionalInfo() {
    this.setState({ loading: true });
    const { products, productId, additionalInformation } = this.state;
    const product = {
      productId,
      additionalInformation,
    };
    const index = products.findIndex(((obj) => obj.productId === productId));
    products[index].additionalInformation = additionalInformation;
    await ProductService.updateProductAdditionalInfo(product);
    this.setState({
      showAdditionalInfoModal: false,
      productId: null,
      additionalInformation: '',
      products,
      loading: false,
    });
  }

  async handleUpdateTags() {
    this.setState({ loading: true });
    const { products, productId, tags } = this.state;
    const product = {
      productId,
      tags,
    };
    const index = products.findIndex(((obj) => obj.productId === productId));
    products[index].tags = tags;
    await ProductService.updateProductTags(product);
    this.setState({
      showTagsModal: false,
      productId: null,
      tags: '',
      products,
      loading: false,
    });
  }

  async handleUploadImage() {
    const { productId, images } = this.state;
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('file', image);
    });
    await ProductService.updateProductImages(productId, formData);
    this.productsList();
    this.setState({
      showUploadImageModal: false,
      productId: null,
      images: null,
    });
  }

  async handleUploadHeaderImage() {
    const { productId, headerImage } = this.state;
    const formData = new FormData();
    formData.append('file', headerImage);
    await ProductService.updateProductHeaderImage(productId, formData);
    this.productsList();
    this.setState({
      showUploadHeaderImageModal: false,
      productId: null,
      headerImage: null,
    });
  }

  async handleUploadCatalog() {
    const { productId, catalogFile } = this.state;
    const formData = new FormData();
    formData.append('file', catalogFile);
    await ProductService.updateProductCatalog(productId, formData);
    this.productsList();
    this.setState({
      showCatalogModal: false,
      productId: null,
      catalogFile: null,
    });
  }

  // handleChangeMultiple = (event) => {
  //   const { options } = event.target;
  //   const value = [];
  //   for (let i = 0, l = options.length; i < l; i += 1) {
  //     if (options[i].selected) {
  //       value.push(options[i].value);
  //     }
  //   }
  //   // setPersonName(value);
  // };

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
      {
        title: 'Product Code', field: 'productCode', readonly: true, editable: 'never',
      },
      {
        title: 'Product Name', field: 'productName', readonly: true, editable: 'never',
      },
      {
        title: 'URL', field: 'slugsUrl', readonly: true, editable: 'never',
      },
      {
        title: 'Tags', field: 'tags', readonly: true, editable: 'never',
      },
      {
        title: 'Category', field: 'productTypeName', readonly: true, editable: 'never',
      },
      {
        field: 'thumbnailImagePath',
        title: 'Website Image',
        filtering: false,
        render: (rowData) => (
          rowData.images && rowData.images.length > 0 ? 'Yes' : 'No'
          // <img
          //   alt={(rowData.images && rowData.images[0] && rowData.productTypeName) || 'No Image'}
          //   src={(rowData.images && rowData.images[0] && rowData.images[0].imagePath)
          //     || imagePlaceholder}
          //   style={{ width: 70 }}
          // />
        ),
      },
      {
        field: 'thumbnailImagePath',
        title: 'Header Image',
        filtering: false,
        render: (rowData) => (
          rowData.headerImagePath ? 'Yes' : 'No'
          // <img
          //   alt={(rowData.headerImagePath && rowData.productTypeName) || 'No Image'}
          //   src={rowData.headerImagePath || imagePlaceholder}
          //   style={{ width: 170, height: 50 }}
          // />
        ),
      },
      {
        title: 'Product Id',
        field: 'productId',
        hidden: true,
        readonly: true,
        editable: 'never',
      },
    ];

    const {
      products,
      loading,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      description,
      detail,
      warrantyInformation,
      additionalInformation,
      showUploadImageModal,
      showUploadHeaderImageModal,
      showCatalogModal,
      showDescriptionModal,
      showDetailModal,
      showAdditionalInfoModal,
      showWarrantyModal,
      showTagsModal,
      existingImages,
      existingHeaderImage,
      existingCatalog,
      tags,
      productTags,
    } = this.state;

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
                  Update Product Content for the Public Website
                </div>
              </CardHeader>
              <CardBody>
                {loading && (<LinearProgress />)}
                <MaterialTable
                  columns={columns}
                  data={products}
                  options={options}
                  title="Check out the product here: https://ecommerce-frontend-v2.vercel.app/"
                  actions={[
                    {
                      icon: 'wallpaper',
                      tooltip: 'Upload Website Images',
                      onClick: (event, rowData) => this.showUploadImages(
                        rowData.productId,
                        rowData.images,
                      ),
                    },
                    {
                      icon: 'panorama',
                      tooltip: 'Upload Header Image',
                      onClick: (event, rowData) => this.showUploadHeaderImage(
                        rowData.productId,
                        rowData.headerImagePath,
                      ),
                    },
                    {
                      icon: 'description',
                      tooltip: 'Product Description',
                      onClick: (event, rowData) => this.showUpdateDescription(
                        rowData.productId,
                        rowData.description,
                      ),
                    },
                    {
                      icon: 'details',
                      tooltip: 'Product Details',
                      onClick: (event, rowData) => this.showUpdateDetail(
                        rowData.productId,
                        rowData.detail,
                      ),
                    },
                    {
                      icon: 'info',
                      tooltip: 'Product Additional Info',
                      onClick: (event, rowData) => this.showUpdateAdditionalInfo(
                        rowData.productId,
                        rowData.additionalInformation,
                      ),
                    },
                    {
                      icon: 'book',
                      tooltip: 'Product Catalog',
                      onClick: (event, rowData) => this.showUpdateCatalog(
                        rowData.productId,
                        rowData.userManualPath,
                      ),
                    },
                    {
                      icon: 'layers',
                      tooltip: 'Product Warranty',
                      onClick: (event, rowData) => this.showUpdateWarranty(
                        rowData.productId,
                        rowData.warrantyInformation,
                      ),
                    },
                    {
                      icon: 'local_offer',
                      tooltip: 'Tags',
                      onClick: (event, rowData) => this.showUpdateTags(
                        rowData.productId,
                      ),
                    },
                  ]}
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
          open={showDescriptionModal}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Product Website Description
                </div>
              </CardHeader>
              <CardBody>
                <HtmlEditor value={description || ''} onBlur={this.handleDescriptionBlur} />
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            {loading && (<LinearProgress />)}
            <Button onClick={this.handleUpdateDescription} color="primary">
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
          open={showDetailModal}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Product Website Details
                </div>
              </CardHeader>
              <CardBody>
                <HtmlEditor value={detail || ''} onBlur={this.handleDetailBlur} />
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            {loading && (<LinearProgress />)}
            <Button onClick={this.handleUpdateDetail} color="primary">
              Save
            </Button>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          maxWidth="md"
          fullWidth
          open={showWarrantyModal}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Product Warranty
                </div>
              </CardHeader>
              <CardBody>
                <HtmlEditor value={warrantyInformation || ''} onBlur={this.handleWarrantyBlur} />
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            {loading && (<LinearProgress />)}
            <Button onClick={this.handleUpdateWarranty} color="primary">
              Save
            </Button>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          maxWidth="md"
          fullWidth
          open={showAdditionalInfoModal}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Product Additional Info
                </div>
              </CardHeader>
              <CardBody>
                <HtmlEditor value={additionalInformation || ''} onBlur={this.handleAdditionalInfoBlur} />
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            {loading && (<LinearProgress />)}
            <Button onClick={this.handleUpdateAdditionalInfo} color="primary">
              Save
            </Button>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          maxWidth="md"
          fullWidth
          open={showUploadImageModal}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Update Product Images
                </div>
              </CardHeader>
              <CardBody>
                <p>
                  Use one of the following sizes:
                  <ul>
                    <li><h3>600 * 800</h3></li>
                  </ul>
                </p>
                <ImageUpload
                  existingImages={existingImages}
                  isSingleImage={false}
                  onChange={this.handleImageChange}
                />
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            {loading && (<LinearProgress />)}
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
                  Update Product Tags
                </div>
              </CardHeader>
              <CardBody>
                <FormControl style={{ minWidth: 800 }}>
                  <InputLabel id="demo-mutiple-chip-label">Select Tags</InputLabel>
                  <Select
                    fullWidth
                    autoWidth="true"
                    labelId="demo-mutiple-chip-label"
                    id="productTags"
                    multiple
                    name="productTags"
                    value={productTags}
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
        <Dialog
          fullWidth
          maxWidth="xl"
          open={showUploadHeaderImageModal}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Update Product Page Header Image
                </div>
              </CardHeader>
              <CardBody>
                <p>
                  Use one of the following sizes:
                  <ul>
                    <li><h3>1920 * 380</h3></li>
                  </ul>
                </p>
                <ImageUpload
                  existingImages={existingHeaderImage && [existingHeaderImage]}
                  isSingleImage
                  onChange={this.handleImageHeaderChange}
                />
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            {loading && (<LinearProgress />)}
            <Button onClick={this.handleUploadHeaderImage} color="primary">
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
          open={showCatalogModal}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Update Product Catalog file
                </div>
              </CardHeader>
              <CardBody>
                <FileUpload
                  existingFiles={existingCatalog && [existingCatalog]}
                  isSingleImage
                  onChange={this.handleCatalogChange}
                />
              </CardBody>
            </Card>
          </DialogContent>
          <DialogActions>
            {loading && (<LinearProgress />)}
            <Button onClick={this.handleUploadCatalog} color="primary">
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
