import { request } from '@/utils/request.js'

export function getOpenid(code, app) {
  var data = {
	code : code,
	app : app
  }
  return request({
    url: '/auth/token/get',
    method: 'post',
    data
  })
}
