// 引入mockjs
const Mock = require('mockjs');
const { default: request } = require('../utils/request');
// Mock.mock( url, post/get , 返回的数据)；
/** 登录 */
Mock.mock('/api/login', 'post',require('./json/login.json'))
Mock.mock('/api/info', 'get',require('./json/info.json'))
Mock.mock('/api/logout', 'get',require('./json/logout.json'))