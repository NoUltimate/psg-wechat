<template>
	<view style="padding-bottom: 50px;">
		<u-form :model="form" ref="uForm">
			<uni-group title="基本信息" top="20">
				<u-form-item prop="realName" label="姓名" >
					<u-input v-model="form.realName" placeholder="请输入真实姓名"/>
				</u-form-item>
<!-- 				<u-form-item prop="realName" label="姓名" >
					<u-input v-model="form.realName" placeholder="请输入真实姓名"/>
				</u-form-item> -->
				<u-form-item prop="isZjutStudent" label="是否是浙江大学学生" label-position="top">
					<u-checkbox-group @change="isZjutStudentCheckboxGroupChange">
						<u-checkbox 
							@change="isZjutStudentCheckboxChange" 
							v-model="item.checked" 
							v-for="(item, index) in isZjutStudentList" :key="index" 
							:name="item.name"
						>{{item.name}}</u-checkbox>
					</u-checkbox-group>
				</u-form-item>
				<u-form-item prop="studentId" label="学号">
					<u-input v-model="form.studentId" placeholder="请输入学号"/>
				</u-form-item>
	<!-- 			<u-form-item prop="nickName" label="昵称" >
					<u-input v-model="form.nickName" placeholder="请选择昵称"/>
				</u-form-item> -->
				<u-form-item prop="birth" label="出生年月" label-width="150">
					<u-input v-model="form.birth" type="select" :select-open="birthShow" @click="birthShow = true" placeholder="请选择出生年月"/>
					<u-picker @confirm="birthConfirm" mode="time" v-model="birthShow" :params="params" ></u-picker>
				</u-form-item>
				<u-form-item prop="age" label="年龄(周岁)" label-width="150" >
					<u-input  v-model="form.age" placeholder="请填写年龄" ></u-input>
				</u-form-item>
				<u-form-item prop="sex" label="性别" >
					<u-input :border="border" type="select" :select-open="sexShow" v-model="form.sex" placeholder="请选择性别" @click="sexShow = true"></u-input>
					<u-select @confirm="sexConfirm" mode="single-column" v-model="sexShow" :list="sexList" value-name="id" label-name="name" ></u-select>
				</u-form-item>
				<u-form-item prop="academic" label="学院" >
					<u-input :border="border" type="select" :select-open="academicShow" v-model="form.academic" placeholder="请选择学院" @click="this.$refs.popup.open()"></u-input>
				</u-form-item>
				<u-form-item prop="grade" label="年级" label-position="top">
					(例子：本科/硕士/直博/普博/硕博连读+年级/普博延毕)
					<u-input :border="border" v-model="form.grade" placeholder="请输入年级"></u-input>
				</u-form-item>
<!-- 				<u-form-item prop="schoolIdentity" label="在校身份" label-width="150">
					<u-input :border="border" v-model="form.schoolIdentity" placeholder="请填写在校身份"></u-input>
				</u-form-item> -->
				<u-form-item prop="familyStruct" label="家庭结构" label-width="150">
					<u-input :border="border" type="select" :select-open="familyStructShow" v-model="form.familyStruct" placeholder="请选择家庭结构" @click="familyStructShow = true"></u-input>
					<u-select @confirm="familyStructConfirm" mode="single-column" v-model="familyStructShow" :list="familyStructList" value-name="id" label-name="name" ></u-select>
				</u-form-item>
				<u-form-item prop="phone" label="手机号码" label-width="150">
					<u-input v-model="form.phone" placeholder="请输入电话"/>
				</u-form-item>
				<u-form-item prop="email" label="邮箱">
					<u-input v-model="form.email" placeholder="请输入邮箱"/>
				</u-form-item>
				<u-form-item prop="isWillingPay" label="是否愿意付费咨询？ 60元/45分钟" label-position="top">
					(如果是非浙江大学学生，我们将收取费用；如果是浙大学生，愿意付费的等待咨询排序靠前，愿意付费≠预约之后的正式咨询直接需要付费)
					<u-checkbox-group  @change="checkboxGroupChange">
						<u-checkbox 
							@change="checkboxChange" 
							v-model="item.checked" 
							v-for="(item, index) in isWillingPayList" :key="index" 
							:name="item.name"
						>{{item.name}}</u-checkbox>
					</u-checkbox-group>
				</u-form-item>
			</uni-group>
