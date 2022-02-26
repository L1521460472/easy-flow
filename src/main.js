// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/components/ef/index.css'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

Vue.config.productionTip = false

Vue.use(ElementUI, {size: 'small'})
Vue.use(VXETable)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: {App},
    template: '<App/>'
})
