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
import CustomerService from '../../services/CustomerService';

class EditCustomer extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      customer: {},
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const customerId = match.params.id;
    const customer = await CustomerService.getCustomer(customerId);
    this.setState({
      customer,
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
    });
  }

  async onSubmit(form) {
    const { match } = this.props;
    form.formData.customerId = match.params.id;
    const result = await CustomerService.updateCustomer(form.formData);
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'Customer information is updated!',
      snackbarColor: 'success',
    });
    return this.props.setTimeout(this.props.history.push(`/customer/${match.params.id}`, 2000));
  }

  render() {
    const {
      openSnackbar, snackbarMessage, snackbarColor, customer,
    } = this.state;
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
        'phoneNumber',
        'country',
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
        email: {
          type: 'string',
          title: 'Email',
        },
        segment: {
          type: 'string',
          title: 'Customer Segment (Used for discounts etc)',
          enum: ['None', 'Segment 1', 'Segment 2', 'Segment 3', 'Segment 4'],
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
      firstName: customer.firstName,
      lastName: customer.lastName,
      companyName: customer.companyName,
      phoneNumber: customer.phoneNumber,
      mobile: customer.mobile,
      country: customer.country,
      address: customer.address,
      city: customer.city,
      province: customer.province,
      postalCode: customer.postalCode,
      pstNumber: customer.pstNumber,
      creditLimit: customer.creditLimit,
      userName: customer.userName,
      email: customer.email,
      website: customer.website,
      segment: customer.segment,
    };

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={9}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Update Customer</div>
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

export default ReactTimeout(EditCustomer);
