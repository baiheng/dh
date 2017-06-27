import React from 'react'
import { hashHistory } from 'react-router'
import { Table, Button, Icon, Modal, Form, Input, Radio,
    Select, Popconfirm, Pagination, DatePicker, Slider, Tabs, Switch } from 'antd'
import { user } from 'config'


class Analyse extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            analyseData: {},
            amountAnalyseData: {},
            date: moment(),
            code: "603031",
            startTs: 33300,
            endTs: 54000,
            minAmount: 30,
            maxAmount: 200,
            amountRange: false,
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.getAnalyseList();
        this.getAmountAnalyseList();
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

    getAnalyseList(){
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
                        analyseData: data.data,
                    });
                }else{
                    user.showRequestError(data)
                }
            }.bind(this),
        })
    }

    getAmountAnalyseList(){
        let data = {}
        data.min_amount = this.state.minAmount * 10000
        if(this.state.amountRange){
            data.max_amount = this.state.maxAmount * 10000
        }        
        $.ajax({
            url: "/v1/amount_analyse",
            type: "GET",
            data: {
                code: this.state.code,
                date: this.state.date.format("YYYYMMDD"),
                ...data
            }, 
            dataType: "json",
            success: function(data){
                if(data.ret == 0){
                    this.setState({
                        amountAnalyseData: data.data,
                    });
                }else{
                    user.showRequestError(data)
                }
            }.bind(this),
        })
    }

    renderAnalyseItem(key){
        let data = this.state.analyseData[key];
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
        let totalAmountData = {};
        for(let [k, v] of Object.entries(this.state.analyseData)){
            let keys = k.split("-");
            if(totalAmountData.hasOwnProperty(keys[0] + "-" + keys[1])){
                if(keys[2] == "3主砸" || keys[2] == "4被买"){
                    totalAmountData[keys[0] + "-" + keys[1]].Amount -= v.Amount
                    totalAmountData[keys[0] + "-" + keys[1]].Number -= v.Number
                    totalAmountData[keys[0] + "-" + keys[1]].Percentage -= v.Percentage
                    totalAmountData[keys[0] + "-" + keys[1]].SellPercentage += v.Percentage
                    totalAmountData[keys[0] + "-" + keys[1]].SellTotal += v.Amount
                }else{
                    totalAmountData[keys[0] + "-" + keys[1]].Amount += v.Amount
                    totalAmountData[keys[0] + "-" + keys[1]].Number += v.Number
                    totalAmountData[keys[0] + "-" + keys[1]].Percentage += v.Percentage
                    totalAmountData[keys[0] + "-" + keys[1]].BuyPercentage += v.Percentage
                    totalAmountData[keys[0] + "-" + keys[1]].BuyTotal += v.Amount
                }
            }else{
                if(keys[2] == "3主砸" || keys[2] == "4被买"){
                    totalAmountData[keys[0] + "-" + keys[1]] = {
                        Amount: -v.Amount,
                        Number: -v.Number,
                        Percentage: -v.Percentage,
                        BuyPercentage: 0,
                        SellPercentage: v.Percentage,
                        SellTotal: v.Amount,
                        BuyTotal: 0,
                    }
                }else{
                    totalAmountData[keys[0] + "-" + keys[1]] = {...v, ...{SellTotal: 0, BuyTotal: v.Amount, BuyPercentage: v.Percentage, SellPercentage: 0}}
                }
            }
        }
        return (
            <div style={{
                border: "1px solid #95a5a6",
                padding: "10px",
                width: "48%",
            }}>

                <div style={{width: "95%"}}>
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

                <div style={{marginBottom: "10px"}}>
                {Object.keys(totalAmountData).map((item, index) => {
                    let data = totalAmountData[item];
                    return (
                        <div style={{
                            display: "flex",
                            display: "-webkit-flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingBottom: "5px",
                            color: "#2980b9",
                            fontWeight: "bold",
                            fontSize: "15px", 
                        }} key={"td" + index}>
                            <div>{item + "(" + data.BuyPercentage.toFixed(2) + '-' + data.SellPercentage.toFixed(2) + '=' + data.Percentage.toFixed(2) + "%)"}</div>
                            <div style={{
                                color: "#d35400",
                                fontWeight: "bold" 
                            }}>金额：<span>{(data.BuyTotal/10000).toFixed(2) + "w"} - {(data.SellTotal/10000).toFixed(2) + "w"} = {(data.Amount/10000).toFixed(2) + "w"}</span></div>
                        </div>
                    )
                })}
                </div>

                {Object.keys(this.state.analyseData).map((item, index) => {
                    let data = this.state.analyseData[item];
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

    renderAmountAnalyse(){
        if(Object.keys(this.state.amountAnalyseData).length != 0){
            let myChat = echarts.init(document.getElementById('amountAnalyseChart'));
            let myBuyChat = echarts.init(document.getElementById('buyAmountAnalyseChart'));
            let buyAmountData = [];
            let sellAmountData = [];
            let totalAmountData = [];
            let amountData = [];
            for(let key of Object.keys(this.state.amountAnalyseData)){
                let item = this.state.amountAnalyseData[key] 
                buyAmountData.push(item.BuyAmount/10000)
                sellAmountData.push(-item.SellAmount/10000)
                totalAmountData.push(item.Amount/10000)
                amountData.push((item.BuyAmount-item.SellAmount)/10000)
            }
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['买资金','卖资金', '总金额'],
                    selected: {
                        "总金额": false,
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: Object.keys(this.state.amountAnalyseData),
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '买资金',
                        type: 'line',
                        data: buyAmountData,
                    },
                    {
                        name: '卖资金',
                        type: 'line',
                        data: sellAmountData,
                    },
                    {
                        name: '总金额',
                        type: 'line',
                        data: totalAmountData,
                    }
                ]
            };
            myChat.setOption(option);

            var option1 = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['流入资金'],
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: Object.keys(this.state.amountAnalyseData),
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '流入资金',
                        type: 'line',
                        data: amountData,
                    }
                ]
            };
            myBuyChat.setOption(option1);
        }
        return (
            <div style={{
                border: "1px solid #95a5a6",
                padding: "10px",
                width: "48%",
            }}>

                <div style={{
                    display: "flex",
                    display: "-webkit-flex",
                    justifyContent: "space-between",
                }}>
                <div style={{width: "95%",}}>
                    <Slider 
                        included={this.state.amountRange}
                        range={this.state.amountRange} 
                        defaultValue={this.state.amountRange? [30, 200]: 30} min={10} max={200} marks={{
                        10: '10w',
                        20: '20w',
                        30: '30w',
                        50: '50w',
                        100: '100w',
                        200: '200w',
                    }} tipFormatter={(v)=>{
                        return v + "w"
                    }}
                    value={this.state.amountRange? [this.state.minAmount, this.state.maxAmount]: this.state.minAmount}
                    onChange={(value) => {
                        if(!this.state.amountRange){
                            this.setState({
                                minAmount: value,
                            })
                        }else{
                            this.setState({
                                minAmount: value[0],
                                maxAmount: value[1]
                            })
                        }
                    }}
                    />
                </div>
                <div style={{
                    width: "5%", 
                    display: "flex",
                    display: "-webkit-flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-start"
                }}>
                    <input type="checkbox" checked={this.state.amountRange} onChange={() => this.setState({
                        amountRange: !this.state.amountRange
                    })}/>
                </div>
                </div>

                <div id="amountAnalyseChart" style={{width: "100%", height: "350px"}}>
                </div>
                <div id="buyAmountAnalyseChart" style={{width: "100%", height: "250px"}}>
                </div>
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
                                    onSearch={value => {
                                        this.getAnalyseList()
                                        this.getAmountAnalyseList()
                                    }
                                    } />
                            </div>
                        </div>
                    </div>

                    <div className="am-u-sm-12">
                        <div style={{
                            display: "flex",
                            display: "-webkit-flex",
                            justifyContent: "space-between",
                            marginBottom: "10px"
                        }} className="content-bg">
                            {this.state.analyseData && this.renderAnalyse()}
                            {this.renderAmountAnalyse()}
                        </div>

                        <div style={{
                                display: "flex",
                                display: "-webkit-flex",
                                flexFlow: "row wrap",
                                overflow: "auto",
                                justifyContent: "space-between",
                                marginBottom: "30px"
                            }} className="content-bg">
                            {Object.keys(this.state.analyseData).map((item, index) => {
                                return this.renderAnalyseItem(item)
                            })}
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