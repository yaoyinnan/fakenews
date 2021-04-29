import request from '@/utils/model-request'

export function detect(query) {
  return request({
    url: 'yaoyinnan/bert-base-chinese-covid19',
    method: 'post',
    data: query
  })
}
