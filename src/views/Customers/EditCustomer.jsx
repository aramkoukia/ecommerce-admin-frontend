/* eslint-disable react/prop-types */
import React from 'react';
import Check from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import CardHeader from '../../components/Card/CardHeader';
import Button from '../../components/CustomButtons/Button';
import CardBody from '../../components/Card/CardBody';
import Card from '../../components/Card/Card';
import Snackbar from '../../components/Snackbar/Snackbar';
import CustomerService from '../../services/CustomerService';
import CustomerSearch from '../Orders/CustomerSearch';
import SettingsService from '../../services/SettingsService';

class EditCustomer extends React.Component {
  state = {
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    customer: {
      firstName: '',
      country: 'Canada',
      province: 'BC',
      segment: 'None',
      lastName: '',
      companyName: '',
      phoneNumber: '',
      mobile: '',
      address: '',
      city: '',
      postalCode: '',
      pstNumber: '',
      creditLimit: 0,
      email: '',
      notes: '',
      creditCardOnFile: false,
      disabled: false,
      mergeToCustomerId: 0,
      chargePreference: 'None',
    },
    posDefaulTaxCountry: '',
    posDefaulTaxProvince: '',
    provinces: [],
    stateTitle: '',
    taxTitle: '',
    postalCodeTitle: '',
  };

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleCreditCardOnFileChange = this.handleCreditCardOnFileChange.bind(this);
    this.customerChanged = this.customerChanged.bind(this);
  }

  async componentDidMount() {
    const { match } = this.props;
    const customerId = match.params.id;
    const customer = await CustomerService.getCustomer(customerId);
    const {posDefaulTaxCountry, posDefaulTaxProvince} = await SettingsService.getSettings();
    const { provinces, stateTitle, taxTitle, postalCodeTitle } = SettingsService.getCountryInfo(posDefaulTaxCountry, posDefaulTaxProvince);

    this.setState({
      customer,
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: 'info',
      provinces,
      stateTitle,
      taxTitle,
      postalCodeTitle,
    });
  }

  async onSubmit() {
    const { match, history } = this.props;
    const { customer } = this.state;
    await CustomerService.updateCustomer(customer);
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'Customer information is updated!',
      snackbarColor: 'success',
    });
    return history.push(`/customer/${match.params.id}`);
  }

  handleChange = (event) => {
    const { customer } = { ...this.state };
    const currentState = customer;
    const { name, value } = event.target;
    currentState[name] = value;

    if (event.target.name === 'country') {
      const { provinces, stateTitle, taxTitle, province, postalCodeTitle } = SettingsService.getCountryInfo(currentState.country, currentState.province);

      this.setState({
        customer: currentState,
        provinces,
        stateTitle,
        taxTitle,
        postalCodeTitle,
        province
      });
    } else {
      this.setState({ customer: currentState });
    }
  };

  handleCheckChange(event) {
    const { customer } = { ...this.state };
    const currentState = customer;
    currentState.disabled = event.target.checked;
    this.setState({ customer: currentState });
  }

  handleCreditCardOnFileChange(event) {
    const { customer } = { ...this.state };
    const currentState = customer;
    currentState.creditCardOnFile = event.target.checked;
    this.setState({ customer: currentState });
  }

  async customerChanged(mergeToCustomer) {
    const { customer } = { ...this.state };
    const currentState = customer;
    currentState.mergeToCustomerId = mergeToCustomer.customerId;
    this.setState({ customer: currentState });
  }

  render() {
    const {
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      customer,
      provinces,
      stateTitle,
      taxTitle,
      postalCodeTitle,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem md={12}>
            <Card>
              <CardHeader color="primary">
                Update Customer
              </CardHeader>
              <CardBody>
                <GridContainer md={12}>
                  <GridItem md={4}>
                    <TextField
                      name="firstName"
                      label="First Name"
                      type="text"
                      onChange={this.handleChange}
                      value={customer.firstName}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="lastName"
                      label="Last Name"
                      type="text"
                      onChange={this.handleChange}
                      value={customer.lastName}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="companyName"
                      label="Company Name"
                      type="text"
                      onChange={this.handleChange}
                      value={customer.companyName}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="email"
                      label="Email"
                      type="text"
                      onChange={this.handleChange}
                      value={customer.email}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="phoneNumber"
                      label="Phone Number"
                      type="text"
                      onChange={this.handleChange}
                      value={customer.phoneNumber}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="mobile"
                      label="Mobile"
                      type="text"
                      onChange={this.handleChange}
                      value={customer.mobile}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <FormControl>
                      <InputLabel htmlFor="country">Country</InputLabel>
                      <Select
                        value={customer.country}
                        onChange={this.handleChange}
                        input={<Input name="country" id="country" />}
                        fullWidth="true"
                      >
                        <MenuItem value="Canada">Canada</MenuItem>
                        <MenuItem value="United States">United States</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem md={4}>
                    <FormControl>
                      <InputLabel htmlFor="province">{stateTitle}</InputLabel>
                      <Select
                        value={customer.province}
                        onChange={this.handleChange}
                        input={<Input name="province" id="province" />}
                        fullWidth="true"
                      >
                        {provinces.map((p) => (
                          <MenuItem value={p}>{p}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="city"
                      label="City"
                      type="text"
                      onChange={this.handleChange}
                      value={customer.city}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="address"
                      label="Address"
                      type="text"
                      onChange={this.handleChange}
                      value={customer.address}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="postalCode"
                      label={postalCodeTitle}
                      type="text"
                      onChange={this.handleChange}
                      value={customer.postalCode}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4} />
                  <GridItem md={4}>
                    <TextField
                      name="creditLimit"
                      label="Credit Limit"
                      type="number"
                      onChange={this.handleChange}
                      value={customer.creditLimit}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="pstNumber"
                      label={taxTitle}
                      type="text"
                      onChange={this.handleChange}
                      value={customer.pstNumber}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <FormControl
                      fullWidth="true"
                    >
                      <InputLabel htmlFor="chargePreference">Charge Preference</InputLabel>
                      <Select
                        value={customer.chargePreference}
                        onChange={this.handleChange}
                        input={<Input name="chargePreference" id="chargePreference" />}
                        fullWidth="true"
                      >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="In 40 Days">In 40 Days</MenuItem>
                        <MenuItem value="Same Day">Same Day</MenuItem>
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="notes"
                      label="Notes (Shows at time of order)"
                      type="text"
                      onChange={this.handleChange}
                      value={customer.notes}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={customer.creditCardOnFile}
                          onChange={this.handleCreditCardOnFileChange}
                          value="creditCardOnFile"
                        />
                      )}
                      label="Credit Card On File"
                    />
                  </GridItem>
                  <GridItem md={12}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={customer.disabled}
                          onChange={this.handleCheckChange}
                          value="disabled"
                        />
                      )}
                      label="Disabled"
                    />
                  </GridItem>
                  {customer && customer.disabled && (
                    <GridItem md={12}>
                      Move Orders to this Customer
                      <CustomerSearch customerChanged={this.customerChanged} />
                    </GridItem>
                  )}
                  {/* <GridItem md={4}>
                    <FormControl>
                      <InputLabel htmlFor="segment">Segment</InputLabel>
                      <Select
                        value={customer.segment}
                        onChange={this.handleChange}
                        input={<Input name="segment" id="segment" />}
                        fullWidth="true"
                      >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="Segment 1">Segment 1</MenuItem>
                        <MenuItem value="Segment 2">Segment 2</MenuItem>
                        <MenuItem value="Segment 3">Segment 3</MenuItem>
                        <MenuItem value="Segment 4">Segment 4</MenuItem>
                      </Select>
                    </FormControl>
                  </GridItem> */}
                  <GridItem md={12}>
                    <Button color="primary" onClick={this.onSubmit}>
                      Save
                    </Button>
                  </GridItem>
                </GridContainer>
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

export default EditCustomer;
