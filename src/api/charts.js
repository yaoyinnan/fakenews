import request from '@/utils/request'

export function newsBarChart() {
  return request({
    url: '/member/charts/newsBarChart',
    method: 'get'
  })
}

export function newsDoughnutChart() {
  return request({
    url: '/member/charts/newsDoughnutChart',
    method: 'get'
  })
}

export function weiboBarChart(data) {
  return request({
    url: '/member/charts/weiboBarChart',
    method: 'get',
    params: data
  })
}

export function weiboDoughnutChart(data) {
  return request({
    url: '/member/charts/weiboDoughnutChart',
    method: 'get',
    params: data
  })
}
