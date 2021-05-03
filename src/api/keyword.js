import request from '@/utils/request'

export function addKeyword(query) {
  return request({
    url: '/member/keyword/addKeyword',
    method: 'post',
    data: query
  })
}

export function getKeyword() {
  return request({
    url: '/member/keyword/getKeyword',
    method: 'get'
  })
}

export function deleteKeyword(query) {
  return request({
    url: '/member/keyword/deleteKeyword',
    method: 'post',
    data: query
  })
}

export function getKeywordNews(query) {
  return request({
    url: '/member/keyword/getKeywordNews',
    method: 'post',
    data: query
  })
}
