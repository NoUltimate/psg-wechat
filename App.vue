<script>
	export default {
		globalData: {
			openid : '',
			id: '',
			role: undefined,
			appId: 'wx24c08dfddba680a1',
			secret: '1f5ad42ad61c05a959b23e659a289621',
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

