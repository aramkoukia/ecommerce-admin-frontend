import React, { useState } from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  Typography,
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
import GenericProductService from '../../services/GenericProductService';

function GenericProductInventoryTransfer({ ...props }) {
  const {
    product,
    fromWarehouses,
    toWarehouses,
    handleClose,
  } = props;
  const [fromWarehouse, setFromWarehouse] = useState(fromWarehouses[0].warehouseId);
  const [toWarehouse, setToWarehouse] = useState(toWarehouses[1].warehouseId);
  const [fromWarehouseBalance, setFromWarehouseBalance] = useState(fromWarehouses[0].balance);
  const [transferQuantity, setTransferQuantity] = useState(0);
  const [transferNotes, setTransferNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState({
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'danger',
  });

  const handleFromWarehouseChange = (warehouseId) => {
    setFromWarehouse(warehouseId);
    const { balance } = product.warehouseBalances.find((l) => l.warehouseId === warehouseId) || 0;
    setFromWarehouseBalance(balance);
  };

  const handleTransfer = async () => {
    setLoading(true);
    if (fromWarehouse === toWarehouse) {
      setSnackBar({
        openSnackbar: true,
        snackbarMessage: 'Select different warehouses to transfer!',
        snackbarColor: 'danger',
      });
      setLoading(false);
      return;
    }

    if (transferNotes === '') {
      setSnackBar({
        openSnackbar: true,
        snackbarMessage: 'Please enter some Notes to transfer!',
        snackbarColor: 'danger',
      });
      setLoading(false);
      return;
    }

    if (parseInt(fromWarehouseBalance, 10) < parseInt(transferQuantity, 10)) {
      setSnackBar({
        openSnackbar: true,
        snackbarMessage: 'This warehouse doesn\'t have enough inventory to transfer!',
        snackbarColor: 'danger',
      });
      setLoading(false);
      return;
    }

    if (parseInt(transferQuantity, 10) > 0) {
      const inventoryTransfer = {
        fromWarehouseId: fromWarehouse,
        toWarehouseId: toWarehouse,
        productId: product.productId,
        notes: transferNotes,
        transferQuantity,
        transferNotes,
      };
      const result = await GenericProductService.transferInventory(inventoryTransfer);
      if (result) {
        setSnackBar({
          openSnackbar: true,
          snackbarMessage: 'Transfer was done successfully!',
          snackbarColor: 'success',
        });
        handleClose();
      }
      setLoading(false);
    }
  };

  const options = {
    paging: false,
    exportButton: false,
    filtering: false,
    search: false,
  };

  const columns = [
    { title: 'Warehouse Name', field: 'warehouseName', readonly: true },
    { title: 'Balance', field: 'balance' },
  ];

  return (
    <>
      <Card>
        <CardHeader color="info">
          Inventory Transfer
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Typography variant="heading" gutterBottom>
                Generic Product Code:
                {' '}
                {product && product.genericProductCode}
              </Typography>
              <br />
              <Typography variant="heading" gutterBottom>
                Generic Product Name:
                {' '}
                {product && product.productName}
              </Typography>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <MaterialTable
                columns={columns}
                data={product.warehouseBalances}
                options={options}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <FormControl>
                <InputLabel htmlFor="fromWarehouse">From</InputLabel>
                <Select
                  style={{ width: '200px' }}
                  value={fromWarehouse}
                  onChange={(e) => handleFromWarehouseChange(e.target.value)}
                  inputProps={{
                    name: 'fromWarehouse',
                    id: 'fromWarehouse',
                  }}
                >
                  {fromWarehouses && (
                    fromWarehouses.map((l, key) => (
                      <MenuItem
                        name={key}
                        value={l.warehouseId}
                      >
                        {l.warehouseName}
                      </MenuItem>
                    )))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <FormControl>
                <InputLabel htmlFor="toWarehouse">To</InputLabel>
                <Select
                  style={{ width: '200px' }}
                  value={toWarehouse}
                  onChange={(e) => setToWarehouse(e.target.value)}
                  inputProps={{
                    name: 'toWarehouse',
                    id: 'toWarehouse',
                  }}
                >
                  {toWarehouses && (
                    toWarehouses.map((l, key) => (
                      <MenuItem
                        name={key}
                        value={l.warehouseId}
                      >
                        {l.warehouseName}
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
            <br />
            <GridItem xs={12} sm={12} md={12} />
            <GridItem xs={12} sm={12} md={10} />
            <GridItem xs={12} sm={12} md={2} alignContent="flex-end">
              <Button
                onClick={handleTransfer}
                disabled={loading}
                color="primary"
              >
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

GenericProductInventoryTransfer.propTypes = {
  product: PropTypes.object.isRequired,
  fromWarehouses: PropTypes.object.isRequired,
  toWarehouses: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default GenericProductInventoryTransfer;
