import Vue from "vue";
import axios from "axios";
import Vuex, { Module } from 'vuex'
Vue.use(Vuex);

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {},
  modules: {
  }
})
export default store

// export default new Vuex.Store({
//   state: {
//     img: null,

//   },
//   mutations: {},
//   actions: {
//     async uploadImage({ }, formData) {
//       return axios.post(
//         "https://animetransfer-cecc2q6t6a-as.a.run.app/file/upload/",
//         // "http://localhost:8000/file/upload/",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//     },
//     async retrieveUploadedFile({ }, filename: string) {
//       axios.get(
//         `https://animetransfer-cecc2q6t6a-as.a.run.app/file/download_finished/?filename=${filename}`
//         // `http://localhost:8000/file/download_finished/?filename=${filename}`
//       );
//     },
//   },
//   modules: {},
// });
