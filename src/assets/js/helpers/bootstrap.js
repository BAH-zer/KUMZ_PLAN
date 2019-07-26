import vuetify from 'vuetify'//вьютифи птается влезть во вью при  импорте. если она это сделает, то она будет создана с дефолтными настройками.
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import vue from 'vue'
vue.config.devtools = true
const Vue = vue
window.Vue = vue

import vueRouter from 'vue-router'
window.Vue.use(vueRouter)

import vueAxios from 'vue-axios'
import axios from 'axios'
window.Vue.use(vueAxios, axios)
window._bus={axios, bus: new window.Vue()}

import VueI18n from 'vue-i18n'
import ru from '../i18n/russian.js'
window.Vue.use(VueI18n)
window.i18nDic=window.i18nDic||{ru:{},en:{}}
window.i18n = new VueI18n({  locale:  window.systemLanguage,   messages:{ru: {...ru, ...window.i18nDic.ru} ,} })


window.Vue.use(vuetify, { theme: appTheme,lang: {  t: (key, ...params) => window.i18n.t(key, params) } })
window.io = require('socket.io-client')
/*import echo from "laravel-echo"
window.echo = new echo({
	broadcaster: 'socket.io',
	host: window.location.hostname + ':6001'
})*/
