<template>
	<view>
		<u-form :model="form" ref="uForm">
			<u-form-item prop="realName" label="姓名">
				<u-input placeholder="" disabled="true" v-model="form.realName"/>
			</u-form-item>
			<u-form-item prop="sex" label="性别">
				<u-input placeholder="" disabled="true"  v-model="form.sex" />
				</u-form-item>
			<u-form-item prop="rank" label="等级">
				<u-input placeholder="" disabled="true"  v-model="form.rank" />
			</u-form-item>
			<u-form-item prop="time" label="时间">
				<u-input placeholder="" disabled="true"  v-model="form.time" />
			</u-form-item>
			<u-form-item prop="address" label-width="160rpx" label="预约地址">
				<u-input :border="border" type="select" :select-open="addressShow" v-model="form.address" placeholder="请选择地址" @click="addressShow = true"></u-input>
			</u-form-item>
			<u-form-item v-if="form.address.length > 0" label-width="160rpx" prop="addressDetail" label="地址详情">
				<u-input placeholder="" disabled="true"  v-model="form.addressDetail" />
			</u-form-item>
			<u-form-item prop="content" label-width="160rpx" label="预约详情" label-position="top">
				<u-input placeholder="请从主要生活事件（如失恋）、生理症状（如失眠）、情绪（如经常想哭）等方面简要描述你的情况。" type="textarea" height="200"  v-model="form.content" />
			</u-form-item>
			<u-select @confirm="addressConfirm" mode="single-column" v-model="addressShow" :list="addressList" value-name="id" label-name="name" ></u-select>
			<u-button @click="submit">提交</u-button>
		</u-form>
	</view>
</template>

<script>
	import subscribeApi from '@/api/subscribe.js'
	import dateUtils from '@/utils/date.js'
	var that
	export default {
		data() {
			return {
				form: {
					realName: '',
					sex: '',
					rank: '',
					address: '',
					content: ''
				},
				subscribeData: {},
				addressList: [],
				addressShow: false,
				addressId: undefined,
				addressDetail: "",
				rules: {
					address: [{
						required: true,
						message: '请选择地址',
						trigger: ['blur', 'change']
					}],
					content: [{
						required: true,
						message: '请输入预约详情',
						trigger: ['blur', 'change']
					}]
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(that.rules);
		},
		onLoad(e) {
			that = this
			var subscribeData = JSON.parse(e.subscribeData)
			this.subscribeData = subscribeData
			this.form.realName = subscribeData.psy.real_name
			this.form.sex = getApp().globalData.sexIdMap[subscribeData.psy.sex]
			this.form.rank = subscribeData.psy.rank.name.length > 0 ? subscribeData.psy.rank.name : "无"
			this.addressList = subscribeData.address_list
			this.form.time = dateUtils.formatDate(new Date(parseInt(e.dayZeroTime)), 'yyyy-MM-dd') + " " + e.period
			this.dayZeroTime = e.dayZeroTime
		},
		methods: {
			addressConfirm: function(select) {
				that.form.address = select[0].label
				that.addressId = select[0].value
				var addressList = that.addressList
				for(var index in addressList) {
					console.log(addressList[index].id, select[0].value, addressList[index].detail)
					if (addressList[index].id == select[0].value) {
						that.form.addressDetail = addressList[index].detail
					}
				}
			},
			submit: function() {
				that.$refs.uForm.validate(valid => {
					if (valid) {
						uni.showModal({
							title: '预约单',
							content: '是否确认预约？',
							showCancel: true,//是否显示取消按钮
							cancelText:"否",//默认是“取消”
							confirmText:"是",//默认是“确定”
							success: function (res) {
							    if (res.cancel) {
							        //点击取消,默认隐藏弹框
							    } else {
							        var subscribeData = that.subscribeData
									var address = {}
									for(var index in subscribeData.address_list) {
										if (subscribeData.address_list[index].id == that.addressId) {
											address = subscribeData.address_list[index]
										}
									}
									subscribeApi.addSubscribe(
										subscribeData.psy.id,
										dateUtils.formatDate(new Date(parseInt(that.dayZeroTime)), 'yyyy-MM-dd') + " " + subscribeData.start_time ,
										dateUtils.formatDate(new Date(parseInt(that.dayZeroTime)), 'yyyy-MM-dd') + " " + subscribeData.end_time,
										JSON.stringify(address),
										that.form.content
									 ).then(resp => {
										uni.switchTab({
											url: '../user/user'
										})
									})
							    }
							},
							fail: function (res) { },//接口调用失败的回调函数
							complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
						})
					}
				})
			
			}
		}
	}
</script>

<style>

</style>
