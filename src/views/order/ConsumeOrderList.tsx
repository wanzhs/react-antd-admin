import React from "react";
import {IChargingOrderQuery, IChargingOrderTotalDetail, IPageQuery} from "@views/order/order";
import {Button, Col, DatePicker, Divider, Input, PageHeader, Pagination, Row, Select, Table} from "antd";
import {OrderService} from "@views/order/order.service";
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from "moment";
import {IStationDetail} from "@views/station/station";
import {StationService} from "@views/station/station.service";
import {AxiosResponse} from "@node_modules/axios";

const {Option} = Select;

interface IState {
    dataList: any[];
    stationList: IStationDetail[];
    query: IChargingOrderQuery;
    tableLoading: boolean;
    pageIndex: number;
    totalElements: number;
    currentIndex: number;
    totalStats: IChargingOrderTotalDetail;
}

class ConsumeOrderList extends React.Component<any, IState> {
    state: IState = {
        dataList: [],
        stationList: [],
        query: {},
        tableLoading: false,
        pageIndex: 1,
        totalElements: 0,
        currentIndex: -1,
        totalStats: {},
    };
    columns: any = [
        {
            title: '订单号',
            dataIndex: 'orderId',
            width: 150,
            ellipsis: true
        },
        {
            title: '站点名称',
            dataIndex: 'stationName',
            width: 200,
            ellipsis: true
        },
        {
            title: '充电桩名称',
            dataIndex: 'deviceName',
            width: 150,
            ellipsis: true
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            width: 150,
            ellipsis: true
        },
        {
            title: '用户电话',
            dataIndex: 'userTel',
            width: 150,
            ellipsis: true
        },
        {
            title: '总费用',
            dataIndex: 'totalFare',
            width: 100,
            ellipsis: true
        },
        {
            title: '总电量（度）',
            dataIndex: 'totalEnergy',
            width: 150,
            ellipsis: true
        },
        {
            title: '充电时长（分钟）',
            dataIndex: 'chargingAllTime',
            width: 150,
            ellipsis: true,
            render: (value: any, record: any, index: any) => {
                if (record.chargingEndDt !== null && record.chargingBeginDt !== null && ((new Date(record.chargingBeginDt).getTime()) < (new Date(record.chargingEndDt).getTime()))) {
                    return ((new Date(record.chargingEndDt).getTime() - new Date(record.chargingBeginDt).getTime()) / 1000 / 60).toFixed(2);
                }
                return value;
            }
        },
        {
            title: '充电时间',
            dataIndex: 'chargingBeginDt',
            width: 200,
            ellipsis: true
        },
        {
            title: '结束时间',
            dataIndex: 'chargingEndDt',
            width: 200,
            ellipsis: true
        },
        {
            title: '充电方式',
            dataIndex: 'chargingType',
            width: 150,
            ellipsis: true
        },
        {
            title: '订单状态',
            dataIndex: 'orderStateDesc',
            width: 100,
            ellipsis: true
        },
        {
            title: '车牌号',
            dataIndex: 'carNo',
            width: 150,
            ellipsis: true
        },
        {
            title: '车辆vin码',
            dataIndex: 'carVin',
            width: 150,
            ellipsis: true
        },
        {
            title: '扣款时间',
            dataIndex: 'deductDt',
            width: 200,
            ellipsis: true
        },
        {
            title: '创建时间',
            dataIndex: 'insertDt',
            width: 150,
            ellipsis: true
        },
    ];

    orderStateMapper: any = [
        {text: '订单完成', value: 'FINISH'},
        {text: '异常完成', value: 'EXFINISH'},
        {text: '结算中', value: 'BALANCING'},
        {text: '结算完成', value: 'BALANCED'},
        {text: '结算驳回', value: 'BALANCED_REJECT'},
        {text: '下单未支付', value: 'INIT'},
        {text: '已支付，待使用', value: 'PAYED'},
        {text: '订单初始化失败', value: 'INIT_FAIL'},
        {text: '其他异常', value: 'OTHER'},
        {text: '支付失败', value: 'PAY_FAIL'},
        {text: '订单超时', value: 'TIME_OUT'},
        {text: '退款', value: 'REFUNDING'},
        {text: '删除', value: 'REMOVE'},
        {text: '离线，未完成', value: 'OFFLINE'}];

