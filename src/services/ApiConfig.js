export default class Api {
  static apiRoot = process.env.REACT_APP_API_ROOT || 'http://localhost:38812/api';

  static baseUrl = process.env.REACT_APP_BASE_API_URL || 'http://localhost:38812';
}
