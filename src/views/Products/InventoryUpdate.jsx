import React from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import ProductService from '../../services/ProductService';

function InventoryUpdate({ ...props }) {
  const { product } = props;
  const options = {
    paging: false,
    exportButton: false,
    filtering: false,
    search: false,
  };

  const columns = [
    { title: 'Location Name', field: 'locationName', readonly: true },
    { title: 'Balance', field: 'balance' },
    { title: 'Storage Code', field: 'binCode' },
    { title: 'Notes', field: 'notes' },
    {
      title: 'Location Id', field: 'locationId', hidden: true, readonly: true,
    },
  ];

  return (
    <>
      <Card>
        <CardHeader color="info">
          Inventory Update
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <MaterialTable
                columns={columns}
                data={product.inventory}
                options={options}
                title=""
                editable={{
                  onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                    setTimeout(async () => {
                      {
                        const index = product.inventory.indexOf(oldData);
                        product.inventory[index] = newData;
                        const productInventoryHistory = {
                          locationId: newData.locationId,
                          productId: product.productId,
                          balance: newData.balance,
                          binCode: newData.binCode,
                          notes: newData.notes,
                        };
                        await ProductService.updateInventory(productInventoryHistory);
                      }
                      resolve();
                    }, 1000);
                  }),
                }}
              />
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    </>
  );
}

InventoryUpdate.propTypes = {
  product: PropTypes.object.isRequired,
};

export default InventoryUpdate;
