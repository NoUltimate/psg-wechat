import { request } from '@/utils/request.js'

function addSubscribe(periods, questionDetail) {
	var detail = {
		question_detail: questionDetail
	}
	var data = {
		periods: periods,
		user_id : getApp().globalData.id,
		detail : detail
  }
  return request({
    url: '/subscribe/add',
    method: 'post',
    data
  })
}

function getSubscribeByRole(statusList) {
	console.log(statusList)
    var data = {
	    user_id : getApp().globalData.id,
		role : getApp().globalData.role,
		status_list: statusList || []
	}
	return request({
		url: '/subscribe/list/role',
		method: 'post',
		data
	})
}

function getSubscribeById(id) {
	var data = {
		id: id
	}
	return request({
		url: '/subscribe/get/id',
		method: 'post',
		data
	})
}

function updateSubscribeStatus(id, status, rate, comment, cancelReson) {
	var detail = {
		rate : rate,
		comment : comment,
		cancel_reason : cancelReson
	}
	var data = {
		id: id,
		status : status,
		detail : detail
	}
	return request({
		url: '/subscribe/update/status',
		method: 'post',
		data
	})
}

export default {
	addSubscribe,
	getSubscribeByRole,
	getSubscribeById,
	updateSubscribeStatus
}