import axios from 'axios';
import AuthStore from '../stores/Auth';
import Api from './ApiConfig';

export default class RestUtilities {
  static get(url) {
    return RestUtilities.request('GET', url);
  }

  static getBlob(url) {
    return RestUtilities.requestBlob('GET', url);
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

  static request(method, url, data) {
    // let isJsonResponse = false;
    let isBadRequest = false;
    let body = data;
    const headers = new Headers();

    headers.set('Authorization', `Bearer ${AuthStore.getToken()}`);
    headers.set('Accept', 'application/json');

    if (data) {
      if (typeof data === 'object') {
        headers.set('Content-Type', 'application/json');
        body = JSON.stringify(data);
      } else {
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
      }
    }

    return fetch(`${Api.baseUrl}/${url}`, {
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

  static requestBlob(method, url) {
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${AuthStore.getToken()}`);
    axios(`${Api.baseUrl}/${url}`, {
      method: 'GET',
      responseType: 'blob', // Force to receive data in a Blob Format
      headers,
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
    // let headers = new Headers();
    // headers.set("Authorization", `Bearer ${AuthStore.getToken()}`);
    // headers.set("Accept", "application/pdf");

    // return fetch(`${Api.baseUrl}/${url}`, {
    //   method: method,
    //   headers: headers,
    // })
    //   .then(response => {
    //     if (response.status === 401) {
    //       // Unauthorized; redirect to sign-in
    //       AuthStore.removeToken();
    //       window.location.replace(`/?expired=1`);
    //     }
    //     let responseContentType = response.headers.get("content-type");
    //     if (responseContentType && responseContentType.indexOf("application/pdf") === 0) {
    //       return response.text();
    //     }
    //   })
    //   .then(responseContent => {
    //     const file = new Blob(
    //       [responseContent],
    //       {type: 'application/pdf'});
    //     const fileURL = URL.createObjectURL(file);
    //     window.open(fileURL);
    //   });
  }
}
