import { addReview, getReview, deleteReview, favoriteReview, getFavoriteReview } from '@/api/review'
import { resetRouter } from '@/router'

const actions = {
  // get user info
  addReview({ commit }, data) {
    return new Promise((resolve, reject) => {
      addReview(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getReview({ commit }) {
    return new Promise((resolve, reject) => {
      getReview().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteReview({ commit }, data) {
    return new Promise((resolve, reject) => {
      deleteReview(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  favoriteReview({ commit }, data) {
    return new Promise((resolve, reject) => {
      favoriteReview(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getFavoriteReview({ commit }) {
    return new Promise((resolve, reject) => {
      getFavoriteReview().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  actions
}