    componentDidMount(): void {
        this.loadDbDataToLocal();
        this.loadStationListToLocal();
        this.loadDBStatsToLocal();
    }

    loadStationListToLocal() {
        StationService.getChargingStationList().then(value => {
            this.setState({stationList: value});
        });
    }

    //导出
    handleExport = () => {
        let rsQuery: any = Object.assign({}, this.state.query);
        if (rsQuery.chargingBeginDt) {
            rsQuery.chargingBeginDt = moment(rsQuery.chargingBeginDt).format('YYYY-MM-DD HH:mm:ss')
        }
        if (rsQuery.chargingEndDt) {
            rsQuery.chargingEndDt = moment(rsQuery.chargingEndDt).format('YYYY-MM-DD HH:mm:ss')
        }
        OrderService.downloadConsumeOrder(rsQuery).then((value: AxiosResponse) => {
            let fileName: string = "充电订单.xlsx";
            console.log(value.headers)
            let blob = new Blob([value.data], {type: 'application/octet-stream'});
            let blobUrl = URL.createObjectURL(blob);
            let eLink = document.createElement("a");
            eLink.download = fileName;
            eLink.href = blobUrl;
            eLink.click();
            eLink.remove();
            URL.revokeObjectURL(blobUrl);
        })
    }

    joinParams(param: object) {
        let url: string = '';
        if (param) {
            let first: boolean = true;
            for (const key in param) {
                if (param.hasOwnProperty(key)) {
                    // @ts-ignore
                    const val = param[key];
                    if (val != undefined && val != null) {
                        console.log(val)
                        if (first) {
                            url = key + "=" + val;
                            first = false;
                        } else {
                            url += "&" + key + "=" + val;
                        }
                    }
                }
            }
        }
        return url;
    }


    loadDbDataToLocal = () => {
        const {pageIndex} = this.state;
        let query: IChargingOrderQuery = Object.assign({}, this.state.query);
        if (query.chargingBeginDt) {
            query.chargingBeginDt = moment(query.chargingBeginDt).format('YYYY-MM-DD HH:mm:ss')
        }
        if (query.chargingEndDt) {
            query.chargingEndDt = moment(query.chargingEndDt).format('YYYY-MM-DD HH:mm:ss')
        }
        const rqQuery: IPageQuery = {index: pageIndex, size: 10, data: query};
        this.setState({tableLoading: true});
        OrderService.getChargingOrderList(rqQuery).then(value => {
            this.setState({dataList: value.records || [], totalElements: value.total || 0});
        }).finally(() => {
            this.setState({tableLoading: false});
        });
    };

    handlePageIndexChange = (index: number) => {
        this.setState({pageIndex: index});
        this.loadDbDataToLocal();
    };

    handleInputChange = (key: string, e: any) => {
        const rsQuery = Object.assign({}, {...this.state.query}, {[key]: e && e.target ? e.target.value : e});
        this.setState({query: rsQuery});
    };

    loadDBStatsToLocal() {
        let query: IChargingOrderQuery = Object.assign({}, this.state.query);
        if (query.chargingBeginDt) {
            query.chargingBeginDt = moment(query.chargingBeginDt).format('YYYY-MM-DD HH:mm:ss')
        }
        if (query.chargingEndDt) {
            query.chargingEndDt = moment(query.chargingEndDt).format('YYYY-MM-DD HH:mm:ss')
        }
        OrderService.getChargingOrderStats(query).then(value => {
            this.setState({totalStats: value});
        })
    }

    handleDateChange = (key: string, dateObj: any, dateStr: any) => {
        const rsQuery = Object.assign({}, {...this.state.query}, {[key]: dateObj});
        this.setState({query: rsQuery});
    }

