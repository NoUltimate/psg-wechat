<template>
	<view>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-action-sheet :list="cancelReasonList" @click="clickCancelReason" v-model="showCancelReason"></u-action-sheet>
		<view class="userinfo">
			<view class="userinfo-avatar">
				<image src="../../static/img/user/xinli.png" mode="cover"></image>
			</view>
			<view class="userinfo-nickname">
				<text >心理帮扶团欢迎你</text>
			</view>
		</view> 
		<view>
			<u-divider>预约单左滑有惊喜</u-divider>
			<view v-if="hasSubscribe==false" style="height: 500rpx;margin-top: 70rpx;">
				<u-row>
					<u-col offset="2">
						<image style="height: 500rpx;width: 480rpx;" src="../../static/img/user/none.png"></image>
					</u-col>
				</u-row>
			</view>
			<view v-if="role==2 && hasSubscribe==false" style="margin-top: 50rpx;">
					<u-col offset="4" span="6">
						<text style="text-decoration:underline;font-size: medium;width: 380rpx;" @click="gotoSubscribeNotice">用户预约须知</text>
					</u-col>
				</u-row>			  
				<u-row>
					<u-col offset="4" span="4">
						<u-button style="height: 300rpx;width: 380rpx;" shape="square" @click="subscribe">预约</u-button>
					</u-col>
				</u-row>
			</view>
		</view>
		<view v-for="(subscribe, index) in subscribeList">
	  		<u-row>
	  			<u-col span="1" offset="0.2">
	  				<view>
	  					<image src="https://742d-t-42b879-1256515311.tcb.qcloud.la/icons/dot.png?sign=ae5a45eef821b2751f4501a4756e7e7a&t=1568122188" style="width: 20rpx; height: 20rpx;"></image>
	  				</view>
	  			</u-col>
	  			<u-col span="10">
	  				<view style="margin-left: 20rpx; margin-right: 20rpx;">预约单id:{{ subscribe.id }} </view>
	  			</u-col>
	  		</u-row>
	  		<u-row>
	  			<u-col offset="0.5">
					<view class="card">
						<u-swipe-action  :index="index"
							@content-click="selectJobSchedule" @click="click"
							:options="options"
							>
							<view>
								<view style="margin-top: 10rpx;">
									<u-row>
										<u-col span="1">
											<image style="width: 50rpx; height: 50rpx;" src="https://742d-t-42b879-1256515311.tcb.qcloud.la/icons/picture.png?sign=486a0d49a1ac7b11a2c4b2509c4f286c&t=1568122069"></image>
										</u-col>
										<u-col span="3">
											<view style="margin-left: 10rpx;">{{ role == 1 ? '用户' : '咨询师' }}</view>
										</u-col>
									</u-row>
								</view>
								<view v-if="role == 1">
									<u-row>
										<u-col span="9">
											<text style="font-size: 50rpx;font-weight: 500;">{{ subscribe.user.real_name }}</text><p></p>
											<text>昵称：{{ subscribe.user.nick_name }}</text><p></p>
											<text>等级：{{ subscribe.user.rank.name }}</text><p></p>
											<!-- <text>地址：{{ JSON.parse(subscribe.detail.address).name }}</text> -->
										</u-col>
										<u-col span="3">
											<image :src="subscribe.user.avatar_url"></image>
										</u-col>
									</u-row>
								</view>	
								<view v-if="role == 2">
									<u-row>
										<u-col span="9">
											<text style="font-size: 50rpx;font-weight: 500;">{{ subscribe.user.real_name }}</text><p></p>
											<text>昵称：{{ subscribe.psy.nick_name }}</text><p></p>
											<text>等级：{{ subscribe.psy.rank.name }}</text><p></p>
											<!-- <text>地址：{{ JSON.parse(subscribe.detail.address).name }}</text> -->
										</u-col>
										<u-col span="3">
											<image :src="subscribe.psy.avatar_url"></image>
										</u-col>
									</u-row>
								</view>	
							</view>
						</u-swipe-action>
					</view>
				</u-col>
			</u-row>
		</view>
		<u-modal v-model="show" :show-cancel-button="true" confirm-text="确认"
			title="请选择取消理由" @cancel="cancel" @confirm="confirmCancelReason">
			<view style="margin-top: auto;">
				<uni-data-picker v-model="reason" :localdata="selectReasons" popup-title="请选择预约时间" @change="change" @nodeclick="onnodeclick"></uni-data-picker>
			</view>
			<view v-if="reason == '其他理由'">
				<uni-easyinput type="textarea" autoHeight v-model="customReason" placeholder="请输入取消预约理由"></uni-easyinput>
			</view>
		</u-modal>
	</view>
