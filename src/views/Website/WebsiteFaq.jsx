import React from 'react';
import MaterialTable from 'material-table';
import Check from '@material-ui/icons/Check';
import Snackbar from '../../components/Snackbar/Snackbar';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import CardBody from '../../components/Card/CardBody';
import WebsiteHeaderImage from './WebsiteHeaderImage';
import WebsiteFaqService from '../../services/WebsiteFaqService';
import PortalSettingsService from '../../services/PortalSettingsService';

export default class WebsiteFaq extends React.Component {
  state = {
    websiteFaqs: [],
    openSnackbar: false,
    snackbarMessage: '',
    snackbarColor: 'info',
    portalSettings: {},
  };

  componentDidMount() {
    this.websiteFaqsList();
    this.getPortalSettings();
  }

  getPortalSettings() {
    PortalSettingsService.getPortalSettings()
      .then((data) => this.setState({ portalSettings: data }));
  }

  websiteFaqsList() {
    WebsiteFaqService.getWebsiteFaqs()
      .then((data) => this.setState({ websiteFaqs: data }));
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

    const {
      websiteFaqs,
      openSnackbar,
      snackbarMessage,
      snackbarColor,
      portalSettings,
    } = this.state;

    const columns = [
      { title: 'Id', field: 'id', editable: 'never' },
      { title: 'Section', field: 'section' },
      { title: 'Question', field: 'question' },
      { title: 'Answer', field: 'answer' },
      { title: 'Sort Order', field: 'sortOrder' },
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

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Website FAQ information. Updated &nbsp;
                  <a
                    // eslint-disable-next-line react/jsx-no-target-blank
                    target="_blank"
                    rel="noreferrer"
                    href={portalSettings.publicWebsiteUrl}
                    style={{ color: 'blue' }}
                  >
                    here
                  </a>
                </div>
              </CardHeader>
              <CardBody>
                <WebsiteHeaderImage url="/faq" />
                <br />
                <MaterialTable
                  columns={columns}
                  data={websiteFaqs}
                  options={options}
                  title=""
                  editable={{
                    onRowAdd: (newData) => new Promise((resolve) => {
                      setTimeout(() => {
                        websiteFaqs.push(newData);
                        WebsiteFaqService.createWebsiteFaq(newData);
                        this.setState({ websiteFaqs }, () => resolve());
                        resolve();
                      }, 1000);
                    }),
                    onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = websiteFaqs.indexOf(oldData);
                          websiteFaqs[index] = newData;
                          WebsiteFaqService.updateWebsiteFaq(newData);
                          this.setState({ websiteFaqs }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    }),
                    onRowDelete: (oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = websiteFaqs.indexOf(oldData);
                          websiteFaqs.splice(index, 1);
                          WebsiteFaqService.deleteWebsiteFaq(oldData);
                          this.setState({ websiteFaqs }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    }),
                  }}
                />
              </CardBody>
            </Card>
          </GridItem>
          <Snackbar
            place="tl"
            color={snackbarColor}
            icon={Check}
            message={snackbarMessage}
            open={openSnackbar}
            closeNotification={() => this.setState({ openSnackbar: false })}
            close
          />
        </GridContainer>
      </div>
    );
  }
}