<!-- 			<view v-for="(concat, index) in form.emergencyContact" :key="index">
				<uni-group title="紧急联系人" top="20">
				    <u-form-item :prop="'emergencyContact.name'" label="姓名">
				    	<u-input v-model="concat.name" placeholder="请输入联系人名称"/>
				    </u-form-item>
					<u-form-item prop="emergencyContact.relationship" label="关系">
						<u-input type="select" :select-open="relationshipShow" v-model="concat.relationship" placeholder="请点击填写关系" @click="relationshipShow = true"/>
						<u-select @confirm="relationshipConfirm" mode="single-column" v-model="relationshipShow"  :list="relationshipList" value-name="id" label-name="name" ></u-select>
					</u-form-item>
					<u-form-item prop="emergencyContact.phone" label="手机号码" label-width="120">
						<u-input v-model="concat.phone" placeholder="请输入联系人手机号码"/>
					</u-form-item>
				</uni-group>
			</view> -->
			<uni-group title="紧急联系人" top="20">
			    <u-form-item prop="emergencyContactName" label="姓名">
			    	<u-input v-model="form.emergencyContactName" placeholder="请输入联系人名称"/>
			    </u-form-item>
				<u-form-item prop="emergencyContactRelationship" label="关系">
					<u-input type="select" :select-open="relationshipShow" v-model="form.emergencyContactRelationship" placeholder="请点击填写关系" @click="relationshipShow = true"/>
					<u-select @confirm="relationshipConfirm" mode="single-column" v-model="relationshipShow"  :list="relationshipList" value-name="id" label-name="name" ></u-select>
				</u-form-item>
				<u-form-item prop="emergencyContactPhone" label="手机号码" label-width="150">
					<u-input v-model="form.emergencyContactPhone" placeholder="请输入联系人手机号码"/>
				</u-form-item>
				<u-checkbox-group v-if="promiseShow" @change="checkboxGroupChange">
					<u-checkbox 
						@change="checkboxChange" 
						v-model="item.checked" 
						v-for="(item, index) in promiseList" :key="index" 
						:name="item.name"
					>{{item.name}}</u-checkbox>我已阅读并同意
					<text @click='gotoPromise' style='color:red;'>《来访者知情同意书》</text>
				</u-checkbox-group>
			</uni-group>
			<u-button @click="submit">{{buttonText}}</u-button>
			<!-- <u-select @confirm="academicConfirm" mode="single-column" v-model="academicShow"  :list="academicList" value-name="id" label-name="name" ></u-select> -->
			<u-select @confirm="gradeConfirm" mode="single-column" v-model="gradeShow"   :list="gradeList" value-name="id" label-name="name"></u-select>
<!-- 			<u-modal :closeOnClickOverlay="true" v-model="academicShow" :show-cancel-button="true" confirm-text="确认"
				title="请选择学院" @cancel="cancel" @confirm="confirmAcademic">
				<view style="margin-top: auto;">
					<uni-data-picker v-model="form.academic" :localdata="selectAcademics" popup-title="请选择学院" @change="change" @nodeclick="onnodeclick"></uni-data-picker>
				</view>
				<view v-if="form.academic == '其他'">
					<uni-easyinput type="textarea" autoHeight v-model="customAcademic" placeholder="请输入你的学院"></uni-easyinput>
				</view>
			</u-modal> -->
			<uni-popup ref="popup" type="dialog">
			    <uni-popup-dialog mode="input" title="请选择学院" :before-close="true" @close="closeAcademic" @confirm="confirmAcademic">
					<view style="margin-top: auto; flex-direction: column;width: 500rpx;">
						<view>
							<uni-data-picker style="width: 400px;" v-model="form.academic" :localdata="selectAcademics" popup-title="请选择学院" @change="change" @nodeclick="onnodeclick"></uni-data-picker>
						</view>
						<view v-if="form.academic == '其他'">
							<uni-easyinput type="textarea" autoHeight v-model="customAcademic" placeholder="请输入你的学院"></uni-easyinput>
						</view>						
					</view>
				</uni-popup-dialog>
			</uni-popup>
		</u-form>
	</view>
</template>

