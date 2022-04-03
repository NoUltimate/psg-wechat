<script>
	import userApi from '@/api/user.js'
	export default {
		globalData: {
			openid : '',
			id: '',
			role: undefined,
			appId: '',
			secret: '',
			isReadPromise: false, 
			isRegister: true,
			roleMap: {
				1 : '咨询师',
				2 : '用户'
			},
			sexMap : {
				"男":1,
				"女":2
			},
			sexIdMap : {
				1:"男",
				2:"女"
			},
			weekDayMap:{
				1:'周一',
				2:'周二',
				3:'周三',
				4:'周四',
				5:'周五',
				6:'周六',
				0:'周日'
			}
		}, 
		onLaunch: function() {
			console.log('App Launch')
			// userApi.getWechatConfig().then(resp => {
			// 	this.globalData.appId = resp.data.appid;
			// 	this.globalData.secret = resp.data.secret;
			// })
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
<style lang="scss">
@import "uview-ui/index.scss";
</style>

<style>
	/*每个页面公共css */
</style>

