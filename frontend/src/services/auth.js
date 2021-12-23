// import api from './api';
// import TokenService from './token';

// const login = async (email, password) => {
//   try {
//     const res = await api.post('/auth/login', {
//       email,
//       password,
//     });
//     return res.data;
//   } catch (err) {
//     return Promise.reject(err.response.data && err.response.data.error);
//   }
// };

// const logout = () => {
//   TokenService.removeUser();
// };

// const signup = async (email, name, password, confirmPassword) => {
//   try {
//     const res = await api.post('/auth/signup', {
//       email,
//       name,
//       password,
//       confirmPassword,
//     });
//     return res.data.content;
//   } catch (err) {
//     return Promise.reject(err.response.data && err.response.data.error);
//   }
//   // return api
//   //   .post('/auth/signup', {
//   //     email,
//   //     name,
//   //     password,
//   //     confirmPassword,
//   //   })
//   //   .catch(console.log);
// };
// const verifyEmail = async (code) => {
//   try {
//     const res = await api.post('/auth/verifyEmail', {
//       code,
//     });
//     return res.data.content;
//   } catch (err) {
//     return Promise.reject(err.response.data && err.response.data.error);
//   }
//   // return api
//   //   .post('/auth/signup', {
//   //     email,
//   //     name,
//   //     password,
//   //     confirmPassword,
//   //   })
//   //   .catch(console.log);
// };

// const AuthService = { login, logout, signup, verifyEmail };
// export default AuthService;
