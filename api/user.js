import { request } from '@/utils/request.js'
import { getOpenid } from '@/utils/auth.js'

function getUserInfo() {
  var data = {
    id : getApp().globalData.id
  }
  return request({
    url: '/user/get/id',
    method: 'post',
    data
  })
}

function updateUserInfo(realName, nickName, sex, phone ,studentId, gradeId, academicId, isZjutStudent, birth, schoolIdentity, familyStruct, email, isWillingPay, age, emergencyConcatList) {
	var data = {
		sex: sex,
		real_name: realName,
		nick_name: nickName,
		phone: phone,
		student_id: studentId,
		grade_id: gradeId,
		academic_id: academicId,
		is_zjut_student: isZjutStudent,
		birth: birth, 
		school_identity: schoolIdentity, 
		family_struct: familyStruct, 
		email: email, 
		is_willing_pay: isWillingPay,
		age: age,
		emergency_concat_list: emergencyConcatList
	}
	console.log(data)
	return request({
	  url: '/user/update',
	  method: 'post',
	  data
	})
}

function register(realName, nickName, sex, phone ,studentId, gradeId, academicId, avatarUrl, isZjutStudent, birth, schoolIdentity, familyStruct, email, isWillingPay, age, emergencyConcatList) {
  var data = {
    real_name : realName,
	nick_name : nickName,
	sex : sex,
	phone : phone,
	student_id : studentId,
	grade_id : gradeId,
	academic_id : academicId,
	openid : getApp().globalData.openid,
	avatar_url: avatarUrl,
	is_zjut_student: isZjutStudent,
	birth: birth, 
	school_identity: schoolIdentity, 
	family_struct: familyStruct, 
	email: email, 
	is_willing_pay: isWillingPay,
	age: age,
	emergency_concat_list: emergencyConcatList
  }
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export default {
	getUserInfo,
	register,
	updateUserInfo
}
