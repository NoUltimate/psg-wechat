<template>
	<view class="" style="padding-bottom: 50px;">
<!-- 		<u-form :model="form" ref="uForm">
			<u-form-item prop="realName" label="预约时间段（最多5个）" label-position="top">
				<uni-collapse ref="collapse">
					<uni-collapse-item :open="true">
						<template v-slot:title>

						</template>
						<view>
							<view class="uni-flex uni-row">
								<uni-icons type="plus" size="20" @click="addPeriod" ></uni-icons>
								<uni-icons type="minus" size="20" @click="deletePeriod"></uni-icons>
							</view>
							<view>
								<view v-for="(period, index) in periods">
									<view>
										<uni-data-picker v-model="period.data" :localdata="selectPeriods" popup-title="请选择预约时间" @change="periodChange" @nodeclick="onnodeclick"></uni-data-picker>
									</view>
								</view>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</u-form-item>
			<view v-for="(question, index1) in showQuestionList" :key="index1">
				<u-form-item prop="questions2" :label="getQuestionLabel(index1, question)" label-position="top">
					<view v-if="isVisible(question)">
						<view v-if="question.type == 1">
							<uni-data-checkbox v-model="question.value" :localdata="question.config_object.options"  @change="questionOptionChange"></uni-data-checkbox>
						</view>
						<view v-if="question.type == 2">
							<uni-easyinput type="textarea" autoHeight v-model="question.value" placeholder="请输入内容"></uni-easyinput>
						</view>
					</view>
				</u-form-item>
			</view>
			<u-button @click="submit">提交</u-button>
		</u-form> -->
		
		<uni-forms ref="form" :modelValue="formData" label-width="250" :rules="rules">
			<uni-group title="预约时间(最多五个)" top="20">
				<view style="flex-direction: column;">
					<view>
						<uni-icons type="plus" size="30" @click="addPeriod" ></uni-icons>
						<uni-icons type="minus" size="30" @click="deletePeriod"></uni-icons>
					</view>
				</view>
				<view v-for="(period, index1) in periods" :key="index1">
					<uni-forms-item :name="'periods[' + index1 + '].data'" :label="'预约时间' + (index1 + 1)" label-position="top" :rules="periodRule" validate-trigger="bind">
						<view>
							<uni-data-picker v-model="periods[index1].data" :localdata="selectPeriods" popup-title="请选择预约时间" @change="periodChange" @nodeclick="onnodeclick"></uni-data-picker>
						</view>
					</uni-forms-item>
				</view>
				<text>注：所选择的预约时间只是预期时间，具体初访或咨询时间心理帮扶团的咨询师会通过短信/电话等方式与您联系确定具体的时间</text>
			</uni-group>
<!-- 			<uni-forms-item name="periods" label="预约时间段（最多5个）" >
				<uni-collapse ref="collapse">
					<uni-collapse-item :open="true">
						<template v-slot:title>
							
						</template>
						<view>
							<view class="uni-flex uni-row">
								<uni-icons type="plus" size="20" @click="addPeriod" ></uni-icons>
								<uni-icons type="minus" size="20" @click="deletePeriod"></uni-icons>
							</view>
							<view>
								<view v-for="(period, index1) in periods" :key="index1">
									<view>
										<uni-data-picker v-model="period.data" :localdata="selectPeriods" popup-title="请选择预约时间" @change="periodChange" @nodeclick="onnodeclick"></uni-data-picker>
									</view>
								</view>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</uni-forms-item> -->
			<uni-group title="问卷调查" top="20">
				<view v-for="(question, index1) in showQuestionList" :key="index1">
					<uni-forms-item label-width="300" :name="'question[' + index1 + ']'" :label="getQuestionLabel(index1, question)" :rules="questionRule" label-position="top" validate-trigger="bind">
						<view v-if="isVisible(question)">
							<view v-if="question.type == 1">
								<uni-data-checkbox v-model="showQuestionList[index1].value" :localdata="question.config_object.options"  @change="questionOptionChange"></uni-data-checkbox>
							</view>
							<view v-if="question.type == 2">
								<uni-easyinput type="textarea" autoHeight v-model="showQuestionList[index1].value" placeholder="请输入内容"></uni-easyinput>
							</view>
						</view>
					</uni-forms-item>
				</view>
			</uni-group>
		</uni-forms>
		<view>
			<u-button @click="submit(form)" style="margin-bottom: 100rpx;">提交</u-button>
		</view>
	</view>
</template>

