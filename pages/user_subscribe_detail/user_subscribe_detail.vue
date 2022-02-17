<template>
	<view>
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
					<u-input placeholder="" disabled="true"  v-model="form.address" />
				</u-form-item>
				<u-form-item v-if="form.status == 2" prop="cancelReason" label-width="160rpx" label="取消理由">
					<u-input placeholder="" disabled="true"  v-model="form.cancelReason" />
				</u-form-item>
				<u-form-item v-if="form.status == 3" prop="comment" label-width="160rpx" label="评价" >
					<u-input placeholder="" disabled="true"  v-model="form.comment" />
				</u-form-item>
				<u-form-item v-if="form.status == 3" prop="rate" label-width="160rpx" label="分数">
					<u-rate :count="count" v-model="form.rate"></u-rate>
				</u-form-item>
				<u-form-item prop="content" label-width="160rpx" label="预约详情">
					<u-input disabled="true" type="textarea" height="200"  v-model="form.content" />
				</u-form-item>
			</u-form>
		</view>
	</view>
</template>

<script>
	import subscribeApi from '@/api/subscribe.js'
	export default {
		data() {
			return {
				count: 5,
				form: {
					rate: 3,
					realName: '',
					address: '',
					cancelReason: '',
					sex: '',
					rank: '',
					time: '',
					address: '',
					status: 0,
					content: ''
				}
			}
		},
		onLoad(e) {
			// TODO 根据id获取预约详情
			this.form.time = e.subscribeTime
			var subscribeData = JSON.parse(e.subscribeData)
			var id = subscribeData.id
			subscribeApi.getSubscribeById(id).then(resp => {
				var subscribeData = resp.data
				var user
				if (getApp().globalData.role == 1) {
					user = subscribeData.user
				} else if (getApp().globalData.role == 2) {
					user = subscribeData.psy
				}
				this.form.realName = user.real_name
				this.form.sex = getApp().globalData.sexIdMap[user.sex]
				this.form.rank = user.rank.name
				this.form.address = subscribeData.detail.address
				this.form.content = subscribeData.detail.content
				this.form.cancelReason = subscribeData.detail.cancel_reason
				this.form.rate = subscribeData.detail.rate
				this.form.comment = subscribeData.detail.comment
				this.form.status = subscribeData.status
			})
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
