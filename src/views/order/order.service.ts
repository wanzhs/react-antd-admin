import {IChargingOrderQuery, IPageQuery} from "@views/order/order";
import RequestCarrier from "@scripts/common/requestCarrier";

export class OrderService {
    public static getChargingOrderList = (query: IPageQuery) => {
        return RequestCarrier.post_json('charging/order/get/page', query);
    };

    public static getChargingOrderStats = (query: IChargingOrderQuery) => {
        return RequestCarrier.post_json('charging/order/total', query);
    };

    public static getPayOrderList = (query: IPageQuery) => {
        return RequestCarrier.post_json('charging/money/get/page', query);
    };

    public static downloadConsumeOrder = (query: any) => {
        return RequestCarrier.post_json_file_response('charging/order/charging/excel', query);
    }
}