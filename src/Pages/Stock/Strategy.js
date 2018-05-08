import React from 'react'
import { hashHistory } from 'react-router'
import { Table, Button, Icon, Modal, Form, Input, Radio, Select, Popconfirm, Pagination, DatePicker  } from 'antd'
import { user } from 'config'


const days = 7
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
                price_days: days
            },
            dataType: "json",
            success: function(data){
                if(data.ret == 0){
                    this.setState({
                        codeList: data.data.list,
                    });
                }else{
                    user.showRequestError(data)
                }
            }.bind(this),
        })
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
                head.push(<th key={index}>{item.date}</th>)
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
                                        })
                                    }}
                                />
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
                                flexGrow: 1,
                                borderRight: "1px solid rgba(0,0,0,.1)",
                                overflow: "auto",
                            }}>
                                <div style={{padding: "5px", borderBottom: "1px solid rgba(0,0,0,.1)"}}>
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
                                    {
                                        this.state.codeList.map((item, index) => {
                                            return(
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>http://amazeui.org</td>
                                                    <td>2012-10-01</td>
                                                </tr> 
                                            )
                                        })
                                    }
                                        <tr>
                                            <td>
                                                <div>600315 格力电器</div>
                                                <div>adsf</div>
                                            </td>
                                            <td>http://amazeui.org</td>
                                            <td>2012-10-01</td>
                                        </tr>
                                        <tr>
                                            <td>Amaze UI</td>
                                            <td>http://amazeui.org</td>
                                            <td>2012-10-01</td>
                                        </tr>
                                        <tr>
                                            <td>Amaze UI(Active)</td>
                                            <td>http://amazeui.org</td>
                                            <td>2012-10-01</td>
                                        </tr>
                                        <tr>
                                            <td>Amaze UI</td>
                                            <td>http://amazeui.org</td>
                                            <td>2012-10-01</td>
                                        </tr>
                                        <tr>
                                            <td>Amaze UI</td>
                                            <td>http://amazeui.org</td>
                                            <td>2012-10-01</td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                            <div style={{
                                flexGrow: 1,
                                padding: "5px",
                                overflow: "auto",
                            }}>
                                dfd
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