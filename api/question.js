import { request } from '@/utils/request.js'

function getQuestionList() {
  var data = {

  }
  return request({
    url: '/question/get',
    method: 'post',
    data
  })
}


export default {
	getQuestionList
}