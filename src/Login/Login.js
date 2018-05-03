import React from 'react'
import { user } from 'config'


class Login extends React.Component {
    constructor(props, context){
        super(props, context);
    }
    componentWillMount(){
    }
    componentDidMount(){
        switch(this.props.location.query.ret){
            case "1":
                user.showMsg("输入账号与密码");
                break;
            case "2":
                user.showMsg("该邮箱地址没有注册");
                break;
            case "3":
                user.showMsg("密码错误");
                break;
        }
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
    render() {
        let height = "50px";
        return (
            <div>
                <div style={{
                    height: height,
                    backgroundColor: "#2e2c2c",
                    position: "fixed",
                    top: "0px",
                    width: "100%",
                    zIndex: "10",
                    padding: "0px 20px 0px 0px",
                }}>
                    <div style={{
                            display: "inline-block",
                            lineHeight: "45px",
                            fontSize: "24px",
                            fontWeight: "bold",
                            paddingLeft: "20px",
                            cursor: "pointer",
                            color: "#33a597",
                        }}>
                        CMS
                    </div>
                </div>
                <div style={{
                    top: height, 
                    position: "absolute", 
                    right: "0px", 
                    left: "0px", 
                    bottom: "0px", 
                    overflow: "auto",
                    padding: "22px 0px",
                    backgroundColor: "#f0f3f7",
                }}>
                    <div style={{
                        position: "absolute",
                        width: "300px",
                        left: "50%",
                        marginLeft: "-150px",
                        top: "50px",
                    }}>
                        <form className="am-form" action="/api/dh/account/login" method="post">
                            <div className="am-form-group">
                                <label>邮箱地址</label>
                                <input type="email" className="" placeholder="邮箱地址" name="email" required/>
                            </div>
                            <div className="am-form-group">
                                <label>密码</label>
                                <input type="password" className="" placeholder="密码" name="password" required/>
                            </div>
                            <button type="submit" className="am-btn am-btn-block am-btn-success">登录</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
module.exports = Login