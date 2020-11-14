import request from '../common'
import requestFile from "@scripts/common/requestFile";


export default class RequestCarrier {
    public static post_json = (apiPath: string, params?: { [key: string]: any }) => {
        return request({
            method: 'post',
            url: apiPath,
            data: params,
        });
    };

    public static post_json_file_response = (apiPath: string, params?: { [key: string]: any }) => {
        return requestFile({
            method: 'post',
            url: apiPath,
            data: params,
        });
    }
}