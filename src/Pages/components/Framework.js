import React from 'react'

import Head from "./Head"
import SiderBar from "./SiderBar"


class Framework extends React.Component {
    render() {
        let left = "225px";
        let height = "50px";
        return (
            <div>
                <Head height={height} />
                <SiderBar width={left} height={height} />
                <div style={{
                    top: height, 
                    position: "absolute", 
                    right: "0px", 
                    left: left, 
                    bottom: "0px", 
                    overflow: "auto",
                    backgroundColor: "#f0f3f7",
                }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
module.exports = Framework