import React from "react";
import {Table} from "antd";
import {StationService} from "@views/station/station.service";

interface IState {
    dataList: any[];
    query: any;
    tableLoading: boolean;
    currentIndex: number;
    currentRow: any;
}

interface IProp {
    deviceCtrlId: any;
}

class DeviceList extends React.Component<IProp, IState> {
    state: IState = {
        dataList: [],
        query: {},
        tableLoading: false,
        currentIndex: -1,
        currentRow: {},
    };
    columns: any = [
        {
            title: '充电桩名称',
            dataIndex: 'deviceName',
            width: 200,
            ellipsis: true,
        },
        {
            title: '充电桩编码',
            dataIndex: 'deviceCode',
            width: 200,
            ellipsis: true,
        },
        {
            title: '集控器编码',
            dataIndex: 'deviceCtrlCode',
            width: 150,
            ellipsis: true,
        },
        {
            title: '充电方式',
            dataIndex: 'chargingType',
            width: 100,
            ellipsis: true,
        },
        {
            title: '设备功率',
            dataIndex: 'devicePower',
            width: 100,
            ellipsis: true,
        },
        {
            title: '最大电压',
            dataIndex: 'deviceVoltage',
            width: 100,
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'deviceShelf',
            width: 100,
            ellipsis: true,
        },
        {
            title: '辅助电源',
            dataIndex: 'deviceApu',
            width: 100,
            ellipsis: true,
        },
        {
            title: '入库时间',
            dataIndex: 'insertDt',
            width: 150,
            ellipsis: true,
        },
    ];
    columnsSub: any = [
        {
            title: '枪名称',
            dataIndex: 'deviceSubName',
            width: 100,
            ellipsis: true,
        }, {
            title: '枪id',
            dataIndex: 'deviceSubId',
            width: 100,
            ellipsis: true,
        }, {
            title: '枪canIndex',
            dataIndex: 'deviceCanIndex',
            width: 100,
            ellipsis: true,
        }, {
            title: '枪实时状态',
            dataIndex: 'deviceTcpState',
            width: 100,
            ellipsis: true,
            render: (record: any, index: any) => {
                return this.convertCacheRealState(record.deviceTcpState);
            }
        }, {
            title: '上下架',
            dataIndex: 'deviceSubShelf',
            width: 100,
            ellipsis: true,
        },
    ];
    //缓存实时状态
    convertCacheRealState = (state: string) => {
        //桩状态字典表
        const deviceStateDictionary = {
            DEFAULT: '默认',
            STANDBY: '空闲',
            PLUG: '插枪',
            WAITING: '等待中',
            QUEUEING: '排队',
            FINISHED: '已完成',
            FULLED: '已充满',
            CHARGING: '充电中',
            CHANGING: '切换中',
            PAUSE: '暂停',
            RESTRICT: '限制',
            EVPAUSE: '车辆暂停',
            CTRLPAUSE: '集控暂停',
            PLATFORMPAUSE: '平台暂停',
            STARTING: '启动中',
            OFFLINE: '离线',
            SUBLANCE: '副枪',
            DISCHARGING: '放电',
            FAULT: '故障',
        };
        const deviceTcpState = () => ({
            default: deviceStateDictionary['DEFAULT'],
            standby: deviceStateDictionary['STANDBY'],
            plug: deviceStateDictionary['PLUG'],
            waiting: deviceStateDictionary['WAITING'],
            queueing: deviceStateDictionary['QUEUEING'],
            finished: deviceStateDictionary['FINISHED'],
            fulled: deviceStateDictionary['FULLED'],
            charging: deviceStateDictionary['CHARGING'],
            changing: deviceStateDictionary['CHANGING'],
            pause: deviceStateDictionary['PAUSE'],
            restrict: deviceStateDictionary['RESTRICT'],
            evpause: deviceStateDictionary['EVPAUSE'],
            ctrlpause: deviceStateDictionary['CTRLPAUSE'],
            platformpause: deviceStateDictionary['PLATFORMPAUSE'],
            starting: deviceStateDictionary['STARTING'],
            offline: deviceStateDictionary['OFFLINE'],
            sublance: deviceStateDictionary['SUBLANCE'],
            discharging: deviceStateDictionary['DISCHARGING'],
            fault: deviceStateDictionary['FAULT'],
        });
        let rs: string = "";
        if (state === 'STANDBY') {
            rs = deviceTcpState().standby;
        } else if (state === 'FINISHED') {
            rs = deviceTcpState().finished;
        } else if (state === 'WAITING') {
            rs = deviceTcpState().waiting;
        } else if (state === 'QUEUEING') {
            rs = deviceTcpState().queueing;
        } else if (state === 'PLUG') {
            rs = deviceTcpState().plug;
        } else if (state === 'OFFLINE') {
            rs = deviceTcpState().offline;
        } else if (state === 'FULLED') {
            rs = deviceTcpState().fulled;
        } else if (state === 'PAUSE') {
            rs = deviceTcpState().pause;
        } else if (state === 'RESTRICT') {
            rs = deviceTcpState().restrict;
        } else if (state === 'EVPAUSE') {
            rs = deviceTcpState().evpause;
        } else if (state === 'CTRLPAUSE') {
            rs = deviceTcpState().ctrlpause;
        } else if (state === 'PLATFORMPAUSE') {
            rs = deviceTcpState().platformpause;
        } else if (state === 'STARTING') {
            rs = deviceTcpState().starting;
        } else if (state === 'FAULT') {
            rs = deviceTcpState().fault;
        } else if (state === 'SUBLANCE') {
            rs = deviceTcpState().sublance;
        } else if (state === 'DISCHARGING') {
            rs = deviceTcpState().discharging;
        } else if (state === "CHARGING") {
            rs = deviceTcpState().charging;
        } else if (state === "CHANGING") {
            rs = deviceTcpState().changing;
        } else {
            rs = deviceTcpState().default;
        }
        return rs;
    }

    componentDidMount(): void {
        this.loadDbDataToLocal();
    }

    componentDidUpdate(prevProps: Readonly<IProp>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevProps.deviceCtrlId !== this.props.deviceCtrlId) {
            this.loadDbDataToLocal();
        }
    }

    loadDbDataToLocal = () => {
        this.setState({dataList: []});
        if (this.props.deviceCtrlId) {
            this.setState({tableLoading: true});
            StationService.getDeviceList(this.props.deviceCtrlId).then(value => {
                this.setState({dataList: value || []});
            }).finally(() => {
                this.setState({tableLoading: false});
            });
        }
    };

    render() {
        return <div>
            <Table
                scroll={{x: 100, scrollToFirstRowOnChange: true}}
                columns={this.columns}
                loading={this.state.tableLoading}
                expandedRowRender={record => (
                    <Table columns={this.columnsSub}
                           dataSource={record.children}
                           rowKey={(record1: any, index1: any) => index1}
                    />
                )}
                childrenColumnName={'peace'}
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
        </div>
    }
}

export default DeviceList;