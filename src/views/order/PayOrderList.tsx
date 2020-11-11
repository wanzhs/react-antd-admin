import React from "react";
import {IChargingOrderTotalDetail, IPageQuery, IPayOrderQuery} from "@views/order/order";
import {Button, Col, DatePicker, Divider, Input, PageHeader, Pagination, Row, Select, Table} from "antd";
import {OrderService} from "@views/order/order.service";
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from "moment";
import {IUserDetail} from "@root/typings/server";
import {sessionStore} from "@scripts/utils";
import {url, userCacheAccountKey} from "@root/src/config/config.constant";

const {Option} = Select;

interface IState {
    dataList: any[];
    query: IPayOrderQuery;
    tableLoading: boolean;
    pageIndex: number;
    totalElements: number;
    currentIndex: number;
    totalStats: IChargingOrderTotalDetail;
}

class PayOrderList extends React.Component<any, IState> {
    state: IState = {
        dataList: [],
        query: {},
        tableLoading: false,
        pageIndex: 1,
        totalElements: 0,
        currentIndex: -1,
        totalStats: {},
    };
    columns: any = [
        {
            title: '系统单号',
            dataIndex: 'sysOrderId',
            fixed: 'left',
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
            title: '用户名称',
            dataIndex: 'userNickName',
            width: 150,
            ellipsis: true
        },
        {
            title: '外联单号',
            dataIndex: 'outOrderId',
            width: 150,
            ellipsis: true
        },
        {
            title: '订单来源',
            dataIndex: 'sysOrderFrom',
            width: 100,
            ellipsis: true
        },
        {
            title: '充值金额',
            dataIndex: 'payPrice',
            width: 150,
            ellipsis: true
        },
        {
            title: '退款金额',
            dataIndex: 'refundPrice',
            width: 150,
            ellipsis: true
        },
        {
            title: '退款状态',
            dataIndex: 'refundState',
            width: 100,
            ellipsis: true
        },
        {
            title: '支付状态',
            dataIndex: 'payOrderState',
            width: 100,
            ellipsis: true
        },
        {
            title: '支付类型',
            dataIndex: 'payTypeDesc',
            width: 150,
            ellipsis: true
        },
        {
            title: '支付描述',
            dataIndex: 'payDesc',
            width: 150,
            ellipsis: true
        },
        {
            title: '子订单类型',
            dataIndex: 'subType',
            width: 100,
            ellipsis: true
        },
        {
            title: '更新时间',
            dataIndex: 'updateDt',
            width: 150,
            ellipsis: true
        },
        {
            title: '创建时间',
            dataIndex: 'insertDt',
            width: 150,
            ellipsis: true
        },
    ];

    payTypeList: any = [{label: '微信支付'},
        {label: '支付宝支付'},
        {label: '全民支付'},
        {label: '银联支付'},
        {label: '微信小程序'},
        {label: '线下支付'},
        {label: '农行掌银支付'},
        {label: '农行银联支付'},
        {label: '农行微信支付'},
        {label: '农行支付宝支付'},
        {label: '农行微信小程序支付'}];

    payStateList: any = [{label: '支付失败'}, {label: '待支付'}, {label: '支付成功'}];

    componentDidMount(): void {
        this.loadDbDataToLocal();
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
        const userDetail: IUserDetail = sessionStore.get(userCacheAccountKey);
        if (userDetail) {
            rsQuery.shopLogin = userDetail.loginName;
            rsQuery.shopToken = userDetail.userToken;
            let urlParams: string = this.joinParams(rsQuery);
            window.open(url + '/charging/order/charging/excel?' + urlParams);
        }
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
        let query: IPayOrderQuery = Object.assign({}, this.state.query);
        if (query.startDt) {
            query.startDt = moment(query.startDt).format('YYYY-MM-DD HH:mm:ss')
        }
        if (query.endDt) {
            query.endDt = moment(query.endDt).format('YYYY-MM-DD HH:mm:ss')
        }
        const rqQuery: IPageQuery = {index: pageIndex, size: 10, data: query};
        this.setState({tableLoading: true});
        OrderService.getPayOrderList(rqQuery).then(value => {
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
                            <Input value={this.state.query.sysOrderId} placeholder={'请输入订单号'}
                                   onChange={this.handleInputChange.bind(this, 'sysOrderId')}/>
                        </Col>
                        <Col span={4}>
                            <Input value={this.state.query.outOrderId} placeholder={'请输入外联单号'}
                                   onChange={this.handleInputChange.bind(this, 'outOrderId')}/>

                        </Col>
                        <Col span={4}>
                            <Input value={this.state.query.userTel} placeholder={'请输入用户电话'}
                                   onChange={this.handleInputChange.bind(this, 'userTel')}/>

                        </Col>
                        <Col span={4}>
                            <Select value={this.state.query.payTypeDesc}
                                    onChange={this.handleInputChange.bind(this, 'payTypeDesc')} style={{width: '100%'}}
                                    placeholder={'支付类型'}>
                                {
                                    this.payTypeList.map(item => {
                                        return <Option value={item.label}>{item.label}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Select value={this.state.query.payOrderState}
                                    onChange={this.handleInputChange.bind(this, 'payOrderState')}
                                    style={{width: '100%'}}
                                    placeholder={'支付状态'}>
                                {
                                    this.payStateList.map(item => {
                                        return <Option value={item.label}>{item.label}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <br/>
                    <Row gutter={4}>
                        <Col span={4}>
                            <DatePicker locale={locale}
                                        value={this.state.query.startDt}
                                        onChange={this.handleDateChange.bind(this, 'startDt')}
                                        placeholder={'开始时间'} style={{width: '100%'}}
                                        showTime={true}></DatePicker>
                        </Col>
                        <Col span={4}>
                            <DatePicker locale={locale}
                                        value={this.state.query.endDt}
                                        onChange={this.handleDateChange.bind(this, 'endDt')}
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

export default PayOrderList;