<script>
	var that
	import subscribeApi from '@/api/subscribe.js'
	import questionApi from '@/api/question.js'
	import dateUtils from '@/utils/date.js'
	export default {
		data() {
			return {
				periodRule: [{required: true, errorMessage: "预约时间不能为空"}],
				questionRule: [{required: true, errorMessage: "该内容不能为空"}],
				rules: {
				    email: {
						rules: [
							{
								required: true,
								errorMessage: '该内容不能为空'
							},
							{
								validateFunction: (rule, value, data, callback) => {
									// 异步需要返回 Promise 对象
									return new Promise((resolve, reject) => {
										setTimeout(() => {
											if (this.formData.periods.length > 0 ) {
												// 通过返回 resolve
												resolve()
											} else {
												// 不通过返回 reject(new Error('错误信息'))
												reject(new Error('预约时间不能为空'))
											}
										}, 2000)
									})
								}								
							}
						]
						
					}
				},
				selectPeriods: [],
				originSelectPeriods: [],
				questionList: [],
				questionMap: new Map(),
				showQuestionList: [],
				formData:{
				    periods: [{
						data: ""
					}],
					showQuestionList: []
				},
				periods:[]
			}
		},
		onReady() {
			this.$refs.form.setRules(that.rules);
		},
		onLoad() {
			that = this
			var date = new Date()
			var startDayTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
			var dayTimeList = []
			for(var i = 1; i <= 7; ++i) {
				var t = startDayTime + 86400000 * i;
				var d = dateUtils.formatDate(new Date(t), 'yyyy-MM-dd')
				that.selectPeriods.push({
					text: d + "(" + getApp().globalData.weekDayMap[new Date(t).getDay()] + ")",
					value: String(i),
					children: [
						{
							text: '8:30-9:30',
							value: d + " 8:00~" + d + " 9:00"
						},
						{
							text: "10:00-11:00",
							value: d + " 10:00~" + d + " 11:00"
						},
						{
							text: "13:30-14:30",
							value: d + " 13:30~" + d + " 14:30"
						},
						{
							text: "15:00-16:00",
							value: d + " 15:00~" + d + " 16:00"
						},
						{
							text: "18:00-19:00",
							value: d + " 18:00~" + d + " 19:00"
						},
						{
							text: "19:30-20:30",
							value: d + " 19:30~" + d + " 20:30"
						},
						{
							text: "21:00-22:00",
							value: d + " 21:00~" + d + " 22:00"
						}
					]
				})
			}
			this.originSelectPeriods = this.selectPeriods
			questionApi.getQuestionList().then(resp => {
				var questionList = resp.data.question_list
				//that.questionList = questionList
				questionList.forEach(item => {
					this.questionMap[item.question_no] = {
						item: item,
						index: questionList.indexOf(item)
					}
				})
				for(var index in questionList) {
					var order = questionList[index].sequence
					if (order == null || order == "") continue
					this.showQuestionList.push(questionList[index])
				}
			})
		},
		methods: {
			questionOptionChange(e) {
				var questionExistMap = new Map()
				var questionList = this.showQuestionList
				questionList.forEach(item => {
					questionExistMap[item.question_no] = {
						item: item,
						index: questionList.indexOf(item)
					}
				})
				questionList.forEach(question => {
					if (question.question_no == "question6" && parseInt(question.value) > 0 && questionExistMap["question7"] == null) {
						questionList.splice(this.questionMap[question.question_no].index, 0, this.questionMap["question7"].item)
						//this.$set(this.formData.showQuestionList, this.questionMap[question.question_no].index, this.questionMap["question7"].item)
					}
					if (question.question_no == "question7" && parseInt(questionExistMap["question6"].item.value) == 0 ) {
						questionList.splice(questionExistMap["question7"].index, 1)
					} 
				})
				this.showQuestionList = questionList
			},
			periodChange(e) {
				//console.log(e)
				//that.refreshSelectPeriod(e.detail.value[1].value)
			},
			onnodeclick(node) {
				//console.log(node)
			},
			refreshSelectPeriod(value) {

			},
			getQuestionLabel(index, question) {
				return (index + 1) + "." + question.config_object.title
			},
			isVisible(question) {
				return true;
			},
			addPeriod() {
				if (this.periods.length == 5) {
					uni.showToast({
						title: "最多只能选五个",
						icon: "none"
					})
					return
				}
				this.periods.push({
					
				});
				// this.$nextTick(() => {
			 //        this.$refs.collapse.resize()
			 //    })
			},
			deletePeriod() {
				if (this.periods.length == 1) {
					uni.showToast({
						title: "不能再少啦",
						icon: "none"
					})
					return
				}
				this.periods.splice(this.periods.length - 1, 1);
				// this.$nextTick(() => {
			 //        this.$refs.collapse.resize()
			 //    })
			},
			submit: function(ref) {
				
				this.$refs.form.validate([],(err,value)=>{
					if (this.periods.length == 0) {
						uni.showToast({
							title: "预约时间太少啦",
							icon: "error"
						})
						return
					}
					for(var i = 0; i < this.periods.length; ++i) {
						for(var j = i + 1; j < this.periods.length; ++j) {
							if (this.periods[i].data == this.periods[j].data) {
								uni.showToast({
									title: "预约时间重复",
									icon: "error"
								})
								return
							}
						}
					}
					if (!err) {
						uni.showModal({
							title: '预约单',
							content: '是否确认预约？',
							showCancel: true,//是否显示取消按钮
							cancelText:"否",//默认是“取消”
							//cancelColor:'skyblue',//取消文字的颜色
							confirmText:"是",//默认是“确定”
							//confirmColor: 'skyblue',//确定文字的颜色
							success: function (res) {
							    if (res.cancel) {
							        //点击取消,默认隐藏弹框
							    } else {
							        var periods = [];
									that.periods.forEach(period => {
										periods.push(period.data)
									})
									subscribeApi.addSubscribe(
										periods.join(","),
										JSON.stringify(that.showQuestionList)
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
	/* @import "@/static/asserts/font/iconfont.css"; */
</style>
