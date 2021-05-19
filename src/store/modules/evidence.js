import { addEvidence, getEvidence, deleteEvidence, favoriteEvidence, getFavoriteEvidence } from '@/api/evidence'
import { resetRouter } from '@/router'

const actions = {
  // get user info
  addEvidence({ commit }, data) {
    return new Promise((resolve, reject) => {
      addEvidence(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getEvidence({ commit }, data) {
    return new Promise((resolve, reject) => {
      getEvidence(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteEvidence({ commit }, data) {
    return new Promise((resolve, reject) => {
      deleteEvidence(data).then(response => {
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

