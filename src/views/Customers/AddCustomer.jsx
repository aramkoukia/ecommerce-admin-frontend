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

class AddCustomer extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);

    this.state = {
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      country: 'Canada',
      province: 'BC',
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
      disabled: false,
    };
  }

  async componentDidMount() {
    this.setState({
      openSnackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
    });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCheckChange(event) {
    this.setState({ disabled: event.target.checked });
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
      disabled,
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
      country: 'Canada',
      address: '',
      city: '',
      province: 'BC',
      postalCode: '',
      pstNumber: '',
      creditLimit: 0,
      email: '',
      segment: 'None',
      disabled: false,
    });

    customer.customerId = result.customerId;
    customer.customerCode = result.customerCode;

    const { customerSaved } = this.props;
    if (customerSaved) {
      customerSaved(customer);
    }
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
      segment,
      disabled,
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
                      <InputLabel htmlFor="province">Province</InputLabel>
                      <Select
                        value={province}
                        onChange={this.handleChange}
                        input={<Input name="province" id="province" />}
                        fullWidth="true"
                      >
                        <MenuItem value="BC">BC</MenuItem>
                        <MenuItem value="AB">AB</MenuItem>
                        <MenuItem value="MB">MB</MenuItem>
                        <MenuItem value="NB">NB</MenuItem>
                        <MenuItem value="NL">NL</MenuItem>
                        <MenuItem value="NS">NS</MenuItem>
                        <MenuItem value="NU">NU</MenuItem>
                        <MenuItem value="ON">ON</MenuItem>
                        <MenuItem value="PE">PE</MenuItem>
                        <MenuItem value="QC">QC</MenuItem>
                        <MenuItem value="SK">SK</MenuItem>
                        <MenuItem value="YT">YT</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
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
                      label="Postal Code"
                      type="text"
                      onChange={this.handleChange}
                      value={postalCode}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="creditLimit"
                      label="CreditLimit"
                      type="number"
                      onChange={this.handleChange}
                      value={creditLimit}
                      fullWidth="true"
                    />
                  </GridItem>
                  <GridItem md={4}>
                    <TextField
                      name="pstNumber"
                      label="PST Number"
                      type="text"
                      onChange={this.handleChange}
                      value={pstNumber}
                      fullWidth="true"
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
