// import { store } from '../app/store';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
// console.log(store.getState());

export const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function client(endpoint, { body, ...customConfig } = {}) {
  try {
    const config = {
      ...customConfig,
    };
    if (body) {
      config.data = JSON.stringify(body);
    }
    const response = await instance.request({ url: endpoint, ...config });
    return response.data;
  } catch (err) {
    return Promise.reject(err.response.data);
  }
}

client.get = function (endpoint, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: 'GET' });
};

client.post = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: 'POST', body });
};
client.put = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: 'PUT', body });
};
client.delete = function (endpoint, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: 'DELETE' });
};

// export default instance;
