import RequestCarrier from "@scripts/common/requestCarrier";
import {IPageQuery} from "@views/order/order";
import {urlFormat} from "@scripts/utils";
import {url} from "@root/src/config/config.constant";

export class StationService {
    public static getChargingStationList = () => {
        return RequestCarrier.post_json('charging/station/list');
    };

    public static getStationList = (query: IPageQuery) => {
        return RequestCarrier.post_json('charging/station/page', query);
    };

    public static getCtrlList = (stationId: any) => {
        return RequestCarrier.post_json('charging/device/ctrl/list', {stationId: stationId});
    };

    public static getDeviceList = (deviceCtrlId: any) => {
        return RequestCarrier.post_json('charging/device/list/children', {deviceCtrlId: deviceCtrlId});
    };

    public static getQrCode = (query: any) => {
        return urlFormat(`${url}/charging/device/sub/generateCode`, query);
    }
}