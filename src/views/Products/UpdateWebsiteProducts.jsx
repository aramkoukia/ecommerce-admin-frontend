import React from 'react';
import MaterialTable from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import Check from '@material-ui/icons/Check';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Button from '../../components/CustomButtons/Button';
import ProductService from '../../services/ProductService';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import HtmlEditor from '../../components/HtmlEditor/HtmlEditor';

const imagePlaceholder = require('../../assets/img/image-placeholder.jpg');

export default class UpdateWebsiteProducts extends React.Component {
  state = {
    products: [],
    loading: false,
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    showHtmlEditor: false,
    showUploadImage: false,
    showTags: false,
    showUploadHeaderImageModal: false,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.updateTags = this.updateTags.bind(this);
    this.updateImages = this.updateImages.bind(this);
    this.updateHeaderImages = this.updateHeaderImages.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
    this.updateWarranty = this.updateWarranty.bind(this);
    this.updateCatalog = this.updateCatalog.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.productsList();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleClose() {
    this.setState({
      showHtmlEditor: false,
      showUploadImage: false,
      showTags: false,
    });
  }

  productsList() {
    this.setState({ loading: true });
    ProductService.getWebsiteProducts()
      .then((data) => this.setState({ products: data, loading: false }));
  }

  updateTags(rowData) {
    this.setState({
      showTags: true,
    });
  }

  updateImages(rowData) {
    this.setState({
      showUploadImage: true,
    });
  }

  updateHeaderImages(rowData) {
    this.setState({
      showUploadHeaderImageModal: true,
    });
  }

  updateDescription(rowData) {
    this.setState({
      showHtmlEditor: true,
    });
  }

  updateCatalog(rowData) {
    this.setState({
      showHtmlEditor: true,
    });
  }

  updateWarranty(rowData) {
    this.setState({
      showHtmlEditor: true,
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
          <img
            alt={(rowData.images && rowData.images[0] && rowData.productTypeName) || 'No Image'}
            src={(rowData.images && rowData.images[0] && rowData.images[0].imagePath)
              || imagePlaceholder}
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
      showHtmlEditor,
      showUploadImage,
      showTags,
      description,
      showUploadHeaderImageModal,
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
                <MaterialTable
                  columns={columns}
                  data={products}
                  options={options}
                  title="Check out the product here: https://ecommerce-frontend-v2.vercel.app/"
                  actions={[
                    {
                      icon: 'wallpaper',
                      tooltip: 'Upload Website Images',
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
                    {
                      icon: 'description',
                      tooltip: 'Website Description',
                      onClick: (event, rowData) => this.updateDescription(rowData),
                    },
                    {
                      icon: 'book',
                      tooltip: 'Product Catalog',
                      onClick: (event, rowData) => this.updateCatalog(rowData),
                    },
                    {
                      icon: 'layers',
                      tooltip: 'Product Warranty',
                      onClick: (event, rowData) => this.updateWarranty(rowData),
                    },
                    {
                      icon: 'local_offer',
                      tooltip: 'Tags',
                      onClick: (event, rowData) => this.updateTags(rowData),
                    },
                  ]}
                />

                {loading && (<LinearProgress />)}
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
                <li><h3>600 * 800</h3></li>
              </ul>
            </p>
            <ImageUpload onChange={this.handleImageChange} />
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
          open={showTags}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            Product Tags
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleUpdateTags} color="primary">
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
