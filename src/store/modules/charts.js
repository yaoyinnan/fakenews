import {
  newsBarChart,
  newsDoughnutChart,
  weiboBarChart,
  weiboDoughnutChart
} from '@/api/charts'
import { resetRouter } from '@/router'

const actions = {
  newsBarChart({ commit }) {
    return new Promise((resolve, reject) => {
      newsBarChart().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  newsDoughnutChart({ commit }) {
    return new Promise((resolve, reject) => {
      newsDoughnutChart().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  weiboBarChart({ commit }, data) {
    return new Promise((resolve, reject) => {
      weiboBarChart(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  weiboDoughnutChart({ commit }, data) {
    return new Promise((resolve, reject) => {
      weiboDoughnutChart(data).then(response => {
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

