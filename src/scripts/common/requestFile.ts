import axios, {AxiosResponse} from 'axios'
import {message} from 'antd'

import {default_fetch_options} from '@scripts/constant'
import {clearLoginInfo, sessionStore} from '@scripts/utils'
import {userCacheAccountKey} from "@root/src/config/config.constant";
import {IUserDetail} from "@root/typings/server";

const {apiRoot, isProd} = window.g_config

/**
 * 公共请求数据
 * @param {IRequestType} opt
 * @returns
 */
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.defaults.withCredentials = false
axios.interceptors.request.use(
    config => {
        const userDetail: IUserDetail = sessionStore.get(userCacheAccountKey);
        if (userDetail) {
            let token: string = "Access-token";
            let digest: string = "Client-digest";
            // config.headers.Authorization = ``
            config.headers[token] = userDetail.userToken;
            config.headers[digest] = userDetail.loginName;
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
);

const captureException = (err, callback: (res) => void) => {
    !isProd && console.error(err)
    const {response, request: req} = (err || {}) as IKeyStringProps
    if (response) {
        const {status} = response
        if (status >= 500) {
            message.error('服务器出错⊙﹏⊙')
        } else if (Object.is(status, 404)) {
            message.error('请求地址不存在⊙﹏⊙')
        } else if (Object.is(status, 401)) {
            return clearLoginInfo()
        }
        return callback(response)
    }
    if (req) {
        const {readyState, status} = req
        if (Object.is(readyState, 4) && Object.is(status, 0)) {
            message.error('请求超时⊙﹏⊙')
        }
        return callback(req)
    }
    if (axios.isCancel(err)) {
        throw err.message
    }
}

const requestFile = (opt: IRequestType) => {
    const options = {
        ...default_fetch_options,
        ...opt,
    }
    const {
        method,
        url,
        data,
        params,
        customApi,
        error
    } = options
    return new Promise<any>((resolve, reject) => {
        axios({
            cancelToken: source.token,
            url: customApi ? url : `${apiRoot}/${url}`,
            method,
            params,
            data,
            responseType: "arraybuffer",
            timeout: 5000
        })
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    resolve(response)
                } else {
                    error && error(response.data)
                    reject(response.data)
                }
            })
            .catch(err => {
                captureException(err, res => {
                    error && error(res)
                    return reject(res)
                })
            })
    })
}

// export const _request = (options: IRequestType) => {
//   return request(options)
//     .then(data => data)
//     .catch(err => {
//       console.error(err);
//     });
// };

export default requestFile
// Object.assign(React.Component.prototype, {
//   _request: request,
//   _source: source,
//   _api: api
// })