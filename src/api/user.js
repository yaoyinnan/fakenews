import request from '@/utils/request'

export function register(query) {
  return request({
    url: '/user/index/register',
    method: 'post',
    data: query
  })
}

export function login(query) {
  return request({
    url: '/user/index/login',
    method: 'post',
    data: query,
  })
}

export function getInfo() {
  return request({
    url: '/user/user/getInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/user/logout',
    method: 'post',
  })
}

