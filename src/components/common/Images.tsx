import React from "react";
import {Carousel, Modal} from "antd";

interface IProp {
    imgList: string[];
    width?: number;
}

interface IState {
    visible: boolean;
}

class Images extends React.Component<IProp, IState> {
    state: IState = {
        visible: false,
    };

    render() {
        return (
            <div>
                <img onClick={() => {
                    this.setState({visible: true})
                    return true;
                }}
                     alt="附件图片"
                     style={this.props.width ? {width: `${this.props.width}`} : {width: 50}}
                     src={this.props.imgList[0]}/>

                <Modal title={'图片详情'} width={'40%'}
                       visible={this.state.visible}
                       onCancel={() => this.setState({visible: false})}
                       footer={false}>
                    <Carousel autoplay={true} dots={true}>
                        {this.props.imgList.map(item => {
                            return <img width={'100%'} src={item} key={item}/>;
                        })}
                    </Carousel>
                </Modal>
            </div>
        );

    }
}

export default Images;