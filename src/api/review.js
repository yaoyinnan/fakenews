import request from '@/utils/request'

export function addReview(query) {
  return request({
    url: '/member/review/addReview',
    method: 'post',
    data: query
  })
}

export function getReview() {
  return request({
    url: '/member/review/getReview',
    method: 'get'
  })
}

export function deleteReview(query) {
  return request({
    url: '/member/review/deleteReview',
    method: 'post',
    data: query
  })
}
