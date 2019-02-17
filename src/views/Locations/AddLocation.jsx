import React from 'react';
import Check from '@material-ui/icons/Check';
import SchemaForm from 'jsonschema-form-for-material-ui';
import ReactTimeout from 'react-timeout';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Card from '../../components/Card/Card';
import Snackbar from '../../components/Snackbar/Snackbar';
import LocationService from '../../services/LocationService';

class AddLocation extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
    };
  }

  async componentDidMount() {
    this.setState({
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
    });
  }

  async onSubmit(form) {
    const result = await LocationService.addLocation(form.formData);
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'New location is saved!',
      snackbarColor: 'success',
    });

    return this.props.setTimeout(this.props.history.push(`/locations`, 2000));
  }

  render() {
    const { openSnackbar, snackbarMessage, snackbarColor } = this.state;
    const styles = {
      field: {
        display: 'grid',
      },
      root: {
        display: 'grid',
      },
    };

    const schema = {
      type: 'object',
      required: [
        'locationName',
      ],
      properties: {
        locationName: {
          type: 'string',
          title: 'Location Name',
        },
        locationAddress: {
          type: 'string',
          title: 'Location Address',
        },
      },
    };

    const uiSchema = {
      locationName: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      locationAddress: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
    };

    const initialFormData = {
      locationName: '',
      locationAddress: '',
    };

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={9}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>New Location</div>
              </CardHeader>
              <CardBody>
                <SchemaForm
                  classes={styles}
                  schema={schema}
                  uiSchema={uiSchema}
                  formData={initialFormData}
                  onSubmit={this.onSubmit}
                />

              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
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

export default ReactTimeout(AddLocation);