<script>
	import userApi from "@/api/user.js"
	import gradeApi from "@/api/grade.js"
	import academicApi from "@/api/academic.js"
	var that
	export default {
		data() {
			return {
				promiseShow: false,
				gradeShow: false,
				academicShow: false,
				sexShow: false,
				birthShow: false,
				familyStructShow: false,
				relationshipShow: false,
				gradeList: undefined,
				academicList: undefined,
				academicMap: new Map(),
				familyStructMap: new Map(),
				relationshipMap: new Map(),
				gradeMap: new Map(),
				customAcademic: "",
				buttonText: "更新",
				selectAcademics: [],
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				promiseList: [
					{
						name: '',
						checked: false,
						disabled: false
					}
				],
				isZjutStudentList: [
					{
						name: '是',
						checked: false,
						disabled: false,
						value: 1
					},
					{
						name: '否',
						checked: false,
						disabled: false,
						value: 0
					}
				],
				isWillingPayList: [
					{
						name: '是',
						checked: false,
						disabled: false,
						value: 1
					},
					{
						name: '否',
						checked: false,
						disabled: false,
						value: 0
					}
				],
				sexList: [
					{
						id: 1,
						name: '男'
					},
					{ 
						id: 2,
						name: '女'
					}
				],
				familyStructList: [
					{
						id: 1,
						name: '完整'
					},
					{ 
						id: 2,
						name: '单亲'
					},
					{
						id: 3,
						name: '重组'
					},
					{
						id: 4,
						name: '孤儿'
					},
					{
						id: 5,
						name: '他人抚养'
					}
				],
				relationshipList: [
					{
						id: 1,
						name: '朋友'
					},
					{ 
						id: 2,
						name: '家人'
					},
					{
						id: 3,
						name: '亲戚'
					},
					{
						id: 4,
						name: '同学'
					},
					{
						id: 5,
						name: '情侣'
					},
					{
						id: 6,
						name: '同事'
					},
					{
						id: 7,
						name: '导师'
					},
					{
						id: 8,
						name: '辅导员'
					},
					{
						id: 9,
						name: '其他'
					}
				],
				rules : {
					realName: [
						{
							required: true,
							message: '请输入真实姓名',
							trigger: ['blur']
						}
					],
					nickName: [
						{
							required: true,
							message: '请输入昵称',
							trigger: ['blur']
						},
						{
							pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/g,
							// 正则检验前先将值转为字符串
							transform(value) {
								return String(value);
							},
							message: '只能包含中文，字母或数字'
						},
					],
					sex: [
						{
							required: true,
							message: '请选择性别',
							trigger: ['blur', 'change']
						}
					],
					age: [
						{
							validator: (rule, value, callback) => {
								return true;
							},
							message: '手机格式不正确',
							trigger: ['blur', 'change']
						}
					],
					birth: [
						{
							required: true,
							message: '请选择出生年月',
							trigger: ['blur', 'change']
						}
					],
					isZjutStudent: [
						{
							validator: (rule, value, callback) => {
								var flag = false
								that.isZjutStudentList.forEach(item => {
									if (item.checked == true) flag = true;
								})
								return flag;
							},
							message: '请选择是/否',
							trigger: ['blur', 'change']
						}
					],
					schoolIdentity: [
						{
							required: true,
							message: '请输入在校身份',
							trigger: ['blur', 'change']
						}
					],
					familyStruct: [
						{
							required: true,
							message: '请选择家庭结构',
							trigger: ['blur', 'change']
						}
					],
					email: [
						{
							required: true,
							message: '请输入邮箱',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => {
								var p = /^[A-Za-z0-9-._]+@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,6})$/
								return p.test(String(that.form.email));
							},
							message: '邮箱格式不正确',
							trigger: ['blur', 'change']
						}
					],
					isWillingPay: [
						{
							validator: (rule, value, callback) => {
								var flag = false
								that.isWillingPayList.forEach(item => {
									if (item.checked == true) flag = true;
								})
								return flag;
							},
							message: '请选择是/否',
							trigger: ['blur', 'change']
						}
					],
					
					phone: [
						{
							required: true,
							message: '请输入电话',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '电话格式不正确',
							trigger: ['blur', 'change']
						}
					],
					studentId: [
						{
							required: true,
							message: '请输入学号',
							trigger: ['blur']
						},
						{
							validator: (rule, value, callback) => {
								if (value.length != 8 && value.length != 10) {
									return false
								} else {
									return true
								}
							},
							message: '学号位数不正确',
							trigger: ['blur']
						}
					],
					academic: [
						{
							required: true,
							message: '请选择学院',
							trigger: ['blur', 'change']
						}
					],
					grade: [
						{
							required: true,
							message: '请选择年级',
							trigger: ['blur', 'change']
						}
					],
					emergencyContactName: [
						{
							required: true,
							message: '请输入联系人姓名',
							trigger: ['blur', 'change']
						}
					],
					emergencyContactRelationship: [
						{
							required: true,
							message: '请选择联系人和您的关系',
							trigger: ['blur', 'change']
						}
					],
					emergencyContactPhone: [
						{
							required: true,
							message: '请输入联系人电话',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机格式不正确',
							trigger: ['blur', 'change']
						}
					]
				},
				form: {
					nickName: '',
					realName: '',
					phone: '',
					studentId: '',
					academic: '',
					sex: '',
					grade: '',
					age: '',
					emergencyContact: undefined
				},
				switchVal: false
			};
		},
		onReady() {
			this.$refs.uForm.setRules(that.rules);
		},
		onLoad() {
			that = this
			this.$showLoading('加载中')
			this.familyStructList.forEach(item => {
				this.familyStructMap[item.name] = item.id
			})
			
			this.relationshipList.forEach(item => {
				this.relationshipMap[item.name] = item.id
			})
			
			// gradeApi.getGradeList().then(resp => {
			// 	var gradeList = resp.data
			// 	var gradeMap = new Map();
			// 	that.gradeList = gradeList
			// 	gradeList.forEach(item => {
			// 		gradeMap[item.name] = item.id
			// 	})
			// 	that.gradeMap = gradeMap
			// })
			academicApi.getAcademicList().then(resp => {
				var academicList = resp.data
				var academicMap = new Map()
				that.academicList = academicList
				academicList.forEach(item => {
					this.selectAcademics.push({
						text: item.name,
						value: item.name,
						children: []
					})
				})
				this.selectAcademics.push({
					text: '其他',
					value: '其他',
					children: []
				})
				
			})
			//TODO rank
			if (getApp().globalData.isRegister) {
				userApi.getUserInfo().then(resp => {
					var user = resp.data
					this.form.realName = user.real_name
					this.form.phone = user.phone
					this.form.nickName = user.nick_name
					this.form.studentId = user.student_id
					this.form.academic = user.academic
					this.form.grade = user.grade
					this.form.age = user.age
					this.form.sex = getApp().globalData.sexIdMap[user.sex]
					this.isZjutStudentList.forEach(item => {
						if (item.value == user.is_zjut_student) item.checked = true
					})
					this.form.birth = user.birth
					this.form.schoolIdentity = user.school_identity,
					this.familyStructList.forEach(item => {
						if (item.id == user.family_struct) this.form.familyStruct = item.name
					})
					this.form.email = user.email
					this.isWillingPayList.forEach(item => {
						if (item.value == user.is_willing_pay) item.checked = true
					})
					if (user.emergency_concat_list.length > 0) {
						this.form.emergencyContactName = user.emergency_concat_list[0].name
						this.form.emergencyContactPhone = user.emergency_concat_list[0].phone
						this.relationshipList.forEach(item => {
							if (item.id == user.emergency_concat_list[0].relationship) this.form.emergencyContactRelationship = item.name
						})
						
					}
				})
			} else {
				this.buttonText = "注册"
				this.promiseShow = true
				var userInfo = getApp().globalData.userInfo
				this.form.nickName = userInfo.nickName
				this.form.sex = getApp().globalData.sexIdMap[userInfo.gender]
			}
			setTimeout(() => {
				this.$hideLoding()
			}, 500)
		},
		methods: {
			gradeConfirm: function(select) {
				console.log(select)
				that.form.grade = select[0].label
			},
			sexConfirm: function(select) {
				that.form.sex = select[0].label
			},
			birthConfirm: function(select) {
				that.form.birth = select.year + "-" + select.month + "-" + select.day
				console.log(new Date().getFullYear(), parseInt(select.year))
				if (new Date().getFullYear() > parseInt(select.year)) {
					that.form.age = new Date().getFullYear() - parseInt(select.year)
				}
			},
			familyStructConfirm: function(select) {
				that.form.familyStruct = select[0].label
			},
			relationshipConfirm: function(select) {
				that.form.emergencyContactRelationship = select[0].label
			},							
			change: function() {
				
			},
			onnodeclick: function() {
				
			},
			checkboxChange: function(e) {
				if (e.value = false) return
				this.isWillingPayList.forEach(item => {
					if (item.name != e.name) item.checked = false;
				})
			},
			checkboxGroupChange: function(e) {
				console.log(e)
			},
			isZjutStudentCheckboxGroupChange: function(e) {
				
			},
			isZjutStudentCheckboxChange: function(e) {
				if (e.value = false) return
				this.isZjutStudentList.forEach(item => {
					if (item.name != e.name) item.checked = false;
				})
				
				this.isZjutStudentList.forEach(item => {
					if (item.name == e[0]) this.form.isZjutStudent = item.id
				})
			},
			gotoPromise: function() {
				uni.navigateTo({
					url: "../promise/promise"
				})
			},
			clickBirth: function() {
				this.birthShow = true
			},
			confirmAcademic: function() {
				if (this.form.academic == '其他') {
					if (this.customAcademic == '') {
						uni.showToast({
							title: "学院不能为空",
							icon: 'none'
						})
						return
					}
					this.form.academic = this.customAcademic
					this.customAcademic = ""
				} else if (this.form.academic == "") {
					uni.showToast({
						title: "学院不能为空",
						icon: 'none'
					})
					return
				}
				this.$refs.popup.close()
			},
			closeAcademic: function() {
				this.$refs.popup.close()
			},
			cancel: function() {
				
			},
			submit: function() {
				that.$refs.uForm.validate(valid => {
					if (valid) {
						var sex = getApp().globalData.sexMap[that.form.sex]
						//var academicId = that.academicMap[that.form.academic]
						//var gradeId = that.gradeMap[that.form.grade]
						var academic = that.form.academic
						var isZjutStudent
						this.isZjutStudentList.forEach(item => {
							if (item.checked == true) isZjutStudent = item.value
						})
						var isWillingPay
						this.isWillingPayList.forEach(item => {
							if (item.checked == true) isWillingPay = item.value
						})
						var familyStruct 
						this.familyStructList.forEach(item => {
							if (item.name == that.form.familyStruct) familyStruct = item.id
						})
						
						var relationship
						this.relationshipList.forEach(item => {
							if (item.name == that.form.emergencyContactRelationship) relationship = item.id
						})
						
						var emergencyConcatList = [{
							id: that.form.emergencyConcatId,
							user_id: getApp().globalData.id,
							name: that.form.emergencyContactName,
							relationship: relationship,
							phone: that.form.emergencyContactPhone
						}]
						
						if (getApp().globalData.isRegister) {
							this.$showLoading("更新中")
							console.log("userApi")
							userApi.updateUserInfo(that.form.realName, that.form.nickName, sex, that.form.phone.toString(), that.form.studentId, that.form.grade, academic, isZjutStudent, that.form.birth, that.form.schoolIdentity, that.familyStructMap[that.form.familyStruct], that.form.email, isWillingPay, that.form.age, emergencyConcatList).then(resp => {
								this.$hideLoding()
								uni.showToast({
									title: '更新成功',
									icon:'none'
								})
								uni.switchTab({
									url:'../mine/mine'
								})
							})
						} else {
							console.log(this.promiseList)
							if (this.promiseList[0].checked == false) {
								uni.showToast({
									title: "请勾选同意书",
									icon: "none"
								})
								return 
							}
							// if (!getApp().globalData.isReadPromise) {
							// 	uni.showToast({
							// 		title: "请点击阅读同意书至少10s",
							// 		icon: "none"
							// 	})
							// 	return 
							// }
							this.$showLoading("注册中")
							userApi.register(that.form.realName, that.form.realName, sex, that.form.phone.toString(), that.form.studentId, that.form.grade, academic, getApp().globalData.userInfo.avatarUrl, isZjutStudent, that.form.birth, that.form.schoolIdentity, that.familyStructMap[that.form.familyStruct], that.form.email, isWillingPay, that.form.age, emergencyConcatList).then(resp => {
								uni.redirectTo({
									url: '../index/index'
								})
								this.$hideLoding()
							})
						}
					} else {
						
					}
					this.customAcademic = ""
				});
			}
		}
	};
</script>

<style>
	.userinfo
	{
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  background-color: #fff;
	  border-top-left-radius: 10rpx;
	  border-top-right-radius: 10rpx;
	  height: 200rpx;
	  margin-top: 20rpx;
	}
	
	.userinfo-avatar 
	{
	  width: 128rpx;
	  height: 128rpx;
	  margin-left: 50rpx;
	  border-radius: 50%;
	}
	
	.userinfo-nickname 
	{
	  color: #000;
	  margin-left: 70rpx;
	}
</style>
