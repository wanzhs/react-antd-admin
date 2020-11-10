import React from "react";
import {IChargingOrderQuery, IPageQuery, IStationDetail} from "@views/order/order";
import {Button, Col, DatePicker, Input, PageHeader, Pagination, Row, Select, Table} from "antd";
import {OrderService} from "@views/order/order.service";

const {Option} = Select;

interface IState {
    dataList: any[];
    stationList: IStationDetail[];
    visible: boolean;
    query: IChargingOrderQuery;
    tableLoading: boolean;
    pageIndex: number;
    totalElements: number;
    currentIndex: number;
}

class ConsumeOrderList extends React.Component<any, IState> {
    state: IState = {
        dataList: [],
        stationList: [],
        visible: false,
        query: {},
        tableLoading: false,
        pageIndex: 1,
        totalElements: 0,
        currentIndex: -1,
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

    componentDidMount(): void {
        this.loadDbDataToLocal();
        this.loadStationListToLocal();
    }

    loadStationListToLocal() {
        OrderService.getChargingStationList().then(value => {
            this.setState({stationList: value});
        });
    }

    loadDbDataToLocal = () => {
        const {pageIndex, query} = this.state;
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
        const rsQuery = Object.assign({}, {...this.state.query}, {[key]: e.target.value});
        this.setState({query: rsQuery});
    };

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
                            <Input value={this.state.query.orderId} placeholder={'请输入vin码'}
                                   onChange={this.handleInputChange.bind(this, 'carVin')}/>

                        </Col>
                        <Col span={4}>
                            <Input value={this.state.query.orderId} placeholder={'请输入车牌号'}
                                   onChange={this.handleInputChange.bind(this, 'carNo')}/>

                        </Col>
                        <Col span={4}>
                            <Input value={this.state.query.orderId} placeholder={'请输入用户姓名'}
                                   onChange={this.handleInputChange.bind(this, 'userName')}/>

                        </Col>
                        <Col span={4}>
                            <Input value={this.state.query.orderId} placeholder={'请输入用户电话'}
                                   onChange={this.handleInputChange.bind(this, 'userTel')}/>
                        </Col>
                    </Row>
                    <Row gutter={4} style={{width: '100%', background: '#FFF'}}>
                        <Col span={4}>
                            <Select style={{width: '100%'}} placeholder={'充电方式'}>
                                <Option value={'APP充电'}>APP充电</Option>
                                <Option value={'刷卡充电'}>刷卡充电</Option>
                                <Option value={'Vin码充电'}>Vin码充电</Option>
                                <Option value={'车牌充电x'}>车牌充电</Option>
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Select style={{width: '100%'}} placeholder={'充电场站'}>
                                {
                                    this.state.stationList.map(item => {
                                        return <Option value={item.stationId}>{item.stationName}</Option>;
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={4}>
                            <DatePicker showTime={true}></DatePicker>
                        </Col>
                        <Col span={4}>
                            <Button onClick={this.loadDbDataToLocal}>查询</Button>
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
                    return <Pagination
                        onChange={this.handlePageIndexChange}
                        showQuickJumper
                        total={this.state.totalElements}
                        pageSize={10}
                        showTotal={total => `共有${total}条记录`}
                        showSizeChanger={false}
                    />;
                }}
            />
        </div>
    }
}

export default ConsumeOrderList;