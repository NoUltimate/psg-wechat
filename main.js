import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})

import uView from 'uview-ui';
Vue.use(uView);

import { request } from './utils/request.js'
import moment from 'moment'//导入文件 

Vue.prototype.$request = request
Vue.prototype.$moment = moment;//赋值使用

import {
    showLoading,
    hideLoading
} from './utils/loading'

Vue.prototype.$showLoading = showLoading
Vue.prototype.$hideLoding = hideLoading;//赋值使用

app.$mount()
