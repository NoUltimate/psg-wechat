import { request } from '@/utils/request.js'

function getAcademicList() {
  var data = {
  }
  return request({
    url: '/academic/get/list',
    method: 'post',
    data
  })
}

export default {
	getAcademicList
}