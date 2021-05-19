import {
  detectNews,
  getNews,
  deleteNews,
  recentNews,
  favoriteNews,
  doubtfulNews,
  getFavoriteNews,
  getDoubtfulNews
} from '@/api/news'
import { resetRouter } from '@/router'

const actions = {
  // get user info
  detectNews({ commit }, data) {
    return new Promise((resolve, reject) => {
      detectNews(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getNews({ commit }) {
    return new Promise((resolve, reject) => {
      getNews().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteNews({ commit }, data) {
    return new Promise((resolve, reject) => {
      deleteNews(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  recentNews({ commit }) {
    return new Promise((resolve, reject) => {
      recentNews().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  favoriteNews({ commit }, data) {
    return new Promise((resolve, reject) => {
      favoriteNews(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doubtfulNews({ commit }, data) {
    return new Promise((resolve, reject) => {
      doubtfulNews(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getFavoriteNews({ commit }) {
    return new Promise((resolve, reject) => {
      getFavoriteNews().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDoubtfulNews({ commit }) {
    return new Promise((resolve, reject) => {
      getDoubtfulNews().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  actions
}