    render() {
        return <div>
            <PageHeader title={''}>
                <div>
                    <Row gutter={4}>
                        <Col span={4}>
                            <Input value={this.state.query.orderId} placeholder={'请输入订单号'}
                                   onChange={this.handleInputChange.bind(this, 'orderId')}/>
                        </Col>
                        <Col span={4}>
                            <Input value={this.state.query.vinCode} placeholder={'请输入vin码'}
                                   onChange={this.handleInputChange.bind(this, 'vinCode')}/>

                        </Col>
                        <Col span={4}>
                            <Input value={this.state.query.carNo} placeholder={'请输入车牌号'}
                                   onChange={this.handleInputChange.bind(this, 'carNo')}/>

                        </Col>
                        <Col span={4}>
                            <Input value={this.state.query.userName} placeholder={'请输入用户姓名'}
                                   onChange={this.handleInputChange.bind(this, 'userName')}/>

                        </Col>
                        <Col span={4}>
                            <Input value={this.state.query.userTel} placeholder={'请输入用户电话'}
                                   onChange={this.handleInputChange.bind(this, 'userTel')}/>
                        </Col>
                    </Row>
                    <br/>
                    <Row gutter={4}>
                        <Col span={4}>
                            <Select value={this.state.query.chargingType}
                                    onChange={this.handleInputChange.bind(this, 'chargingType')} style={{width: '100%'}}
                                    placeholder={'充电方式'}>
                                <Option value={'APP充电'}>APP充电</Option>
                                <Option value={'刷卡充电'}>刷卡充电</Option>
                                <Option value={'Vin码充电'}>Vin码充电</Option>
                                <Option value={'车牌充电x'}>车牌充电</Option>
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Select onChange={this.handleInputChange.bind(this, 'stationId')} style={{width: '100%'}}
                                    placeholder={'充电场站'}>
                                {
                                    this.state.stationList.map(item => {
                                        return <Option value={item.stationId}>{item.stationName}</Option>;
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Select onChange={this.handleInputChange.bind(this, 'orderStates')}
                                    mode={"multiple"}
                                    style={{width: '100%'}}
                                    placeholder={'订单状态'}>
                                {
                                    this.orderStateMapper.map(item => {
                                        return <Option value={item.value}>{item.text}</Option>;
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={4}>
                            <DatePicker locale={locale}
                                        value={this.state.query.chargingBeginDt}
                                        onChange={this.handleDateChange.bind(this, 'chargingBeginDt')}
                                        placeholder={'开始时间'} style={{width: '100%'}}
                                        showTime={true}></DatePicker>
                        </Col>
                        <Col span={4}>
                            <DatePicker locale={locale}
                                        value={this.state.query.chargingEndDt}
                                        onChange={this.handleDateChange.bind(this, 'chargingEndDt')}
                                        placeholder={'截止时间'} style={{width: '100%'}}
                                        showTime={true}></DatePicker>
                        </Col>
                        <Col span={4}>
                            <Button onClick={this.loadDbDataToLocal}>查询</Button>
                            <Divider type={"vertical"}/>
                            <Button onClick={this.handleExport}>导出</Button>
                        </Col>
                    </Row>
                </div>
            </PageHeader>
            <Table
                scroll={{x: 1800, scrollToFirstRowOnChange: true}}
                columns={this.columns}
                size='small'
                loading={this.state.tableLoading}
                style={{paddingTop: 8}}
                dataSource={this.state.dataList}
                rowKey={(record: any, index: any) => index}
                rowClassName={(record: any, index: any) => {
                    if (this.state.currentIndex === index) {
                        return 'current-row';
                    }
                    return '';
                }}
                pagination={false}
                footer={(data: any) => {
                    return (<div>
                        <Pagination
                            style={{float: 'right'}}
                            onChange={this.handlePageIndexChange}
                            showQuickJumper
                            total={this.state.totalElements}
                            pageSize={10}
                            showTotal={total => `共有${total}条记录`}
                            showSizeChanger={false}
                        />
                        <div style={{float: 'left'}}>
                            <span>合计</span>
                            <Divider type={"vertical"}/>
                            <span>总费用：</span>
                            <span style={{color: "#00a2d4"}}>{this.state.totalStats.totalFare || 0}</span>
                            <span>元</span>
                            <Divider type={"vertical"}/>
                            <span>总电量：</span>
                            <span style={{color: "#00a2d4"}}>{this.state.totalStats.totalEnergy || 0}</span>
                            <span>度</span>
                            <Divider type={"vertical"}/>
                            <span>总用时：</span>
                            <span style={{color: "#00a2d4"}}>{this.state.totalStats.chargingAllTime || 0}</span>
                            <span>分钟</span>
                            <Divider type={"vertical"}/>
                            <span>vin车次：</span>
                            <span style={{color: "#00a2d4"}}>{this.state.totalStats.carCount || 0}</span>
                            <span>次</span>
                        </div>
                    </div>);
                }}
            />
        </div>
    }
}

export default ConsumeOrderList;