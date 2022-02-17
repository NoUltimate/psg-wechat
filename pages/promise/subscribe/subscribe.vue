<template>
	<view class="page">  
<!-- 	  <view>
		  <uniSegmentedControl :values="weekNavbar" @clickItem="weekChange" style-type="text" active-color="#2E64FE" :current="weekIndex"></uniSegmentedControl>
	  </view>
	  <view>
		  <uniSegmentedControl :values="weekDayNavbar" @clickItem="weekDayChange" style-type="text" active-color="#2E64FE" :current="weekDayIndex"></uniSegmentedControl>
	  </view> -->
	  <view v-for="(period, periodKey) in periodMap">
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
				<view class="card">
				  <u-swipe-action :show="subscribe.show" :index="periodKey + ',' + jobSchduleIndex"
				  			v-for="(jobSchdule, jobSchduleIndex) in period" :key="subscribe.id" 
				  			@content-click="selectJobSchedule"
				  		>
				  		<view>
							<view style="margin-top: 10rpx;">
								<u-row>
									<u-col span="1">
										<image style="width: 50rpx; height: 50rpx;" src="https://742d-t-42b879-1256515311.tcb.qcloud.la/icons/picture.png?sign=486a0d49a1ac7b11a2c4b2509c4f286c&t=1568122069"></image>
									</u-col>
									<u-col span="2">
										<text style="margin-left: 10rpx;font-size: 27rpx;height: 40rpx;">咨询师 </text>
									</u-col>
									<u-col span="8">
										<view v-if="jobSchdule.psy.tag !== ''" style="margin-left: 10rpx;" v-for="(tag, tagIndex) in (jobSchdule.psy.tag.split(','))">
											<u-tag size="mini" :text="tag" mode="dark" />
										</view>
									</u-col>
								</u-row>
							</view>
							<view>
								<u-row>
									<u-col span="9">
										<text style="font-size: 50rpx;font-weight: 500;">{{ jobSchdule.psy.real_name }}</text><p></p>
										<text>昵称：{{ jobSchdule.psy.nick_name }}</text><p></p>
										<text>等级：{{ jobSchdule.psy.rank.name.length > 0 ? jobSchdule.psy.rank.name : "无" }}</text><p></p>
										<text>地址：{{ jobSchdule.address_name }}</text>
									</u-col>
									<u-col span="3">
										<image :src="jobSchdule.psy.avatar_url" style="border-radius: 50%;"></image>
									</u-col>
								</u-row>
							</view>					  
				  		</view>
				  </u-swipe-action>
				</view>
			  </u-col>
		  </u-row>
	  </view>
	</view>  
</template>

<script>
	var that
	import scheduleApi from '@/api/schedule.js'
	//import { uniSegmentedControl } from '@dcloudio/uni-ui'
	export default {
		// components: {
		// 	uniSegmentedControl
		// },
		data() {
			return {
				weekIndex: 0,
				weekDayIndex: 0,
				weekNavbar:['这周', '下周'],
				weekDayNavbar: ['周一', '周二', '周三', '周四','周五','周六', '周日'],
				weekDayMap:{
					'周一': 1,
					'周二': 2,
					'周三': 3,
					'周四': 4,
					'周五': 5,
					'周六': 6,
					'周日': 7
				},
				src: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg",
				periodMap: undefined,
				dayZeroTime: undefined,
				options: [
					{
						text: '预约',
						style: {
							backgroundColor: '#007aff'
					    }
					}
				]
			}
		},
		onLoad() {
			that = this
			this.setWeekDayNavBar(this.weekIndex, new Date().getDay())
			this.getJobSchedule()
		},
		methods: {
			selectJobSchedule: function(index) {
				var values = index.split(',')
				console.log(values)
				console.log(this.periodMap[values[0]])
				var subscribeData = this.periodMap[values[0]][values[1]]
				uni.navigateTo({
					url: "../subscribe_content/subscribe_content?subscribeData=" + JSON.stringify(subscribeData) + "&dayZeroTime=" + this.dayZeroTime + "&period=" + values[0]
				})
			},
			getJobSchedule: function() {
				return new Promise((resolve, reject) => {
					var weekIndex = this.weekIndex
					var weekDayIndex = this.weekDayIndex
					var weekDaymap = this.weekDayMap
					var weekDayNavbar = this.weekDayNavbar
					var date = new Date()
					var time = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
					var day = date.getDay()
					if (day == 0) {
						day = 7;
					}
					if (weekIndex == 0) {
						time += 86400000*(weekDaymap[weekDayNavbar[weekDayIndex]] - day)
					} else {
						time += 86400000*(7 - day + weekDaymap[weekDayNavbar[weekDayIndex]])
					}
					this.dayZeroTime = time
					this.periodMap = {}
					this.$showLoading("加载中")
					scheduleApi.getJobScheduleByDay(time).then(resp => {
						this.periodMap = resp.data
						this.$hideLoding()
						resolve("")
					})
				})
			},
			weekChange: function(e) {
				var index = e.currentIndex
				if (this.weekIndex !== index) {
				   this.weekIndex = index
				   this.weekDayIndex = 0
				   this.setWeekDayNavBar(index, new Date().getDay())
				   this.getJobSchedule()
				}
			},
			weekDayChange: function(e) {
				this.weekDayIndex = e.currentIndex
				this.getJobSchedule()
			},
			setWeekDayNavBar: function(index, day) {
				var weekDay = []
				var weekDayNavbar = ['周一', '周二', '周三',"周四","周五","周六","周日"]
				if (day == 0) {
					day = 7;
				}
				if (index == 0) {
					for(var weekIndex in weekDayNavbar) {
						if (weekIndex >= day - 1) {
							weekDay.push(weekDayNavbar[weekIndex])
						} 
					}
				} else {
					for(var weekIndex in weekDayNavbar) {
						if (weekIndex < day - 1) {
							weekDay.push(weekDayNavbar[weekIndex])
						} 
					}
				}
				this.weekDayNavbar = weekDay
			}
		}
	}
</script>

<style>
	.item {
		display: flex;
		padding: 20rpx;
	}
		
	image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
	}
		
	.title {
		text-align: left;
		font-size: 28rpx;
		color: $u-content-color;
		margin-top: 20rpx;
	}
		
	.userinfo
	{
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  border-top-left-radius: 10rpx;
	  border-top-right-radius: 10rpx;
	}
	
	.userinfo-avatar 
	{
	  width: 128rpx;
	  height: 128rpx;
	  margin-right: 50rpx;
	  border-radius: 50%;
	}
	
	.userinfo-nickname 
	{
	  color: #000;
	  margin-left: 50rpx;
	}
		
	.card
	{
		display: flex;
		flex-direction:column;
		width: 650rpx;
		margin:20rpx;
		border-radius: 20rpx;
		box-shadow:0rpx 18rpx 50rpx 10rpx rgba(0,0,0,0.2);
		color: rgba(0,0,0,0.7);
		position:relative;
		margin-left:20rpx;
	}
</style>
