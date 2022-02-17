<template>
	<view>
		<u-form :model="form" ref="uForm">
			<u-form-item prop="rate" label="分数" label-position="top">
				<u-rate :count="count" v-model="form.rate"></u-rate>
			</u-form-item>
			<u-form-item prop="comment" label="评价" label-position="top">
				<u-input type="textarea" :height="200" placeholder="请输入本次预约的评价"  v-model="form.comment" />
			</u-form-item>
			<u-button @click="submit">提交</u-button>
		</u-form>
	</view>
</template>

<script>
	var that
	import subscribeApi from '@/api/subscribe.js'
	export default {
		data() {
			return {
				count : 5,
				form : {
					rate : 3,
					comment : ''
				},
				rules : {
					comment: [
						{
							required: true,
							message: '评价不能为空',
							trigger: ['blur']
						}
					]
				},
			}
		},
		onReady() {
			this.$refs.uForm.setRules(that.rules);
		},
		onLoad(e) {
			that = this
			this.id = e.subscribeId
		},
		methods: {
			submit: function() {
				that.$refs.uForm.validate(valid => {
					if (valid) {
						subscribeApi.updateSubscribeStatus(this.id, 3, this.form.rate, this.form.comment, null).then(resp => {
							uni.switchTab({
								url: '../user/user'
							})
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>
