import request from '@/utils/request'

export function addEvidence(query) {
  return request({
    url: '/member/evidence/addEvidence',
    method: 'post',
    data: query
  })
}

export function getEvidence(query) {
  return request({
    url: '/member/evidence/getEvidence',
    method: 'get',
    params: query
  })
}

export function deleteEvidence(query) {
  return request({
    url: '/member/evidence/deleteEvidence',
    method: 'post',
    data: query
  })
}
