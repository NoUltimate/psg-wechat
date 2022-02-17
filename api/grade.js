import { request } from '@/utils/request.js'

function getGradeList() {
  var data = {
  }
  return request({
    url: '/grade/get/list',
    method: 'post',
    data
  })
}

export default {
	getGradeList
}