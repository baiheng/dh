import React from 'react'
import { hashHistory } from 'react-router'
import { Table, Button, Icon, Modal, Form, Input, Radio, Select, Popconfirm, Pagination, DatePicker, Slider } from 'antd'
import { user } from 'config'


class Analyse extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: {},
            date: moment(),
            code: "603031",
            startTs: 33300,
            endTs: 54000,
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
    }

    componentWillUnmount(){
    }

    getList(){
        if(this.state.startTs > 41400 && this.state.endTs < 46800){
            return user.showMsg("时间范围错误")
        }
        let t = this.formatSeconds(this.state.startTs);
        let startTs = parseInt(t[0] + t[1] + t[2])
        t = this.formatSeconds(this.state.endTs);
        let endTs = parseInt(t[0] + t[1] + t[2])
        $.ajax({
            url: "/v1/analyse",
            type: "GET",
            data: {
                code: this.state.code,
                date: this.state.date.format("YYYYMMDD"),
                startTs: startTs,
                endTs: endTs
            }, 
            dataType: "json",
            success: function(data){
                if(data.ret == 0){
                    this.setState({
                        total: data.total,
                        data: data.data,
                    });
                }else{
                    user.showRequestError(data)
                }
            }.bind(this),
        })
    }

    renderAnalyseItem(key){
        let data = this.state.data[key];
        return (
            <div style={{
                border: "1px solid #95a5a6",
                marginBottom: "20px",
                width: "24%"
            }} key={key}>
                <div style={{
                    display: "flex",
                    display: "-webkit-flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "10px",
                }}>
                    <div style={{
                        color: "#2980b9",
                        fontWeight: "bold" 
                    }}>{key}</div>
                    <div>占比：{data.Percentage.toFixed(2) + "%"}</div>
                </div>
                <div style={{
                        display: "flex",
                        display: "-webkit-flex",
                        padding: "5px 15px 5px 15px",
                        flexDirection: "column",
                    }}>
                    <div style={{
                        display: "flex",
                        display: "-webkit-flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                    }}>
                        <div style={{
                            color: "#d35400",
                            fontWeight: "bold" 
                        }}>金额：{(data.Amount/10000).toFixed(2) + "w"}</div>
                        <div>单子数量：{data.Number}</div>
                    </div>
                    <div style={{
                        width: "100%"
                    }}>
                        {
                            Object.keys(data.TradeDetail).map((item) => {
                                return(
                                    <div key={"detail" + item} style={{
                                        marginBottom: "5px"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            display: "-webkit-flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}>
                                            <div style={{color: "#2980b9"}}>{item}</div>
                                            <div>占比：{data.TradeDetail[item].Percentage.toFixed(2) + "%"}</div>
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            display: "-webkit-flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between"
                                        }}>
                                            <div style={{color: "#d35400"}}>金额：{(data.TradeDetail[item].Amount/10000).toFixed(2) + "w"}</div>
                                            <div>单子数量：{data.TradeDetail[item].Number}</div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }

    renderAnalyse(){
        return (
            <div style={{
                border: "1px solid #95a5a6",
                marginBottom: "20px",
                width: "27%",
                padding: "10px",
            }} key={"total"}>
                {Object.keys(this.state.data).map((item, index) => {
                    let data = this.state.data[item];
                    return (
                        <div style={{
                            display: "flex",
                            display: "-webkit-flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingBottom: "5px",
                            color: "#2980b9",
                            fontWeight: "bold" 
                        }} key={"t" + index}>
                            <div>{item + "(" + data.Percentage.toFixed(2) + "%)"}</div>
                            <div style={{
                                color: "#d35400",
                                fontWeight: "bold" 
                            }}>金额：<span>{(data.Amount/10000).toFixed(2) + "w"}</span></div>
                        </div>
                    )
                })}
            </div>
        );
    }

    formatSeconds(value) {  
        function fix(num, length) {
            return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
        }

        var theTime = parseInt(value); // 秒  
        var theTime1 = 0; // 分  
        var theTime2 = 0; // 小时  
        if(theTime > 60) {  
            theTime1 = parseInt(theTime/60);  
            theTime = parseInt(theTime%60);  
            if(theTime1 > 60) {  
                theTime2 = parseInt(theTime1/60);  
                theTime1 = parseInt(theTime1%60);  
            }
        }
        return [fix(theTime2, 2), fix(theTime1, 2), fix(theTime, 2)]
    }

    render(){
        return (
            <div>
                <div className="am-g">
                    <div className="am-u-sm-12 am-margin-top">
                        <div className="am-g am-g-collapse">
                            <div className="am-u-sm-6"> 
                                <h2>股票 / 统计分析</h2>
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
                            <div>
                                <Slider range defaultValue={[33300, 54000]} min={33300} max={54000} marks={{
                                    33300: '9:15',
                                    36000: '10:00',
                                    37800: '10:30',
                                    39600: '11:00',
                                    41400: '11:30',
                                    46800: '13:00',
                                    48600: '13:30',
                                    50400: '14:00',
                                    52200: '14:30',
                                    54000: '15:00'
                                }} tipFormatter={(v)=>{
                                    let t = this.formatSeconds(v);
                                    return t[0] + ":" + t[1] + ":" + t[2]
                                }}
                                value={[this.state.startTs, this.state.endTs]}
                                onChange={(value) => {
                                    this.setState({
                                        startTs: value[0],
                                        endTs: value[1]
                                    })
                                }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="am-u-sm-9">
                        <div className="content-bg">
                            <div  style={{
                                    display: "flex",
                                    display: "-webkit-flex",
                                    flexFlow: "row wrap",
                                    overflow: "auto",
                                    justifyContent: "space-between",
                                    marginBottom: "30px"
                                }}>
                                {this.state.data && this.renderAnalyse()}
                                {Object.keys(this.state.data).map((item, index) => {
                                    return this.renderAnalyseItem(item)
                                })}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

Analyse.defaultProps = {
}

module.exports = Analyse