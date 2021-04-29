import { addReview, getReview, deleteReview } from '@/api/review'
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
  }
}

export default {
  namespaced: true,
  actions
}

