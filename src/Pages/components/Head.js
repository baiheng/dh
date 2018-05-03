import React from 'react'
import { Link } from 'react-router'

import { Icon, Modal } from 'antd'
import { user } from 'config'

import './head.css'


class Head extends React.Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            showModel: false,
            pwdModel: false,
            confirmLoading: false,
        };
    }

    updatePwd(){
        let old_pwd = this.refs.old_pwd.value;
        let new_pwd = this.refs.new_pwd.value;
        let again_pwd = this.refs.again_pwd.value;
        if(old_pwd == "" || new_pwd == "" || again_pwd == ""){
            return user.showMsg("请填完每个字段");
        }
        if(new_pwd != again_pwd){
            return user.showMsg("新密码两次输入不相同");
        }
        $.ajax({
            url: "/api/v1/account/login",
            type: "PUT",
            data: {
                old_password: old_pwd,
                new_password: new_pwd,
            }, 
            dataType: "json",
            beforeSend: function(){
                this.setState({
                    confirmLoading: true,
                })
            }.bind(this),
            success: function(data){
                if(data.ret == 0){
                    this.setState({
                        pwdModel: false,
                    });
                }else{
                    user.showRequestError(data)
                }
            }.bind(this),
            complete: function(){
                this.setState({
                    confirmLoading: false,
                });
            }.bind(this),
        })
    }

    render() {
        return (
            <div style={{
                height: this.props.height,
                backgroundColor: "#2e2c2c",
                position: "fixed",
                top: "0px",
                width: "100%",
                zIndex: "10",
                padding: "0px 20px 0px 0px",
            }}>
                <div style={{
                        position: "absolute",
                        display: "inline-block",
                        lineHeight: "50px",
                        height: "50px",
                        fontSize: "24px",
                        fontWeight: "bold",
                        paddingLeft: "20px",
                        cursor: "pointer",
                        color: "#33a597",
                    }}>
                    
                </div>
                <div style={{
                        position: "absolute",
                        right: "50px",
                        height: "50px",
                        fontSize: "14px",
                        lineHeight: "50px",
                        textAlign: "right",
                        display: "inline-block",
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: "#33a597",
                    }}
                    onMouseEnter={() =>{
                        this.setState({
                            showModel: true 
                        })
                    }}  
                    onMouseLeave={() =>{
                        this.setState({
                            showModel: false 
                        })
                    }}  
                    >
                    {user.email}
                    <span className="fa fa-sort-desc am-margin-left"></span>
                </div>
                <div onMouseEnter={() =>{
                        this.setState({
                            showModel: true 
                        })
                    }}  
                    onMouseLeave={() =>{
                        this.setState({
                            showModel: false 
                        })
                    }}  
                        style={{
                        display: this.state.showModel? "block": "none",
                        position: "fixed",
                        top: "50px",
                        width: "150px",
                        right: "50px",
                        backgroundColor: "#2e2c2d",
                    }}>
                        <a className="head-menu" onClick={()=>{this.setState({pwdModel: true})}}>  
                            修改密码
                        </a>
                        <a className="head-menu" href="/api/v1/account/login">   
                            退出登录
                        </a>
                </div>

                <Modal title="修改密码" visible={this.state.pwdModel}
                    onOk={this.updatePwd.bind(this)} 
                    onCancel={()=>{this.setState({pwdModel: false})}}
                    confirmLoading={this.state.confirmLoading}
                >
                    <form className="am-form">
                        <div className="am-form-group">
                            <label>旧密码</label>
                            <input type="password" placeholder="旧密码" ref="old_pwd" />
                        </div>
                        <div className="am-form-group">
                            <label>新密码</label>
                            <input type="password" placeholder="新密码" ref="new_pwd" />
                        </div>
                        <div className="am-form-group">
                            <label>重复输入新密码</label>
                            <input type="password" placeholder="重复输入新密码" ref="again_pwd" />
                        </div>
                    </form>
                </Modal>
            </div>
        )
  }
}

module.exports = Head