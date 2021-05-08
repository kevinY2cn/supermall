import Vue from 'vue'
import axios from "axios";
import VueAxios from 'vue-axios'
import qs from 'qs'

Vue.use(VueAxios,axios)

axios.defaults.baseURL = "/api";
axios.defaults.responseType = 'json';
axios.defaults.responseEncoding = 'utf8';
axios.defaults.timeout = 1000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/json';


export default {
  $axios: axios.create(),

  responseType: 'json',
  responseEncoding: 'utf8',
  timeout: 5000,
  params: null,
  data: null,
  json_header: {'content-type': 'application/json'},

  get(url){
    let length = arguments.length;
    if(length === 1){
      return this.$axios.get(url,{
        responseType: this.responseType,
        responseEncoding: this.responseEncoding,
        timeout: this.timeout,
        params: this.params,
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
      transformRequest: [function (data, headers) {
        // 对 data 进行任意转换处理
        if(headers['content-type'] === 'application/json'){
          console.warn('请使用postByJson');
        }
        return qs.stringify(data);
      }]
    });
  },

  postByJson(url){
    return this.$axios.post(url,this.data,{
      responseType: this.responseType,
      responseEncoding: this.responseEncoding,
      timeout: this.timeout,
      headers: this.json_header
    });
  },

  all(...promise){
    return axios.all(...promise);
  }

}


