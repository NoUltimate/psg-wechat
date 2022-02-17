import { getToken } from "@/utils/auth.js"
// 单独配置url地址，便于以后维护
const BASE_URL = 'https://noultimate.com:7010/psg/api/wechat'
// 暴露一个方法，用uni.request发送请求，异步处理的封装最好用promise
export const request = (options)=>{
	// resolve（成功之后的回调函数）和reject（失败之后的回调函数）
	// console.log("getToken", getToken())
	return new Promise((resolve,reject)=>{
		// 使用uni.request发送请求
		uni.request({
			// 拼接请求地址
			url:BASE_URL+options.url,
			// 请求方式
			method: options.method || 'GET',
			header: {
			    "token": getApp().globalData.token
			},
			// 数据
			data: options.data || {},
			// 请求成功
			success: (res) => {
				// 判断请求数据是否成功

				var code = res.data.code
				var msg = res.data.msg
				if(!(code == 100000 || code == 400001 || code == 400002)) {
					return uni.showToast({
						title: msg || '接口异常',
						icon:'none'
					})
				}
				resolve(res.data)
			},
			// 请求失败
			fail: (err) => {
				uni.showToast({
					title: '后台服务器异常!',
					icon:'none'
				})
				reject(err)
			}
		})
	})
}
