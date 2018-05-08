import React from 'react'
import { hashHistory } from 'react-router'
import { Table, Button, Icon, Modal, Form, Input, Radio, Select, Popconfirm, Pagination, DatePicker,InputNumber } from 'antd'
import { user } from 'config'


class Strategy extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            date: moment(),
            strategyList: [],
            strategyID: -1,
            paramList: [],
            paramID: -1,
            codeList: [],
            codeSum: [],
            days: 7,
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.getStrategyList();
    }

    componentWillReceiveProps(nextProps){
    }

    componentWillUpdate(nextProps, nextState){
    }

    componentWillUnmount(){
    }

    getStrategyList(){
        $.ajax({
            url: "/api/dh/strategy/strategy",
            type: "GET",
            dataType: "json",
            success: function(data){
                if(data.ret == 0){
                    if(data.data.list.length == 0){
                        this.setState({
                            strategyList: data.data.list,
                            paramList: [],
                            paramID: -1,
                            codeList: [],
                            codeSum: [],
                        });
                        return
                    }
                    if(this.state.strategyID == -1){
                        this.setState({
                            strategyList: data.data.list,
                            strategyID: data.data.list[0].id
                        }, this.getParamList);
                    }else{
                        this.setState({
                            strategyList: data.data.list,
                        }, this.getParamList);
                    }
                }else{
                    user.showRequestError(data)
                }
            }.bind(this),
        })
    }

    getParamList(){
        $.ajax({
            url: "/api/dh/strategy/param",
            type: "GET",
            data: {
                strategy_id: this.state.strategyID
            },
            dataType: "json",
            success: function(data){
                if(data.ret == 0){
                    if(data.data.list.length == 0){
                        this.setState({
                            paramList: data.data.list,
                            codeList: [],
                            codeSum: [],
                        });
                        return
                    }
                    if(this.state.paramID == -1){
                        this.setState({
                            paramList: data.data.list,
                            paramID: data.data.list[0].id,
                        }, this.getCodeList);
                    }else{
                        this.setState({
                            paramList: data.data.list,
                        }, this.getCodeList);
                    }
                }else{
                    user.showRequestError(data)
                }
            }.bind(this),
        })
    }

    getCodeList(){
        $.ajax({
            url: "/api/dh/strategy/code",
            type: "GET",
            data: {
                strategy_id: this.state.strategyID,
                param_id: this.state.paramID,
                date: this.state.date.format("YYYY-MM-DD"),
                price_days: this.state.days
            },
            dataType: "json",
            success: function(data){
                if(data.ret == 0){
                    this.setState({
                        codeList: data.data.list,
                        codeSum: data.data.sum,
                    });
                }else{
                    user.showRequestError(data)
                }
            }.bind(this),
        })
    }

    renderRateColor(r){
        if(r == 0){
            return {}
        }else if(r > 0){
            return {
                color: "red"
            }
        }else{
            return {
                color: "green"
            }
        }
    }

    render(){
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        let head = [<th key="股票">股票</th>]
        if(this.state.codeList.length >= 1){
            this.state.codeList[0].price_list.map((item, index)=>{
                head.push(<th key={index}>{moment(item.timestamp).format('YYYY-MM-DD')}</th>)
            })
        }
        return (
            <div>
                <div className="am-g">
                    <div className="am-u-sm-12 am-margin-top">
                        <div className="am-g am-g-collapse">
                            <div className="am-u-sm-6"> 
                                <h2>股票 / 策略</h2>
                            </div>
                        </div>
                    </div>
                    <div className="am-u-sm-12 am-margin-vertical">
                        <div className="content-bg">
                            <div>
                                <DatePicker 
                                    format={'YYYY-MM-DD'} 
                                    value={this.state.date}
                                    onChange={(date) => {
                                        this.setState({
                                            date: date
                                        },this.getCodeList)
                                    }}
                                />
                                <InputNumber style={{width: "100px", marginLeft: "10px"}}
                                value={this.state.days} onChange={(value)=>{
                                    this.setState({
                                        days: value
                                    },this.getCodeList)
                                }} />
                            </div>
                        </div>
                    </div>

                    <div className="content-bg" style={{
                        position: "absolute",
                        left: "18px",
                        right: "18px",
                        top: "130px",
                        bottom: "18px",
                    }}>
                        <div  style={{
                                display: "flex",
                                display: "-webkit-flex",
                                height: "100%",
                                border: "1px solid rgba(0,0,0,.1)",
                            }}>
                            <div style={{
                                width: "150px",
                                borderRight: "1px solid rgba(0,0,0,.1)",
                                overflow: "auto",
                            }}>
                                {
                                    this.state.strategyList.map((item, index)=>{
                                        return(
                                            <div 
                                                style={{
                                                    padding: "5px", 
                                                    borderBottom: "1px solid rgba(0,0,0,.1)",
                                                    backgroundColor: item.id == this.state.strategyID? "rgb(221, 221, 221)": "white",
                                                }} 
                                                onClick={()=>{
                                                    if(this.state.strategyID == item.id){
                                                        return
                                                    }else{
                                                        this.setState({
                                                            strategyID: item.id
                                                        }, this.getParamList)
                                                    }
                                                }}
                                                key={index}>
                                                {item.name}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div style={{
                                borderRight: "1px solid rgba(0,0,0,.1)",
                                overflow: "auto",
                                width: "100%",
                            }}>
                                <div style={{padding: "20px", borderBottom: "1px solid rgba(0,0,0,.1)"}}>
                                    <Radio.Group onChange={(e)=>{
                                        if(this.state.paramID == e.target.value){
                                            return
                                        }else{
                                            this.setState({
                                                paramID: e.target.value
                                            }, this.getCodeList)
                                        }
                                    }} value={this.state.paramID}>
                                    {
                                        this.state.paramList.map((item, index)=>{
                                            return(
                                                <Radio style={radioStyle} value={item.id} key={item.id}>
                                                    {item.remark}
                                                </Radio>
                                            )
                                        })
                                    }
                                </Radio.Group>
                            </div>
                                <div style={{padding: "20px"}}>
                                    <table  className="am-table am-table-bordered  am-table-compact">
                                    <thead>
                                        <tr>
                                            {head}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>统计</td>
                                                {
                                                    this.state.codeSum.map((item, index) => {
                                                        return(
                                                            <td key={index}>
                                                                <div style={this.renderRateColor(item.open_rate)}>
                                                                    开：{item.open_rate}%。
                                                                </div>
                                                                <div style={this.renderRateColor(item.close_rate)}>
                                                                    收：{item.close_rate}%。
                                                                </div>
                                                                <div style={this.renderRateColor(item.high_rate)}>
                                                                    最高：{item.high_rate}%。
                                                                </div>
                                                                <div style={this.renderRateColor(item.low_rate)}>
                                                                    最低：{item.low_rate}%
                                                                </div>
                                                            </td>
                                                        )
                                                    })
                                                }
                                        </tr> 
                                    {
                                        this.state.codeList.map((item, index) => {
                                            return(
                                                <tr key={index}>
                                                    <td>{item.info.name}</td>
                                                    {
                                                        item.price_list.map((sitem, sindex) => {
                                                            return (
                                                                <td key={sindex}>
                                                                    <div style={this.renderRateColor(sitem.open_rate)}>
                                                                        开：{sitem.open} {sitem.open_rate}%。
                                                                    </div>
                                                                    <div style={this.renderRateColor(sitem.close_rate)}>
                                                                        收：{sitem.close} {sitem.close_rate}%。
                                                                    </div>
                                                                    <div style={this.renderRateColor(sitem.high_rate)}>
                                                                        最高：{sitem.high} {sitem.high_rate}%。
                                                                    </div>
                                                                    <div style={this.renderRateColor(sitem.low_rate)}>
                                                                        最低：{sitem.low} {sitem.low_rate}%
                                                                    </div>
                                                                </td>
                                                            )
                                                        })
                                                    }
                                                </tr> 
                                            )
                                        })
                                    }
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}

Strategy.defaultProps = {
}

module.exports = Strategy