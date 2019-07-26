import i18n from './i18n.js'
window.i18nDic=i18n

require('../../../assets/js/helpers/bootstrap')

import vuex from 'vuex'
window.Vue.use(vuex)

import msg from '../../../assets/js/stores/s-msg'
import profile from '../../../assets/js/stores/s-profile'
import dialog from '../../../assets/js/stores/s-dialog'
import param from '../../../assets/js/stores/s-param'
import layout from '../../../assets/js/stores/s-layout'
let store = new vuex.Store({modules: {	msg, dialog, profile,param, layout} })

import app from './index.vue'
window._vue=new window.Vue({el:'#app', store, i18n:window.i18n, render: h=> h(app)})

appThemeInit({numeral:require("numeral")})