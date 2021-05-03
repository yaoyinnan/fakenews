import { addKeyword, getKeyword, deleteKeyword, getKeywordNews } from '@/api/keyword'
import { resetRouter } from '@/router'

const actions = {
  // get user info
  addKeyword({ commit }, data) {
    return new Promise((resolve, reject) => {
      addKeyword(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getKeyword({ commit }) {
    return new Promise((resolve, reject) => {
      getKeyword().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteKeyword({ commit }, data) {
    return new Promise((resolve, reject) => {
      deleteKeyword(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getKeywordNews({ commit }, data) {
    return new Promise((resolve, reject) => {
      getKeywordNews(data).then(response => {
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

