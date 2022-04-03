<template>
	<view class="container">
	  <view class="userinfo">
	    <image class="userinfo-avatar" src="../../static/img/user/xinli.png" mode="cover"></image>
	    <text class="userinfo-nickname">{{userInfo.nickName}}</text>
	  </view>
	  <view style="width:200rpx; margin-left: 260rpx;margin-top: 100px;">
	  	<button @click="getUserProfile"  type="primary" style="margin-top: 200px;"> 进入 </button>
	  </view>
	</view>
</template>

<script>
	import { getOpenid } from '@/api/wechat.js'
	import { setToken, setOpenid } from "@/utils/auth.js"
	import userApi from '@/api/user.js'
	var that
	export default {
		data() {
			return {
				userInfo: {},
				hasUserInfo: false,
				canIUseGetUserProfile: false,
				isRegister: true,
				title: 'Hello'
			}
		},
		onLoad() {
			that = this
			that.userLogin()
			// uni.login({
			// 	success(res) {
			// 		getOpenid(getApp().globalData.appId, getApp().globalData.secret, res.code, systemInfo.app).then(resp => {
			// 			var getUserInfoFlag = that.getUserInfo()
			// 			var openid = resp.data.openid
			// 			getApp().globalData.openid = openid
			// 			if (resp.code == 400001) {
			// 				that.isRegister = false
			// 				getApp().globalData.isRegister = false
			// 			} else if (resp.code == 400002) {
			// 				getApp().globalData.token = resp.data.token
			// 				getApp().globalData.id = resp.data.user.id
			// 				getApp().globalData.role = resp.data.user.role
			// 				getApp().globalData.isRegister = true
			// 				if (systemInfo.app == "DingTalk") {
			// 					uni.switchTab({
			// 						url:"/pages/user/user"
			// 					})
			// 				}else if (!getUserInfoFlag) {
			// 					that.isRegister = false
			// 				} else {
			// 					uni.switchTab({
			// 						url:"/pages/user/user"
			// 					})
			// 				}
			// 			}
			// 		})
			// 	}
			// })
		},
		methods: {
			login: function() {
				return new Promise((resolve,reject)=>{
					uni.login({
						success(res) {
							resolve(res)
						}
					})
				})
			},
			userLogin: function() {
				userApi.getWechatConfig().then(resp => {
					getApp().globalData.appId = resp.data.appid;
					getApp().globalData.secret = resp.data.secret;
					that.login().then(res => {
						var systemInfo = uni.getSystemInfoSync()
						if (!systemInfo.app) {
							systemInfo.app = "wechat"
						}
						getOpenid(getApp().globalData.appId, getApp().globalData.secret, res.code, systemInfo.app).then(resp => {
							var openid = resp.data.openid
							getApp().globalData.openid = openid
							if (resp.code == 400001) {
								that.isRegister = false
								getApp().globalData.isRegister = false
							} else if (resp.code == 400002) {
								getApp().globalData.token = resp.data.token
								getApp().globalData.id = resp.data.user.id
								getApp().globalData.role = resp.data.user.role
								getApp().globalData.isRegister = true
								uni.switchTab({
									url:"/pages/user/user"
								})
							}
						})
					})
				})
				
			},
			getUserProfile: function() {
				uni.getUserProfile({
					desc:'登录',
					success(e) {
						var userInfo = e.userInfo
						getApp().globalData.userInfo = userInfo
						uni.switchTab({
							url:"/pages/user/user"
						})
						return true
					},
					fail(e) {
						console.log(e)
						wx.showToast({
							title: "请先授权"
						})
						return false
					}
				})
			}
		}
	}
</script>

<style>
	.page {
		width:100%;
		overflow-x:hidden;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	
	.userinfo
	{
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  background-color: #fff;
	  border-top-left-radius: 10rpx;
	  border-top-right-radius: 10rpx;
	  height: 200rpx;
	  margin-top: 150rpx;
	}
	
	.userinfo-avatar 
	{
	  align-items: center;
	  width: 128rpx;
	  height: 128rpx;
	  margin-left: 300rpx;
	  border-radius: 50%;
	}
	
	.userinfo-nickname 
	{
	  color: #000;
	  margin-left: 70rpx;
	}
</style>
