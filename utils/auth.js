export function getToken() {
	try {
	    const value = uni.getStorageSync('token');
		return value
	} catch (e) {
	    console.log(e)
	}
}

export function setToken(token) {
	try {
	    uni.setStorageSync('token', token);
	} catch (e) {
	    console.log(e)
	}
}

export function getOpenid() {
	try {
	    const value = uni.getStorageSync('openid');
		return value
	} catch (e) {
	    console.log(e)
	}
}

export function setOpenid(openid) {
	try {
	    uni.setStorageSync('openid', openid);
	} catch (e) {
	    console.log(e)
	}
}