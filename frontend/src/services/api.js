import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function client(endpoint, { body, ...customConfig } = {}) {
  try {
    const config = {
      method: body ? 'POST' : 'GET',
      ...customConfig,
    };

    if (body) {
      config.data = JSON.stringify(body);
    }

    const response = await instance.request({ url: endpoint, ...config });
    return response.data;
    // if (response.ok) {
    //   // Return a result object similar to Axios
    //   return {
    //     status: response.status,
    //     data,
    //     headers: response.headers,
    //     url: response.url,
    //   };
    // }
    // throw new Error(response.statusText);
  } catch (err) {
    // return Promise.reject(err.message ? err.message : data);
    return Promise.reject(err.response.data);
  }
}

client.get = function (endpoint, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: 'GET' });
};

client.post = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, body });
};

// export default instance;
