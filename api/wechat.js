import { request } from '@/utils/request.js'

export function getOpenid(appId, secret, code, app) {
  var data = {
    app_id : appId,
	secret : secret,
	code : code,
	app : app
  }
  return request({
    url: '/auth/token/get',
    method: 'post',
    data
  })
}
