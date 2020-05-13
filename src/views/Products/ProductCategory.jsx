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

const imagePlaceholder = require('../../assets/img/image-placeholder.jpg');

export default class ProductCategory extends React.Component {
  state = {
    productCategories: [],
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    showHtmlEditor: false,
    showUploadImage: false,
  };

  componentDidMount() {
    this.productCategoriesList();
  }

  productCategoriesList() {
    ProductCategoryService.getProductCategories()
      .then((data) => this.setState({ productCategories: data }));
  }

  showHtmlEditor() {
    this.setState({ showHtmlEditor: true });
  }

  showUploadImage() {
    this.setState({ showUploadImage: true });
  }

  handleClose() {
    this.setState({
      showUploadImage: false,
      showHtmlEditor: false,
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
    } = this.state;

    const columns = [
      { title: 'Category', field: 'productTypeName' },
      // { title: 'Website Description', field: 'description', editable: 'never' },
      { title: 'Product Count', field: 'productCount', editable: 'never' },
      { title: 'Sales Rank', field: 'rank', editable: 'never' },
      { title: 'Show On Website', field: 'showOnWebsite' },
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
                <div className={styles.cardTitleWhite}>Product Categories</div>
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
                      onClick: (event, rowData) => this.showHtmlEditor(rowData.productTypeId),
                    },
                    {
                      icon: 'image',
                      tooltip: 'Upload Website Image',
                      onClick: (event, rowData) => this.showUploadImage(rowData.productTypeId),
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
          open={showHtmlEditor}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <HtmlEditor />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={showUploadImage}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <ImageUpload />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
