import React from 'react';
import Check from '@material-ui/icons/Check';
import SchemaForm from 'jsonschema-form-for-material-ui';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Card from '../../components/Card/Card';
import Snackbar from '../../components/Snackbar/Snackbar';
import CustomerService from '../../services/CustomerService';

// import styles from './styles';

export default class AddCustomer extends React.Component {
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

  onSubmit(form) {
    CustomerService.addCustomer(form.formData);
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'New customer is saved!',
      snackbarColor: 'success',
    });
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
      // "title": "A registration form",
      // "description": "A simple form example.",
      type: 'object',
      required: [
        'firstName',
        'lastName',
        'companyName',
        'phoneNumber',
        'country',
        'city',
        'email',
      ],
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name',
        },
        lastName: {
          type: 'string',
          title: 'Last Name',
        },
        companyName: {
          type: 'string',
          title: 'Company Name',
        },
        phoneNumber: {
          type: 'string',
          title: 'Phone Number',
        },
        mobile: {
          type: 'string',
          title: 'Mobile',
        },
        country: {
          type: 'string',
          title: 'Country',
          enum: ['Canada', 'United States', 'Other'],
        },
        address: {
          type: 'string',
          title: 'Address',
        },
        city: {
          type: 'string',
          title: 'City',
        },
        province: {
          type: 'string',
          title: 'Province',
          enum: ['BC', 'AB', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT', 'OTHER'],
        },
        postalCode: {
          type: 'string',
          title: 'Postal Code',
        },
        pstNumber: {
          type: 'string',
          title: 'PST Number',
        },
        creditLimit: {
          type: 'number',
          title: 'Credit Limit',
        },
        userName: {
          type: 'string',
          title: 'User Name',
        },
        email: {
          type: 'string',
          title: 'Email',
        },
        website: {
          type: 'string',
          title: 'Website',
        },
      },
    };

    const uiSchema = {
      // "ui:orientation": "row",
      firstName: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      lastName: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      companyName: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      phoneNumber: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      mobile: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      country: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      address: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      city: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      province: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      postalCode: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      pstNumber: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      creditLimit: {
        'ui:autofocus': true,
        'ui:emptyValue': 0,
      },
      userName: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      email: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
      website: {
        'ui:autofocus': true,
        'ui:emptyValue': '',
      },
    };

    const initialFormData = {
      firstName: '',
      lastName: '',
      companyName: '',
      phoneNumber: '',
      mobile: '',
      country: 'Canada',
      address: '',
      city: '',
      province: 'BC',
      postalCode: '',
      pstNumber: '',
      creditLimit: 0,
      userName: '',
      email: '',
      website: '',
    };

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={9}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>New Customer</div>
              </CardHeader>
              <CardBody>
                <SchemaForm
                  classes={styles}
                  schema={schema}
                  uiSchema={uiSchema}
                  formData={initialFormData}
                // onCancel={this.onCancel}
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
