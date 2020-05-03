import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Button from '../../components/CustomButtons/Button';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridItem from '../../components/Grid/GridItem';
import Snackbar from '../../components/Snackbar/Snackbar';
import GridContainer from '../../components/Grid/GridContainer';
import ProductService from '../../services/ProductService';

function InventoryTransfer({ ...props }) {
  const {
    product,
    locations,
  } = props;
  const transferLocations = locations.filter((l) => l.locationId !== 0);
  const [fromLocation, setFromLocation] = useState(transferLocations[0].locationId);
  const [toLocation, setToLocation] = useState(transferLocations[1].locationId);
  const [fromLocationBalance, setFromLocationBalance] = useState(transferLocations[0].balance);
  const [transferQuantity, setTransferQuantity] = useState(0);
  const [transferNotes, setTransferNotes] = useState('');
  const [snackBar, setSnackBar] = useState({
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'danger',
  });

  const handleFromLocationChange = (locationId) => {
    setFromLocation(locationId);
    const balance = product.inventory.filter((l) => l.locationId === locationId) || 0;
    setFromLocationBalance(balance);
  };

  const handleTransfer = async () => {
    if (fromLocation === toLocation) {
      setSnackBar({
        openSnackbar: true,
        snackbarMessage: 'Select different locations to transfer!',
        snackbarColor: 'danger',
      });
      return;
    }

    if (transferNotes === '') {
      setSnackBar({
        openSnackbar: true,
        snackbarMessage: 'Please enter some Notes to transfer!',
        snackbarColor: 'danger',
      });
      return;
    }

    if (fromLocationBalance < transferQuantity) {
      setSnackBar({
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
      if (result) {
        setSnackBar({
          openSnackbar: true,
          snackbarMessage: 'Transfer was done successfully!',
          snackbarColor: 'success',
        });
      }
    }
  };

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
                  style={{ width: '200px' }}
                  value={fromLocation}
                  onChange={(e) => handleFromLocationChange(e.target.value)}
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
                  style={{ width: '200px' }}
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
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
                  onChange={(e) => setTransferQuantity(e.target.value)}
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
                onChange={(e) => setTransferNotes(e.target.value)}
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
      <Snackbar
        place="tl"
        color={snackBar.snackbarColor}
        icon={Check}
        message={snackBar.snackbarMessage}
        open={snackBar.openSnackbar}
        closeNotification={() => setSnackBar({ openSnackbar: false })}
        close
      />
    </>
  );
}

InventoryTransfer.propTypes = {
  product: PropTypes.object.isRequired,
  locations: PropTypes.object.isRequired,
};

export default InventoryTransfer;
