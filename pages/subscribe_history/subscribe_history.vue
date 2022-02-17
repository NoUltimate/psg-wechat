<!-- <template>
	<view class="page">
	  <view>
		 <uniSegmentedControl :values="statusNavbar" @clickItem="statusChange" style-type="text" active-color="#2E64FE" :current="statusIndex"></uniSegmentedControl>
	  </view>
	  <view v-for="(period, periodKey) in subscribeMap">
	  		  <u-row>
	  			  <u-col span="1" offset="0.2">
	  				  <view>
	  					  <image src="https://742d-t-42b879-1256515311.tcb.qcloud.la/icons/dot.png?sign=ae5a45eef821b2751f4501a4756e7e7a&t=1568122188" style="width: 20rpx; height: 20rpx;"></image>
	  				  </view>
	  			  </u-col>
	  			  <u-col span="10">
	  				  <view style="margin-left: 20rpx; margin-right: 20rpx;">预约时间:{{ periodKey }} </view>
	  			  </u-col>
	  		  </u-row>
	  		  <u-row>
	  			  <u-col offset="0.5">
	  				  <u-swipe-action class="card" :show="subscribe.show" :index="periodKey + ',' + subscribeIndex"
	  				  			v-for="(subscribe, subscribeIndex) in period" :key="subscribe.id" 
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
	  							<view>
	  								<u-row>
	  									<u-col span="9">
	  										<text style="font-size: 50rpx;font-weight: 500;">{{ subscribe.show_user.real_name }}</text><p></p>
	  										<text>昵称：{{ subscribe.show_user.nick_name }}</text><p></p>
	  										<text>等级：{{ subscribe.show_user.rank.name }}</text><p></p>
	  										<text>地址：{{ JSON.parse(subscribe.detail.address).name }}</text>
	  									</u-col>
	  									<u-col span="3">
	  										<image :src="subscribe.show_user.avatar_url"></image>
	  									</u-col>
	  								</u-row>
	  							</view>					  
	  				  		</view>
	  				  </u-swipe-action>
	  			  </u-col>
	  		  </u-row>
	  </view>
	</view>
</template>

<script>
	var that
	import { uniSegmentedControl } from '@dcloudio/uni-ui'
	import subscribeApi from '@/api/subscribe.js'
	export default {
		components: {
			uniSegmentedControl
		},
		data() {
			return {
				role: getApp().globalData.role,
				isNomalUser: true,
				roleName: '',
				hasSubscribe: false,
				subscribeMap: undefined,
				showCancelReason : false,
				subscribeData : undefined,
				statusNavbar:['未完成', '已取消', '已完成'],
				statusIndex: 0,
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
					}
				]
			}
		},
		onLoad() {
			that = this
			if (getApp().globalData.isRegister) {
				this.refreshSubscribeList()
			}
		},
		onPullDownRefresh() {
		    this.refreshSubscribeList()
			uni.stopPullDownRefresh();
		},
		onReady() {

		},
		methods: {
			refreshSubscribeList: function() {
				this.$showLoading('加载中')
				var statusList
				if (this.statusIndex == 0) {
					statusList = [1]
				} else if (this.statusIndex == 1) {
					statusList = [2]
				} else if (this.statusIndex == 2) {
					statusList = [3]
				}
				subscribeApi.getSubscribeByRole(statusList).then(resp => {
					var subscribeMap = resp.data
					if (Object.keys(subscribeMap).length > 0) {
						this.hasSubscribe = true
					} else {
						this.hasSubscribe = false
					}
					this.subscribeMap = subscribeMap
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
					uni.navigateTo({
						url: "/pages/subscribe/subscribe"
					})
				}
			},
			open: function(index) {
				
			},
			statusChange: function(e) {
				this.statusIndex = e.currentIndex
				this.refreshSubscribeList()
			},
			clickCancelReason: function(index) {
				var cancelReason = this.cancelReasonList[index].text
				if (cancelReason == '自定义') {
					
				}
				console.log(this.cancelReasonList, cancelReason)
				subscribeApi.updateSubscribeStatus(this.subscribeData.id, 2, null, null, cancelReason).then(resp => {
					that.refreshSubscribeList()
				})
			},
			click: function(index, optionIndex) {
				var temp = index.split(',')
				var periodIndex = temp[0]
				var subscribeIndex = temp[1]
				var data = this.subscribeMap[periodIndex][subscribeIndex]
				this.subscribeData = data
				if (optionIndex == 0) {
					uni.navigateTo({
						url:'../user_subscribe_detail/user_subscribe_detail?subscribeData=' + JSON.stringify(data) + '&subscribeTime=' + periodIndex
					})
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
		background: #fff;
		margin:20rpx;
		border-radius: 10rpx;
		box-shadow:0rpx 18rpx 50rpx 10rpx rgba(0,0,0,0.2);
		color: rgba(0,0,0,0.7);
		position:relative;
		margin-left:20rpx;
	}
</style>
 -->