import React from 'react'
import { hashHistory } from 'react-router'
import { Table, Button, Icon, Modal, Form, Input, Radio, Select, Popconfirm, Pagination, DatePicker  } from 'antd'
import { user } from 'config'


class Trade extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            total: 0,
            buyData: [],
            sellData: [],
            date: moment(),
            code: "sh603031",
            start: 0,
            end: 100,
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.getList();
    }

    componentWillReceiveProps(nextProps){
    }

    shouldComponentUpdate(){
        return true;
    }

    componentWillUpdate(nextProps, nextState){
    }

    componentDidUpdate(prevProps, prevState){
        let nowState = this.state;
        if(nowState.start != prevState.start 
            || nowState.end != prevState.end ){
            console.log(nowState)
            this.getList()
        }
    }

    componentWillUnmount(){
    }

    getList(){
        $.ajax({
            url: "/v1/transaction",
            type: "GET",
            data: {
                code: this.state.code,
                date: this.state.date.format("YYYYMMDD"),
                start: this.state.start,
                end: this.state.end
            }, 
            dataType: "json",
            success: function(data){
                if(data.ret == 0){
                    this.setState({
                        total: data.total,
                        buyData: data.buyData,
                        sellData: data.sellData,
                    });
                }else{
                    user.showRequestError(data)
                }
            }.bind(this),
        })
    }

    renderTradeItem(index){
        let baseStyle = {width: "16%"}

        let lastbuyItem = this.state.buyData[index-1]
        let nowbuyItem = this.state.buyData[index]
        let lastsellItem = this.state.sellData[index-1]
        let nowsellItem = this.state.sellData[index]

        let tsStyle = Object.assign({}, baseStyle, {borderTop: "1px solid"})
        let priceStyle = Object.assign({}, baseStyle, {borderTop: "1px solid"})
        let buyVolumeStyle = Object.assign({}, baseStyle, {borderTop: "1px solid"})
        let sellVolumeStyle = Object.assign({}, baseStyle, {borderTop: "1px solid"})
        let iotypeStyle = Object.assign({}, baseStyle, {borderTop: "1px solid"})
        let siotypeStyle = Object.assign({}, baseStyle, {borderTop: "1px solid"})

        let startTs = nowbuyItem.startTs
        let startPrice = nowbuyItem.startPrice.toFixed(2)
        let buyVolume = nowbuyItem.volume/100
        let sellVolume = nowsellItem.volume/100
        let iotype = ""
        if(nowbuyItem.iotype == 0){
            iotype = "卖"
        } else if(nowbuyItem.iotype == 1){
            iotype = "中"
        } else{
            iotype = "买"
        }
        let siotype = ""
        if(nowsellItem.iotype == 0){
            siotype = "卖"
        } else if(nowsellItem.iotype == 1){
            siotype = "中"
        } else{
            siotype = "买"
        }

        if(index != 0){
            if(lastbuyItem.startTs == nowbuyItem.startTs){
                tsStyle = Object.assign({}, baseStyle)
                startTs = ""
            }

            if(lastbuyItem.id == nowbuyItem.id){
                buyVolumeStyle = Object.assign({}, baseStyle)
                buyVolume = ""
            }

            if(lastsellItem.id == nowsellItem.id){
                sellVolumeStyle = Object.assign({}, baseStyle)
                sellVolume = ""
            }

            if(lastbuyItem.iotype == nowbuyItem.iotype){
                iotypeStyle = Object.assign({}, baseStyle)
                iotype = ""
            }
            if(lastsellItem.iotype == nowsellItem.iotype){
                siotypeStyle = Object.assign({}, baseStyle)
                siotype = ""
            }

        }
        return (
            <div style={{
                    display: "flex",
                    display: "-webkit-flex",
                    flexDirection: "row",
                    marginRight: "20px",
                    width: "350px"
                }} key={index}>
                <div style={tsStyle}>{startTs}</div>
                <div style={priceStyle}>{startPrice}</div>
                <div style={buyVolumeStyle}>{buyVolume}</div>
                <div style={iotypeStyle}>{iotype}</div>
                <div style={sellVolumeStyle}>{sellVolume}</div>
                <div style={siotypeStyle}>{siotype}</div>
            </div>
        );
    }

    render(){
        return (
            <div>
                <div className="am-g">
                    <div className="am-u-sm-12 am-margin-top">
                        <div className="am-g am-g-collapse">
                            <div className="am-u-sm-6"> 
                                <h2>股票 / 交易</h2>
                            </div>
                        </div>
                    </div>
                    <div className="am-u-sm-12 am-margin-vertical">
                        <div className="am-g am-g-collapse">
                            <div className="am-u-sm-6"> 
                            </div>
                            <div className="am-u-sm-3"> 
                            </div>
                        </div>
                    </div>
                    <div className="am-u-sm-3">
                        <div className="content-bg">
                            <div>
                                <DatePicker 
                                    format={'YYYYMMDD'} 
                                    value={this.state.date}
                                    onChange={(date) => {
                                        this.setState({
                                            date: date
                                        })
                                    }}
                                />
                                <Input.Search value={this.state.code} 
                                    style={{ width: "200px" }} 
                                    onChange={(value) => {
                                        this.setState({code: value.target.value})
                                    }}
                                    onSearch={value => this.getList()} />
                            </div>
                        </div>
                    </div>
                    <div className="am-u-sm-9">
                        <div className="content-bg">
                            <div  style={{
                                    display: "flex",
                                    display: "-webkit-flex",
                                    flexFlow: "column wrap",
                                    height: "700px",
                                    overflow: "auto",
                                    marginBottom: "30px"
                                }}>
                                {this.state.buyData.map((item, index) => {
                                    return this.renderTradeItem(index)
                                })}
                            </div>
                            <div>
                                <Pagination 
                                    current={this.state.start/100 + 1}
                                    defaultCurrent={1}
                                    onChange={(p, pageSize)=>{
                                        let start = (p - 1) * pageSize;
                                        let end = start + pageSize;
                                        this.setState({
                                            start: start,
                                            end: end
                                        })
                                    }} 
                                    total={this.state.total} 
                                    showTotal={(total) => {return `Total ${total} items`;}}
                                    defaultPageSize={100}
                                    showQuickJumper />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

Trade.defaultProps = {
}

module.exports = Trade