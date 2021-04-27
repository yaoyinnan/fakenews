import request from '@/utils/request'

export function register(query) {
  return request({
    url: '/user/index/register',
    method: 'post',
    data: query
  })
}

export function login(headers, query) {
  return request({
    url: '/user/index/login',
    method: 'post',
    headers: headers,
    data: query,
  })
}

export function getInfo(headers, query) {
  return request({
    url: '/user/user/getInfo',
    method: 'get',
    headers: headers,
    params: query,
  })
}

export function logout() {
  return request({
    url: '/user/index/logout',
    method: 'post',
  })
}

