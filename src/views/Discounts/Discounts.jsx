import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import MUIDataTable from 'mui-datatables';

// core components
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';

const styles = {
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0',
    },
    '& a,& a:hover,& a:focus': {
      color: '#FFFFFF',
    },
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1',
    },
  },
};

function Discounts(props) {
  const { classes } = props;
  const columns = ['From Date', 'To Date', 'Customer With Tags', 'Percent'];

  const data = [
    ['11/12/2018', '11/12/2019', 'Promotion', '5%'],
    ['09/09/2018', '10/08/2022', 'Wholesales', '10%'],
  ];

  const options = {
    filterType: 'checkbox',
    rowsPerPageOptions: [25, 50, 100],
    rowsPerPage: 25,
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <div className={classes.cardTitleWhite}>Discounts</div>
            </CardHeader>
            <CardBody>
              <MUIDataTable
                // title={"Employee List"}
                data={data}
                columns={columns}
                options={options}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default withStyles(styles)(Discounts);
