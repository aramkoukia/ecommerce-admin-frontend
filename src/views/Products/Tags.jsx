import React from 'react';
import MaterialTable from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import TagService from '../../services/TagService';
import PortalSettingsService from '../../services/PortalSettingsService';

export default class Tags extends React.Component {
  state = {
    tags: [],
    loading: false,
    portalSettings: {},
  };

  componentDidMount() {
    this.TagsList();
    this.getPortalSettings();
  }

  getPortalSettings() {
    PortalSettingsService.getPortalSettings()
      .then((data) => this.setState({ portalSettings: data }));
  }

  TagsList() {
    this.setState({ loading: true });
    TagService.getTags()
      .then((data) => this.setState({ tags: data, loading: false }));
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
        title: 'Tag Name',
        field: 'tagName',
      },
      {
        title: 'Tag Id',
        field: 'tagId',
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

    const {
      tags,
      loading,
      portalSettings,
    } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div className={styles.cardTitleWhite}>
                  Tags List. Updated &nbsp;
                  <a
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
                <MaterialTable
                  columns={columns}
                  data={tags}
                  options={options}
                  title=""
                  editable={{
                    onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = tags.indexOf(oldData);
                          tags[index] = newData;
                          TagService.updateTag(newData);
                          this.setState({ tags }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    }),
                    onRowAdd: (newData) => new Promise((resolve) => {
                      setTimeout(() => {
                        tags.push(newData);
                        TagService.addTag(newData);
                        this.setState({ tags }, () => resolve());
                        resolve();
                      }, 1000);
                    }),
                    onRowDelete: (oldData) => new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const index = tags.indexOf(oldData);
                          tags.splice(index, 1);
                          TagService.deleteTag(oldData.tagId);
                          this.setState({ tags }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    }),
                  }}
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
