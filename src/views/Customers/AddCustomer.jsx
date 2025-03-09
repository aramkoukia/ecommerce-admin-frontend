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
import SettingsService from '../../services/SettingsService';

class AddCustomer extends React.Component {
  state = {
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    segment: 'None',
    firstName: '',
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
    creditCardOnFile: false,
    disabled: false,
    chargePreference: 'None',
    posDefaulTaxCountry: '',
    posDefaulTaxProvince: '',
    provinces: [],
    stateTitle: '',
    taxTitle:'',
    postalCodeTitle: '',
  };

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleCreditCardOnFileChange = this.handleCreditCardOnFileChange.bind(this);
  }

  async componentDidMount() {
    const setting = await SettingsService.getSettings();
    const { posDefaulTaxCountry, posDefaulTaxProvince } = setting;
    const { provinces, stateTitle, taxTitle, postalCodeTitle } = SettingsService.getCountryInfo(posDefaulTaxCountry, posDefaulTaxProvince);

    this.setState({
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: 'info',
      country: posDefaulTaxCountry,
      province: posDefaulTaxProvince,
      posDefaulTaxCountry,
      posDefaulTaxProvince,
      provinces,
      stateTitle,
      taxTitle,
      postalCodeTitle,
    });
  }

  async onSubmit() {
    const {
      firstName,
      lastName,
      companyName,
      phoneNumber,
      mobile,
      country,
      address,
      city,
      province,
      postalCode,
      pstNumber,
      creditLimit,
      email,
      segment,
      creditCardOnFile,
      chargePreference,
      disabled,
      posDefaulTaxCountry,
      posDefaulTaxProvince,
    } = this.state;

    const customer = {
      firstName,
      lastName,
      companyName,
      phoneNumber,
      mobile,
      country,
      address,
      city,
      province,
      postalCode,
      pstNumber,
      creditLimit,
      email,
      segment,
      accountBalance: 0,
      storeCredit: 0,
      creditCardOnFile,
      chargePreference,
      disabled,
    };

    const result = await CustomerService.addCustomer(customer);
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'New customer is saved!',
      snackbarColor: 'success',
      firstName: '',
      lastName: '',
      companyName: '',
      phoneNumber: '',
      mobile: '',
      country: posDefaulTaxCountry,
      address: '',
      city: '',
      province: posDefaulTaxProvince,
      postalCode: '',
      pstNumber: '',
      notes: '',
      creditLimit: 0,
      email: '',
      segment: 'None',
      creditCardOnFile: false,
      disabled: false,
      chargePreference: 'None',
    });

    customer.customerId = result.customerId;
    customer.customerCode = result.customerCode;

    const { customerSaved } = this.props;
    if (customerSaved) {
      customerSaved(customer);
    }
  }

  handleChange = (event) => {
    if (event.target.name === 'country') {
      const { posDefaulTaxProvince } = this.state;
      const { provinces, stateTitle, taxTitle, postalCodeTitle, province } = SettingsService.getCountryInfo(event.target.value, posDefaulTaxProvince);

      this.setState({
        [event.target.name]: event.target.value,
        provinces,
        stateTitle,
        taxTitle,
        postalCodeTitle,
        province
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  };

  handleCheckChange(event) {
    this.setState({ disabled: event.target.checked });
  }

  handleCreditCardOnFileChange(event) {
    this.setState({ creditCardOnFile: event.target.checked });
  }

  render() {
    const {
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      firstName,
      lastName,
      companyName,
      phoneNumber,
      mobile,
      country,
      address,
      city,
      province,
      postalCode,
      pstNumber,
      creditLimit,
      email,
      creditCardOnFile,
      notes,
      disabled,
      chargePreference,
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
                New Customer
              </CardHeader>
              <CardBody>
                <GridContainer md={12}>
                  <GridItem md={4}>
                    <TextField
                      name="firstName"
                      label="First Name"
                      type="text"
                      onChange={this.handleChange}
                      value={firstName}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="lastName"
                      label="Last Name"
                      type="text"
                      onChange={this.handleChange}
                      value={lastName}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="companyName"
                      label="Company Name"
                      type="text"
                      onChange={this.handleChange}
                      value={companyName}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="email"
                      label="Email"
                      type="text"
                      onChange={this.handleChange}
                      value={email}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="phoneNumber"
                      label="Phone Number"
                      type="text"
                      onChange={this.handleChange}
                      value={phoneNumber}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="mobile"
                      label="Mobile"
                      type="text"
                      onChange={this.handleChange}
                      value={mobile}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <FormControl>
                      <InputLabel htmlFor="country">Country</InputLabel>
                      <Select
                        value={country}
                        defaultValue={province}
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
                        value={province}
                        defaultValue={province}
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
                      value={city}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="address"
                      label="Address"
                      type="text"
                      onChange={this.handleChange}
                      value={address}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="postalCode"
                      label={postalCodeTitle}
                      type="text"
                      onChange={this.handleChange}
                      value={postalCode}
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
                      value={creditLimit}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="pstNumber"
                      label={taxTitle}
                      type="text"
                      onChange={this.handleChange}
                      value={pstNumber}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <FormControl
                      fullWidth="true"
                    >
                      <InputLabel htmlFor="chargePreference">Charge Preference</InputLabel>
                      <Select
                        value={chargePreference}
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
                      value={notes}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={creditCardOnFile}
                          onChange={this.handleCreditCardOnFileChange}
                          value="creditCardOnFile"
                        />
                      )}
                      label="Credit Card On File"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={disabled}
                          onChange={this.handleCheckChange}
                          value="disabled"
                        />
                      )}
                      label="Disabled"
                    />
                  </GridItem>
                  {/* <GridItem md={4}>
                    <FormControl>
                      <InputLabel htmlFor="segment">Segment</InputLabel>
                      <Select
                        value={segment}
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

export default AddCustomer;
