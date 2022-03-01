<template>
	<view>
		<view class="userinfo">
		  <image class="userinfo-avatar" :src="avatarUrl"></image>
		  <text class="userinfo-nickname">{{ nickName }}</text>
		</view> 
		<view>
			<u-cell-group>
					<u-cell-item @click="gotoUserinfo" icon="setting-fill" :label="userinfoTitle"></u-cell-item>
			</u-cell-group>
<!-- 			<u-cell-group>
					<u-cell-item @click="gotoSubscribeHistory" icon="order" :label="subscribeHistoryTitle"></u-cell-item>
			</u-cell-group> -->
		</view>
	</view>
</template>

<script>
	import userApi from '@/api/user.js'
	var that
	export default {
		data() {
			return {
				avatarUrl: '',
				nickName: '',
				userinfoTitle: "注册",
				subscribeHistoryTitle: "预约历史记录",
				avatarUrl: "https://742d-t-42b879-1256515311.tcb.qcloud.la/icons/picture.png?sign=486a0d49a1ac7b11a2c4b2509c4f286c&t=1568122069"
			}
		},
		onShow() {
			that.refresh()
		},
		onLoad() {
			that = this
			
		},
		methods: {
			gotoUserinfo: function() {
				wx.requestSubscribeMessage({
					tmplIds: ['8zRniXCqrhYN5RaWMIg_72ZCkF_BfweNQNyvQr2NK8g', 'nciY0QM-FRgySfGOZSnwC7z6D1t6_P43SsSs3rupics'],
					success(res) {
						console.log(res)
						uni.navigateTo({
							url: "/pages/userinfo/userinfo"
						})
					},
					fail(res) {
						console.log(res)
						uni.navigateTo({
							url: "/pages/userinfo/userinfo"
						})
						
					}
					
				})
			},
			gotoSubscribeHistory: function() {
				uni.navigateTo({
					url: '../subscribe_history/subscribe_history'
				})
			},
			refresh: function() {
				if (getApp().globalData.isRegister) {
					that.userinfoTitle = "修改个人信息"
					userApi.getUserInfo().then(resp => {
						var userInfo = resp.data
						this.avatarUrl = userInfo.avatar_url
						this.nickName = userInfo.nick_name
					})
				} else {
					//this.avatarUrl = getApp().globalData.userInfo.avatarUrl
					this.nickName = '游客'
				}
			}
		}
	}
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
