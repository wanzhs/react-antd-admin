import request from '../common'

export default class RequestCarrier {
    public static post_json = (apiPath: string, params?: { [key: string]: any }) => {
        return request({
            method: 'post',
            url: apiPath,
            data: params
        });
    }
}