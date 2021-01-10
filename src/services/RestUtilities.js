import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import AuthStore from '../stores/Auth';
import Api from './ApiConfig';

export default class RestUtilities {
  static get(url) {
    return RestUtilities.request('GET', url);
  }

  static getBlob(url) {
    return RestUtilities.requestBlob(url);
  }

  static delete(url) {
    return RestUtilities.request('DELETE', url);
  }

  static put(url, data) {
    return RestUtilities.request('PUT', url, data);
  }

  static post(url, data) {
    return RestUtilities.request('POST', url, data);
  }

  static postForm(url, data) {
    return RestUtilities.requestFormData('POST', url, data);
  }

  static request(method, url, data) {
    // let isJsonResponse = false;
    let isBadRequest = false;
    let body = data;
    const headers = new Headers();

    headers.set('Authorization', `Bearer ${AuthStore.getToken()}`);
    headers.set('Accept', 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');

    if (data) {
      if (typeof data === 'object') {
        headers.set('Content-Type', 'application/json');
        headers.set('Idempotency-Key', uuidv4());
        body = JSON.stringify(data);
      } else {
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
      }
    }

    return fetch(`${Api.baseUrl}/${url}`, {
      mode: 'cors',
      method,
      headers,
      body,
    })
      .then((response) => {
        if (response.status === 401) {
          // Unauthorized; redirect to sign-in
          AuthStore.removeToken();
          window.location.replace('/?expired=1');
        }

        isBadRequest = response.status === 400;

        const responseContentType = response.headers.get('content-type');
        if (
          responseContentType
          && responseContentType.indexOf('application/json') !== -1
        ) {
          // isJsonResponse = true;
          return response.json();
        }
        return response.text();
      })
      .then((responseContent) => {
        const response = {
          is_error: isBadRequest,
          error_content: isBadRequest ? responseContent : null,
          content: isBadRequest ? null : responseContent,
        };
        return response;
      });
  }

  static requestBlob(url) {
    axios(`${Api.baseUrl}/${url}`, {
      method: 'GET',
      responseType: 'blob', // Force to receive data in a Blob Format
      headers: {
        Authorization: `Bearer ${AuthStore.getToken()}`,
      },
    })
      .then((response) => {
        // Create a Blob from the PDF Stream
        const file = new Blob(
          [response.data],
          { type: 'application/pdf' },
        );
        // Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        // Open the URL on new Window
        window.open(fileURL);
      })
      .catch(() => {
      });
  }

  static requestFormData(method, url, data) {
    // let isJsonResponse = false;
    let isBadRequest = false;
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${AuthStore.getToken()}`);
    headers.set('Content-Type', 'multipart/form-data');
    headers.set('Idempotency-Key', uuidv4());

    return axios(`${Api.baseUrl}/${url}`,
      {
        method: 'post',
        data,
        headers,
      })
      .then((response) => {
        if (response.status === 401) {
          // Unauthorized; redirect to sign-in
          AuthStore.removeToken();
          window.location.replace('/?expired=1');
        }

        isBadRequest = response.status === 400;

        const responseContentType = response.headers.get('content-type');
        if (
          responseContentType
          && responseContentType.indexOf('application/json') !== -1
        ) {
          // isJsonResponse = true;
          return response.json();
        }
        return response.text();
      })
      .then((responseContent) => {
        const response = {
          is_error: isBadRequest,
          error_content: isBadRequest ? responseContent : null,
          content: isBadRequest ? null : responseContent,
        };
        return response;
      });
  }
}
