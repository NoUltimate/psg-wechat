import { request } from '@/utils/request.js'

function getJobScheduleByDay(date) {
  var data = {
	  date : date
  }
  return request({
    url: '/schedule/weekly/day',
    method: 'post',
    data
  })
}

export default {
	getJobScheduleByDay
}