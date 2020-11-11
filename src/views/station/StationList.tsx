import React from "react";
import {IPageQuery} from "@views/order/order";
import {Button, Col, Input, Modal, PageHeader, Pagination, Row, Table} from "antd";
import {StationService} from "@views/station/station.service";
import CtrlList from "@views/station/CtrlList";
import {IStationDetail} from "@views/station/station";

interface IState {
    dataList: IStationDetail[];
    query: any;
    visible: boolean;
    tableLoading: boolean;
    pageIndex: number;
    totalElements: number;
    currentIndex: number;
    currentRow: IStationDetail;
}

class StationList extends React.Component<any, IState> {
    state: IState = {
        dataList: [],
        query: {},
        visible: false,
        tableLoading: false,
        pageIndex: 1,
        totalElements: 0,
        currentIndex: -1,
        currentRow: {},
    };
    columns: any = [
        {
            title: '充电站名称',
            dataIndex: 'stationName',
            width: 200,
            ellipsis: true
        }, {
            title: '充电站编码',
            dataIndex: 'stationCode',
            width: 100,
            ellipsis: true
        }, {
            title: '图片',
            dataIndex: 'attachStr',
            width: 100,
            ellipsis: true,
        }, {
            title: '商户名称',
            dataIndex: 'shopName',
            width: 120,
            ellipsis: true
        }, {
            title: '区域地址',
            dataIndex: 'districtAddress',
            width: 150,
            ellipsis: true
        }, {
            title: '详细地址',
            dataIndex: 'stationAddr',
            width: 250,
            ellipsis: true
        }, {
            title: '上下架状态',
            dataIndex: 'stationShelfState',
            width: 100,
            ellipsis: true
        }, {
            title: '充电站类型',
            dataIndex: 'stationType',
            width: 100,
            ellipsis: true
        }, {
            title: '运营类型',
            dataIndex: 'sttpeName',
            width: 100,
            ellipsis: true
        }, {
            title: '经度',
            dataIndex: 'lng',
            width: 100,
            ellipsis: true
        }, {
            title: '维度',
            dataIndex: 'lat',
            width: 100,
            ellipsis: true
        }, {
            title: '桩数量',
            dataIndex: 'deviceNums',
            width: 100,
            ellipsis: true
        }, {
            title: '更新时间',
            dataIndex: 'updateDt',
            width: 150,
            ellipsis: true
        },
    ];

    componentDidMount(): void {
        this.loadDbDataToLocal();
    }

    loadDbDataToLocal = () => {
        const {pageIndex, query} = this.state;
        const rqQuery: IPageQuery = {index: pageIndex, size: 10, data: query};
        this.setState({tableLoading: true});
        StationService.getStationList(rqQuery).then(value => {
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

    render() {
        return <div>
            <PageHeader title={''}>
                <div>
                    <Row gutter={4}>
                        <Col span={4}>
                            <Input value={this.state.query.sysOrderId} placeholder={'请输入场站名称'}
                                   allowClear={true}
                                   onChange={this.handleInputChange.bind(this, 'sysOrderId')}/>
                        </Col>
                        <Col span={4}>
                            <Button type={"primary"} onClick={this.loadDbDataToLocal}>查询</Button>
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
                onRow={(record: any, index: any) => {
                    return {
                        onClick: () => {
                            this.setState({currentIndex: index, currentRow: record});
                        },
                        onDoubleClick: () => {
                            this.setState({currentIndex: index, currentRow: record, visible: true});
                        }
                    }
                }}
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
                    </div>);
                }}
            />
            <Modal title={'集控器列表'}
                   onCancel={() => this.setState({visible: false})}
                   width={'60%'}
                   visible={this.state.visible}
                   footer={false}>
                <CtrlList stationId={this.state.currentRow.stationId}/>
            </Modal>
        </div>
    }
}

export default StationList;