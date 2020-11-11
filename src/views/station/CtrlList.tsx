import React from "react";
import {Modal, Table} from "antd";
import {StationService} from "@views/station/station.service";
import DeviceList from "@views/station/DeviceList";

interface IState {
    dataList: any[];
    query: any;
    visible: boolean;
    tableLoading: boolean;
    currentIndex: number;
    currentRow: any;
}

interface IProp {
    stationId: any;
}

class CtrlList extends React.Component<IProp, IState> {
    state: IState = {
        dataList: [],
        query: {},
        visible: false,
        tableLoading: false,
        currentIndex: -1,
        currentRow: {},
    };
    columns: any = [
        {
            title: '集控器ID',
            dataIndex: 'deviceCtrlId',
            width: 80,
            ellipsis: true,
        },
        {
            title: '运营商名称',
            dataIndex: 'operatorsName',
            width: 100,
            ellipsis: true,
        },
        {
            title: '集控器名称',
            dataIndex: 'deviceCtrlName',
            width: 200,
            ellipsis: true,
        },
        {
            title: '集控器编码',
            dataIndex: 'deviceCtrlCode',
            width: 100,
            ellipsis: true,
        },
        {
            title: '时间',
            dataIndex: 'insertTime',
            width: 150,
            ellipsis: true,
        },
    ];

    componentDidMount(): void {
        this.loadDbDataToLocal();
    }

    componentDidUpdate(prevProps: Readonly<IProp>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevProps.stationId !== this.props.stationId) {
            this.loadDbDataToLocal();
        }
    }

    loadDbDataToLocal = () => {
        this.setState({dataList: []});
        if (this.props.stationId) {
            this.setState({tableLoading: true});
            StationService.getCtrlList(this.props.stationId).then(value => {
                this.setState({dataList: value || []});
            }).finally(() => {
                this.setState({tableLoading: false});
            });
        }
    };

    render() {
        return <div>
            <Table
                scroll={{x: 10, scrollToFirstRowOnChange: true}}
                columns={this.columns}
                size='small'
                loading={this.state.tableLoading}
                style={{paddingTop: 8}}
                dataSource={this.state.dataList}
                rowKey={(record: any, index: any) => {
                    return index;
                }}
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
            />
            <Modal title={'充电桩列表'}
                   onCancel={() => this.setState({visible: false})}
                   width={'60%'}
                   visible={this.state.visible}
                   footer={false}>
                <DeviceList deviceCtrlId={this.state.currentRow.deviceCtrlId}/>
            </Modal>
        </div>
    }
}

export default CtrlList;