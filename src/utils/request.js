import axios from 'axios';
import Vue from 'vue';
// 环境的切换
if (process.env.NODE_ENV === 'development') { // 开发环境
  axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV === 'debug') { // debug
  axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV === 'production') { // 线上
  axios.defaults.baseURL = '/main';
}
// 请求超时时间
axios.defaults.timeout = 300000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// 请求拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.error(error);
  });
// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.returnCode < 0) {
        Vue.prototype.$message({
          message: response.data.returnMsg,
          type: 'warning'
        });
        return Promise.reject(response);
      } else {
        return Promise.resolve(response);
      }
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 404请求不存在
        case 404:
          Vue.prototype.$message({
            message: '网络请求不存在',
            type: 'warning'
          });
          break;
        default:
          Vue.prototype.$message({
            message: error.response.data.returnMsg,
            type: 'warning'
          });
      }
    } else {
      Vue.prototype.$message({
        message: '网络请求超时！',
        type: 'warning'
      });
    }
    return Promise.reject(error);
  }
);
export default {
  /**
   * get方法，对应get请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   * @param {Boolean} loadingFlag [是否需要显示遮罩层]
   * @param {Object} headers  请求相关参数设置
   */
  get(url, params, loadingFlag, headers) {
    headers = headers || {};
    let loadingInstance = '';
    /* 如果 loadingFlag 为对象将赋值给 requestObj */
    if (typeof loadingFlag == 'object') {
      headers = loadingFlag;
      loadingFlag = false;
    }
    if (loadingFlag) {
      loadingInstance = Vue.prototype.$loading({
        lock: true,
        text: '请求处理中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }
    return new Promise((resolve, reject) => {
      axios.get(url, {
          params: params,
          headers: headers
        })
        .then(res => {
          if (loadingInstance != '') {
            loadingInstance.close();
          }
          resolve(res.data);
        })
        .catch(err => {
          if (loadingInstance != '') {
            loadingInstance.close();
          }
          reject(err.data);
        });
    });
  },
  /**
   * post方法，对应post请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   * @param {Boolean} loadingFlag [是否需要显示遮罩层]
   * @param {Object} headers  请求相关参数设置
   */
  post(url, params, loadingFlag, headers) {
    headers = headers || {};
    let loadingInstance = '';
    /* 如果 loadingFlag 为对象将赋值给 requestObj */
    if (typeof loadingFlag == 'object') {
      headers = loadingFlag;
      loadingFlag = false;
    }
    if (loadingFlag) {
      loadingInstance = Vue.prototype.$loading({
        lock: true,
        text: '请求处理中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }
    return new Promise((resolve, reject) => {
      axios.post(url, params, {
          headers: headers
        })
        .then(res => {
          if (loadingInstance != '') {
            loadingInstance.close();
          }
          resolve(res.data);
        })
        .catch(err => {
          if (loadingInstance != '') {
            loadingInstance.close();
          }
          reject(err.data);
        });
    });
  }
};