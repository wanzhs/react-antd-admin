export interface IPageQuery {
    index: number;
    size: number;
    data: any;
}

export interface IChargingOrderQuery {
    carNo?: string,
    chargingBeginDt?: any,
    chargingEndDt?: any,
    chargingType?: any,
    orderId?: any,
    stationId?: any,
    userName?: any,
    userTel?: any,
    vinCode?: any,
    orderStates?: any[]
}


/**
 * 充电订单累计信息
 * */
export interface IChargingOrderTotalDetail {
    totalFare?: number;
    totalEnergy?: number;
    carCount?: number;
    chargingAllTime?: number;
}


export interface IPayOrderQuery {
    endDt?: any;
    startDt?: any;
    outOrderId?: any;
    payOrderState?: any;
    payTypeDesc?: any;
    sysOrderFrom?: any;
    sysOrderId?: any;
    userTel?: any;
}