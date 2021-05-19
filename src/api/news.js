import request from '@/utils/request'

export function detectNews(query) {
  return request({
    url: '/member/news/detectNews',
    method: 'post',
    data: query
  })
}

export function getNews() {
  return request({
    url: '/member/news/getNews',
    method: 'get'
  })
}

export function deleteNews(query) {
  return request({
    url: '/member/news/deleteNews',
    method: 'post',
    data: query
  })
}

export function recentNews() {
  return request({
    url: '/member/news/recentNews',
    method: 'get'
  })
}

export function favoriteNews(query) {
  return request({
    url: '/member/news/favoriteNews',
    method: 'post',
    data: query
  })
}

export function doubtfulNews(query) {
  return request({
    url: '/member/news/doubtfulNews',
    method: 'post',
    data: query
  })
}


export function getFavoriteNews() {
  return request({
    url: '/member/news/getFavoriteNews',
    method: 'get'
  })
}


export function getDoubtfulNews() {
  return request({
    url: '/member/news/getDoubtfulNews',
    method: 'get'
  })
}
