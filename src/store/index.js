import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import detect from './modules/detect'
import news from './modules/news'
import review from './modules/review'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    detect,
    news,
    review
  },
  getters
})

export default store
