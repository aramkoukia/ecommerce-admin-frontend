import React from 'react';
import MaterialTable from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import LoginHistoryService from '../../services/LoginHistoryService';

export default class LoginHistory extends React.Component {
  state = {
    loginHistories: [],
    loading: false,
  };

  componentDidMount() {
    this.LoginHistories();
  }

  LoginHistories() {
    this.setState({ loading: true });
    LoginHistoryService.getLoginHistories()
      .then((data) => this.setState({ loginHistories: data, loading: false }));
  }

  render() {
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
        fontFamily: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
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

    const columns = [
      {
        title: 'User Name',
        field: 'displayName',
      },
      {
        title: 'Login Time',
        field: 'createdDate',
        render: (row) => <span>{row.createdDate.replace('T', ' ')}</span>,
      },
      {
        title: 'Login type',
        field: 'loginType',
      },
      {
        title: 'Client Address',
        field: 'clientIp',
      },
      {
        title: 'Id',
        field: 'id',
        hidden: true,
        readonly: true,
        editable: 'never',
      },
    ];

    const options = {
      paging: true,
      pageSizeOptions: [25, 50, 100],
      pageSize: 25,
      columnsButton: true,
      exportButton: true,
      filtering: true,
      search: true,
    };

    const { loginHistories, loading } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>Users Login History</div>
              </CardHeader>
              <CardBody>
                <MaterialTable
                  columns={columns}
                  data={loginHistories}
                  options={options}
                  title=""
                />
                {loading && (<LinearProgress />)}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
