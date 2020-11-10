import request from '../common'
import api from '../common/api'
import {userCacheAccountKey} from "@root/src/config/config.constant";
import {sessionStore} from "@scripts/utils";

const {
    loginAccount,
    registerAccount,
    getGeoWorld
} = api

//验证用户登陆
export const verifyUserLogin = () => {
    // const userStr = getStorage(userCacheAccountKey);
    const userStr = sessionStore.get(userCacheAccountKey);
    if (userStr) {
        console.log("login success")
        return userStr;
    } else {
        console.log("no user infos")
        throw new Error('用户没有登录信息');
    }
    // return request({
    //     url: verifyIsLogin,
    //     showTips: false
    // })
}

//用户登陆
export const goLoginAccount = (data: object) => {
    return request({
        method: 'post',
        url: loginAccount,
        data
    })
}

//用户注册
export const goRegisterAccount = (data: object) => {
    return request({
        method: 'post',
        url: registerAccount,
        data
    })
}

//获取地图画布
export const fetchGeoWorld = () => {
    return request({
        url: getGeoWorld
    })
}
