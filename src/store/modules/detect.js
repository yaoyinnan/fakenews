import { detect } from '@/api/detect'
import { resetRouter } from '@/router'

const actions = {
  // get user info
  detect({ commit }, inputs) {
    return new Promise((resolve, reject) => {
      detect({inputs: inputs}).then(response => {
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

