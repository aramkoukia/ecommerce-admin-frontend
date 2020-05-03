import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
// import LinearProgress from '@material-ui/core/LinearProgress';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '../../components/CustomButtons/Button';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import ProductService from '../../services/ProductService';

function handleChange() {

}

async function handleTransfer() {
  const {
    product,
    transferQuantity,
    transferNotes,
    fromLocation,
    toLocation,
    vancouverQuantity,
    abbotsfordQuantity,
  } = this.state;

  if (fromLocation === toLocation) {
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'Select different locations to transfer!',
      snackbarColor: 'danger',
    });
    return;
  }

  if (transferNotes === '') {
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'Please enter some Notes to transfer!',
      snackbarColor: 'danger',
    });
    return;
  }

  if ((fromLocation === 1 && vancouverQuantity < transferQuantity)
    || (fromLocation === 2 && abbotsfordQuantity < transferQuantity)) {
    this.setState({
      openSnackbar: true,
      snackbarMessage: 'This location doesn\'t have enough inventory to transfer!',
      snackbarColor: 'danger',
    });
    return;
  }

  if (transferQuantity > 0) {
    const inventoryTransfer = {
      fromLocationId: fromLocation,
      toLocationId: toLocation,
      productId: product.productId,
      notes: transferNotes,
      transferQuantity,
      transferNotes,
    };
    const result = await ProductService.transferInventory(inventoryTransfer);
    if (result && result.orderId) {
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Inventory was successfully transferred!',
        snackbarColor: 'success',
      });
    }
  }

  this.setState({
    openDialog: false,
    transferQuantity: 0,
    transferNotes: '',
    fromLocation: 1,
    toLocation: 2,
  });
  window.location.reload();
}

function InventoryTransfer({ ...props }) {
  const {
    product,
    fromLocation,
    toLocation,
    transferQuantity,
    transferNotes,
    locations,
  } = props;
  const transferLocations = locations.filter((l) => l.locationId !== 0);
  return (
    <>
      <Card>
        <CardHeader color="info">
          Inventory Transfer
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <FormControl>
                <InputLabel htmlFor="fromLocation">From</InputLabel>
                <Select
                  value={fromLocation}
                  onChange={handleChange}
                  inputProps={{
                    name: 'fromLocation',
                    id: 'fromLocation',
                  }}
                >
                  {transferLocations && (
                    transferLocations.map((l, key) => (
                      <MenuItem
                        name={key}
                        value={l.locationId}
                      >
                        {l.locationName}
                      </MenuItem>
                    )))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <FormControl>
                <InputLabel htmlFor="toLocation">To</InputLabel>
                <Select
                  value={toLocation}
                  onChange={handleChange}
                  inputProps={{
                    name: 'toLocation',
                    id: 'toLocation',
                  }}
                >
                  {transferLocations && (
                    transferLocations.map((l, key) => (
                      <MenuItem
                        name={key}
                        value={l.locationId}
                      >
                        {l.locationName}
                      </MenuItem>
                    )))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <FormControl>
                <TextField
                  name="transferQuantity"
                  label="Quantity"
                  type="number"
                  onChange={handleChange}
                  value={transferQuantity}
                />
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <TextField
                required
                name="transferNotes"
                label="Notes"
                type="text"
                onChange={handleChange}
                fullWidth
                value={transferNotes}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={9} />
            <GridItem xs={12} sm={12} md={2}>
              <Button onClick={handleTransfer} color="primary">
                Transfer
              </Button>
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    </>
  );
}

InventoryTransfer.propTypes = {
  product: PropTypes.object.isRequired,
};

export default InventoryTransfer;
