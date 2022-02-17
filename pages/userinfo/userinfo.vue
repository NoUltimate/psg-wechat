<template>
	<view>
		<u-form :model="form" ref="uForm">
			<u-form-item prop="realName" label="姓名" >
				<u-input v-model="form.realName" placeholder="请输入真实姓名"/>
				</u-form-item>
<!-- 			<u-form-item prop="nickName" label="昵称" >
				<u-input v-model="form.nickName" placeholder="请选择昵称"/>
			</u-form-item> -->
			<u-form-item prop="sex" label="性别" >
				<u-input :border="border" type="select" :select-open="sexShow" v-model="form.sex" placeholder="请选择性别" @click="sexShow = true"></u-input>
			</u-form-item>
			<u-form-item prop="phone" label="电话">
				<u-input v-model="form.phone" placeholder="请输入电话"/>
			</u-form-item>
			<u-form-item prop="studentId" label="学号">
				<u-input v-model="form.studentId" placeholder="请输入学号"/>
			</u-form-item>
			<u-form-item prop="grade" label="年级" >
				<u-input :border="border" type="select" :select-open="gradeShow" v-model="form.grade" placeholder="请选择年级" @click="gradeShow = true"></u-input>
			</u-form-item>
			<u-form-item prop="academic" label="学院" >
				<u-input :border="border" type="select" :select-open="academicShow" v-model="form.academic" placeholder="请选择学院" @click="academicShow = true"></u-input>
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
			<u-button @click="submit">{{buttonText}}</u-button>
			<u-select @confirm="sexConfirm" mode="single-column" v-model="sexShow" :list="sexList" value-name="id" label-name="name" ></u-select>
			<u-select @confirm="academicConfirm" mode="single-column" v-model="academicShow"  :list="academicList" value-name="id" label-name="name" ></u-select>
			<u-select @confirm="gradeConfirm" mode="single-column" v-model="gradeShow"   :list="gradeList" value-name="id" label-name="name"></u-select>
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
				gradeList: undefined,
				academicList: undefined,
				academicMap: undefined,
				gradeMap: undefined,
				buttonText: "更新",
				promiseList: [
					{
						name: '',
						checked: false,
						disabled: false
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
					phone: [
						{
							required: true,
							message: '请输入电话',
							trigger: ['blur']
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机格式不正确',
							trigger: ['blur']
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
					]
				},
				form: {
					nickName: '',
					realName: '',
					phone: '',
					studentId: '',
					academic: '',
					sex: '',
					grade: ''
				},
				switchVal: false
			};
		},
		onReady() {
			this.$refs.uForm.setRules(that.rules);
		},
		onLoad() {
			that = this
			gradeApi.getGradeList().then(resp => {
				var gradeList = resp.data
				var gradeMap = new Map();
				that.gradeList = gradeList
				gradeList.forEach(item => {
					gradeMap[item.name] = item.id
				})
				that.gradeMap = gradeMap
			})
			academicApi.getAcademicList().then(resp => {
				var academicList = resp.data
				var academicMap = new Map();
				that.academicList = academicList
				academicList.forEach(item => {
					academicMap[item.name] = item.id
				})
				that.academicMap = academicMap
			})
			//TODO rank
			console.log(getApp().globalData.isRegister)
			if (getApp().globalData.isRegister) {
				console.log(getApp().globalData.id)
				userApi.getUserInfo().then(resp => {
					var user = resp.data
					this.form.realName = user.real_name
					this.form.phone = user.phone
					this.form.nickName = user.nick_name
					this.form.studentId = user.student_id
					this.form.academic = user.academic.name
					this.form.grade = user.grade.name
					this.form.sex = getApp().globalData.sexIdMap[user.sex]
					console.log(resp, this.form)
				})
			} else {
				this.buttonText = "注册"
				this.promiseShow = true
				var userInfo = getApp().globalData.userInfo
				this.form.nickName = userInfo.nickName
				this.form.sex = getApp().globalData.sexIdMap[userInfo.gender]
			}
		},
		methods: {
			gradeConfirm: function(select) {
				console.log(select)
				that.form.grade = select[0].label
			}, 
			academicConfirm: function(select) {
				that.form.academic = select[0].label
			},
			sexConfirm: function(select) {
				that.form.sex = select[0].label
			},
			checkboxChange: function() {
				
			},
			checkboxGroupChange: function() {
				
			},
			gotoPromise: function() {
				uni.navigateTo({
					url: "../promise/promise"
				})
			},
			submit: function() {
				that.$refs.uForm.validate(valid => {
					if (valid) {
						var sex = getApp().globalData.sexMap[that.form.sex]
						var academicId = that.academicMap[that.form.academic]
						var gradeId = that.gradeMap[that.form.grade]
						if (getApp().globalData.isRegister) {
							this.$showLoading("更新中")
							console.log("userApi")
							userApi.updateUserInfo(that.form.realName, that.form.nickName, sex, that.form.phone.toString(), that.form.studentId, gradeId, academicId).then(resp => {
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
							userApi.register(that.form.realName, that.form.realName, sex, that.form.phone.toString(), that.form.studentId, gradeId, academicId, getApp().globalData.userInfo.avatarUrl).then(resp => {
								uni.redirectTo({
									url: '../index/index'
								})
								this.$hideLoding()
							})
						}
					} else {
						
					}
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
