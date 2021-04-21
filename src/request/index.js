import Vue from 'vue'
import axios from "axios";
import VueAxios from 'vue-axios'
/*import qs from 'qs'*/

Vue.use(VueAxios,axios)

axios.defaults.baseURL = "/api";
axios.defaults.responseType = 'json';
axios.defaults.responseEncoding = 'utf8';
axios.defaults.timeout = 1000;

export default {
  $axios: axios.create(),

  responseType: 'json',
  responseEncoding: 'utf8',
  timeout: 1000,
  params: null,
  data: null,
  headers: { 'content-type': 'application/x-www-form-urlencoded' },

  get(url){
    let length = arguments.length;
    if(length === 1){
      return this.$axios.get(url,{
        responseType: this.responseType,
        responseEncoding: this.responseEncoding,
        timeout: this.timeout,
        params: this.params,
        headers: this.headers
      });
    }else if(length === 2){
      let config = arguments[1];
      return this.$axios.get(url,config);
    }
  },
  post(url){
    return this.$axios.post(url,this.data,{
      responseType: this.responseType,
      responseEncoding: this.responseEncoding,
      timeout: this.timeout,
      headers: this.headers
    });
  }
}