</template>

<script>
	var that
	import subscribeApi from '@/api/subscribe.js'
	import userApi from '@/api/user.js'
	export default {
		data() {
			return {
				role: getApp().globalData.role,
				selectSubscribeId: "",
				isNomalUser: true,
				hasSubscribe: false,
				subscribeMap: undefined,
				subscribeList: [],
				showCancelReason : false,
				subscribeData : undefined,
				cancelReasonList: [{
					text: '非本校学生',
					color: 'blue',
					fontSize: 28
				}, {
					text: '我也不知道',
					color: 'blue',
					fontSize: 28
				}, {
					text: '自定义',
					color: 'blue',
					fontSize: 28
				}],
				options: [
					{
						text: '查看',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '取消',
						style: {
							backgroundColor: '#dd524d'
						}
					},
					{
						text: '完成',
						style: {
							backgroundColor: '#00aa00'
						}
					}
				],
				show: false,
				reason: "",
				customReason: "",
				selectReasons : []
			}
		},
		onLoad() {
			that = this
			if (getApp().globalData.isRegister) {
				this.refreshSubscribeList()
			}
			// todo 咨询师和用户的取消理由不一样
			var reasonList = []
			if (this.role == 1) {
				reasonList = ['预约用户没有按时到场', '预约用户没有按时点击完成预约', '预约用户不是本校学生', '时间冲突', '其他理由']
			} else {
				reasonList = ['预约时间选错了', '预约时间已经过了', '时间冲突', '其他理由']
			}
			reasonList.forEach(reason => {
				this.selectReasons.push({
					text: reason,
					value: reason,
					children: []
				})
			})
			
			// // 咨询师没有完成按钮
			// if (getApp().globalData.role == 1) {
			// 	var options = [
			// 		{
			// 			text: '查看',
			// 			style: {
			// 				backgroundColor: '#007aff'
			// 			}
			// 		},
			// 		{
			// 			text: '取消',
			// 			style: {
			// 				backgroundColor: '#dd524d'
			// 			}
			// 		}
			// 	]
			// 	this.options = options
			// }
		},
		onPullDownRefresh() {
		    this.refreshSubscribeList()
			uni.stopPullDownRefresh();
		},
		onShow() {
			if (getApp().globalData.isRegister) {
				this.refreshSubscribeList()
			}
		},
		onReady() {
			// this.$refs.uTips.show({
			// 	title: '左滑有惊喜',
			// 	type: 'success',
			// 	duration: '2300'
			// })
		},
		methods: {
			gotoSubscribeNotice: function() {
				uni.navigateTo({
					url:"/pages/subscribe_notice/subscribe_notice"
				})
			},
			
			refreshSubscribeList: function() {
				this.$showLoading('加载中')
				var statusList = []
				statusList.push(1)
				this.role = getApp().globalData.role
				subscribeApi.getSubscribeByRole(statusList).then(resp => {
					var subscribeList = resp.data
					if (subscribeList.length > 0) {
						this.hasSubscribe = true
					} else {
						this.hasSubscribe = false
					}
					this.subscribeList = subscribeList
					this.$hideLoding()
				})
			},
			subscribe: function() {
				if (!getApp().globalData.isRegister) {
					uni.showModal({
						title: '提示',
						content: '请先注册再进行预约',
						showCancel: true,//是否显示取消按钮
						cancelText:"否",//默认是“取消”
						cancelColor:'skyblue',//取消文字的颜色
						confirmText:"是",//默认是“确定”
						confirmColor: 'skyblue',//确定文字的颜色
						success: function (res) {
						    if (res.cancel) {
						        //点击取消,默认隐藏弹框
						    } else {
						        //点击确定，取消预约
						    }
						},
						fail: function (res) { },//接口调用失败的回调函数
						complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
					})
				} else {
					userApi.getUserInfo().then(resp => {
						console.log(resp.data.is_info_complete, resp.data.is_info_complete == 0)
						if (resp.data.is_info_complete == 0) {
							uni.showModal({
								title: '提示',
								content: '请先完善个人信息',
								showCancel: true,//是否显示取消按钮
								cancelText:"否",//默认是“取消”
								cancelColor:'skyblue',//取消文字的颜色
								confirmText:"是",//默认是“确定”
								confirmColor: 'skyblue',//确定文字的颜色
								success: function (res) {
								    if (res.cancel) {
								        //点击取消,默认隐藏弹框
								    } else {
								        //点击确定，取消预约
								    }
								},
								fail: function (res) { },//接口调用失败的回调函数
								complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
							})
						} else {
							uni.navigateTo({
								url: "/pages/subscribe_message/subscribe_message"
							})
						}
					})
				
				}
			},
			open: function(index) {
				
			},
			change(e) {
				
			},
			onnodeclick(e) {
				
			},
			confirmCancelReason: function(index) {
				if (this.reason == "") {
					uni.showToast({
						title: '请选择取消理由',
						icon: 'none'
					});
					this.show = true
					return;
				}
				var reason = this.reason
				if (reason == '其他理由') {
					if (this.customReason == "") {
						uni.showToast({
							title: '请填写取消理由',
							icon: 'none'
						});
						this.show = true
						return;
					}
					reason = this.customReason
				}
				subscribeApi.updateSubscribeStatus(this.selectSubscribeId, 2, null, null, reason).then(resp => {
					uni.navigateBack({
						
					})
					that.refreshSubscribeList()
				})
				this.reason = ""
			},
			click: function(index, optionIndex) {
				console.log(this.subscribeList, index)
				var data = this.subscribeList[index]
				this.subscribeData = data
				if (optionIndex == 0) {
					uni.navigateTo({
						url:'../user_subscribe_message/user_subscribe_message?subscribeId=' + data.id
					})
				} else if (optionIndex == 1) {
					this.show = true
					this.selectSubscribeId = data.id
					// uni.showModal({
					// 	title: '取消预约',
					// 	content: '确定要取消预约？',
					// 	showCancel: true,//是否显示取消按钮
					// 	cancelText:"否",//默认是“取消”
					// 	cancelColor:'skyblue',//取消文字的颜色
					// 	confirmText:"是",//默认是“确定”
					// 	confirmColor: 'skyblue',//确定文字的颜色
					// 	success: function (res) {
					// 	    if (res.cancel) {
					// 	        //点击取消,默认隐藏弹框
					// 	    } else {
					// 	        //点击确定，取消预约
					// 			// subscribeApi.updateSubscribeStatus(data.id, 2, null, null, null).then(resp => {
					// 			// 	that.refreshSubscribeList()
					// 			// })
					// 			that.showCancelReason = true
					// 	    }
					// 	},
					// 	fail: function (res) { },//接口调用失败的回调函数
					// 	complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
					// })
				} else if (optionIndex == 2){
					uni.navigateTo({
						url:'../user_subscribe_finish/user_subscribe_finish?subscribeId=' + data.id
					})
				}
			}
		}
	}
</script>

<style scoped>
	.userinfo 
	{
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  border-top-left-radius: 10rpx;
	  border-top-right-radius: 10rpx;
	  height: 200rpx;
	  margin-top: 20rpx;
	  margin-left: 30rpx;
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
	
	.line{
	  margin: 0 auto;
	  width: 600rpx;
	  height: 2rpx;
	  background-color: #D8D8D8;
	}

		
	image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
	}
		
	.card
	{
		display: flex;
		flex-direction:column;
		width: 650rpx;
		margin:20rpx;
		border-radius: 10rpx;
		box-shadow:0rpx 18rpx 50rpx 10rpx rgba(0,0,0,0.2);
		color: rgba(0,0,0,0.7);
		position:relative;
		margin-left:20rpx;
	}
</style>
