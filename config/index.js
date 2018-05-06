import { hashHistory } from 'react-router'
// 用户属性

class User{
    constructor(){
        this.id = -1;
        this.email = "";
        this.menu = [];
        this.conf = {};
        this.timeout = "";
    }
    
    getUserInfo(){
        console.log("data")
        if(this.id != -1){
            return;
        }else{
            $.ajax({
                url: "/api/dh/account/login?action=menu",
                type: "GET",
                dataType: "json",
                async: false,
                success: function(data){
                    if(data.ret == 0){
                        this.email = data.data.email;
                        this.menu = data.data.menu;
                    }else{
                        this.showRequestError(data);
                    }
                }.bind(this)
            })
        }
    }

    toLogin(){
        hashHistory.push("/login");
    }

    showRequestError(data){
        if(data.ret == 1){
            this.showMsg("服务器出了点故障");
        }else if(data.ret == 3){
            hashHistory.push("/login");
        }else{
            this.showMsg(data.msg);
        }
    }

    showMsg(msg){
        $(".warn_modal").text(msg);
        $(".warn_modal").show();
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function(){
            $(".warn_modal").fadeOut();
        }, 3000);
    }
}

export var user = new User();