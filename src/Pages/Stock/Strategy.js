import React from 'react'
import { hashHistory } from 'react-router'
import { Table, Button, Icon, Modal, Form, Input, Radio, Select, Popconfirm, Pagination, DatePicker  } from 'antd'
import { user } from 'config'


class Strategy extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            date: moment(),
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        // this.getList();
    }

    componentWillReceiveProps(nextProps){
    }

    componentWillUpdate(nextProps, nextState){
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

    render(){
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
                                    format={'YYYYMMDD'} 
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
                                <div style={{padding: "5px", borderBottom: "1px solid rgba(0,0,0,.1)"}}>
                                    adf
                                </div>
                                <div style={{padding: "5px", borderBottom: "1px solid rgba(0,0,0,.1)"}}>
                                    adf
                                </div>
                                <div style={{padding: "5px", borderBottom: "1px solid rgba(0,0,0,.1)"}}>
                                    adf
                                </div>
                                <div style={{padding: "5px", borderBottom: "1px solid rgba(0,0,0,.1)"}}>
                                    adf
                                </div>
                                <div style={{padding: "5px", borderBottom: "1px solid rgba(0,0,0,.1)"}}>
                                    adf
                                </div>
                                <div style={{padding: "5px", borderBottom: "1px solid rgba(0,0,0,.1)"}}>
                                    adf
                                </div>
                            </div>
                            <div style={{
                                flexGrow: 1,
                                borderRight: "1px solid rgba(0,0,0,.1)",
                                overflow: "auto",
                            }}>
                                <div style={{padding: "5px", borderBottom: "1px solid rgba(0,0,0,.1)"}}>
                                    adf
                                </div>
                                <div style={{padding: "20px"}}>
                                    <table  className="am-table am-table-bordered  am-table-compact">
                                    <thead>
                                        <tr>
                                            <th>股票</th>
                                            <th>5月10号</th>
                                            <th>5月10号</th>
                                        </tr>
                                    </thead>
                                    <tbody>
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