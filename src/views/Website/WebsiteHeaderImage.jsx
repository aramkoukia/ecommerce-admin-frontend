import React from 'react';
import { Button } from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import PropTypes from 'prop-types';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import WebsitePageService from '../../services/WebsitePageService';

export default class WebsiteHeaderImage extends React.Component {
  state = {
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    websitePage: {},
  };

  constructor(props) {
    super(props);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  componentDidMount() {
    this.loadHeaderImage();
  }

  async loadHeaderImage() {
    const { url } = this.props;
    const websitePage = await WebsitePageService.getWebsitePage(encodeURIComponent(url));
    this.setState({
      websitePage,
    });
  }

  handleImageChange(images) {
    this.setState({
      image: images && images.length > 0 ? images[0] : null,
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleUploadImage() {
    const { image } = this.state;
    const { url } = this.props;
    const formData = new FormData();
    formData.append('file', image);
    await WebsitePageService.updateWebsitePageImage(encodeURIComponent(url), formData);
    this.setState({
      image: null,
      openSnackbar: true,
      snackbarMessage: 'Header Image saved!',
      snackbarColor: 'success',

    });
  }

  render() {
    const styles = {
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
      websitePage,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      image,
    } = this.state;

    return (
      <div>
        <Card>
          <CardHeader color="info">
            <div className={styles.cardTitleWhite}>
              Website Page - Header Image
            </div>
          </CardHeader>
          <CardBody>
            Use the following size: 1920 * 380
            <ImageUpload
              singleImage
              onChange={this.handleImageChange}
              existingImages={[websitePage.headerImagePath]}
            />
            <Button disabled={image === null || image === undefined} onClick={this.handleUploadImage} color="primary">
              Save
            </Button>
          </CardBody>
        </Card>
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

WebsiteHeaderImage.propTypes = {
  url: PropTypes.string.isRequired,
};
