import React from 'react'
import { hashHistory } from 'react-router'

import { Menu, Icon, Switch } from 'antd';
import { user } from 'config'


class SiderBar extends React.Component {
    componentWillMount(){
    }

    componentDidMount(){
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
        let menu = user.menu;
        return (
            <div
                style={{
                    position: "fixed",
                    top: this.props.top,
                    left: "0px",
                    width: this.props.width,
                    bottom: "0px",
                    backgroundColor: "#222",
                    overflowY: "auto",
                    overflowX: "hidden",
                }}>
                <Menu theme="dark"
                    style={{ width: this.props.width }}
                    defaultOpenKeys={['sub1']}
                    mode="inline" 
                    onClick={(item, key, keyPath) => {
                        hashHistory.push({
                            pathname: item.key,
                        })
                    }}>
                    {
                        menu.map((item, index) => {
                            return (
                                <Menu.SubMenu key={index} title={item.name}>
                                    {
                                        item.children.map((child, childKey) => {
                                            return (
                                                <Menu.Item key={child.url}>{child.name}</Menu.Item>
                                            )
                                        })
                                    }
                                </Menu.SubMenu>
                            )
                        })
                    }
                </Menu>
            </div>
        )
    }
}

SiderBar.defaultProps = {
    width: "200px",
    top: "50px",
}

module.exports = SiderBar;