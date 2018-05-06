import React from 'react'

import { user } from 'config'

import Head from "./Head"
import SiderBar from "./SiderBar"
import Account from '../System/Account'


class Framework extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            menu: [],
            email: "",
        }
    }

    componentWillMount(){
        this.getUserInfo()
    }

    getUserInfo(){
        $.ajax({
            url: "/api/dh/account/login?action=menu",
            type: "GET",
            dataType: "json",
            async: false,
            success: function(data){
                if(data.ret == 0){
                    this.setState({
                        menu: data.data.menu,
                        email: data.data.email,
                    })
                }else{
                    user.showRequestError(data);
                }
            }.bind(this)
        })
    }

    render() {
        let left = "225px";
        let height = "50px";
        return (
            <div>
                <Head height={height} email={this.state.email} />
                <SiderBar width={left} height={height} menu={this.state.menu} />
                <div style={{
                    top: height, 
                    position: "absolute", 
                    right: "0px", 
                    left: left, 
                    bottom: "0px", 
                    overflow: "auto",
                    backgroundColor: "#f0f3f7",
                }}>
                    {this.props.children || <Account {...this.props} />}
                </div>
            </div>
        )
    }
}
module.exports = Framework