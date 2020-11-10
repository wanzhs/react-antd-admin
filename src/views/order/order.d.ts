export interface IPageQuery {
    index: number;
    size: number;
    data: any;
}

export interface IChargingOrderQuery {
    chargingBeginDt?: any,
    chargingEndDt?: any,
    chargingType?: any,
    orderId?: any,
    stationId?: any,
    userName?: any,
    userTel?: any,
    orderStates?: any,
}

export interface IStationDetail {
    stationId?: number;
    shopCode?: string;
    shopId?: number;
    shopName?: string;
    sttpeName?: string;
    districtCode?: number | number[];
    sttpeId?: number;
    deviceNums?: number;
    operatorsId?: number;
    attachStr?: string;
    operatorsName?: string;
    stationCode?: string;
    stationName?: string;
    stationParkPrice?: number;
    stationType?: string;
    stationAddr?: string;
    districtAddress?: string;
    districtList?: number[];
    stationPayType?: string;
    lat?: number;
    lng?: number;
    lngLat?: ILngLat;
    stationOpendt?: string;
    stationClosedt?: string;
    stationPeriod?: string[];
    stationScore?: number;
    stationState?: number;
    stationManagersArr?: IStationManagerDetail[];
    stationManagers?: string;
    stationShelfState?: string;
    parklotGroupId?: string;
    photoAddress?: string | string[];
    insertDt?: string;
    updateDt?: string;
}