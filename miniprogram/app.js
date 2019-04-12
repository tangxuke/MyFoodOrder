//app.js
App({
  onLaunch: function () {
    /*
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }*/
    wx.login({
      success:res=>{
        var code=res.code;
        var userInfo={};

        wx.getUserInfo({
          success: res => {
            var userInfo = res.userInfo;
            wx.request({
              url: this.baseUrl + '/login/' + code + '/'+userInfo.nickName,
              method:'get',
              success: res => {
                this.userInfo = Object.assign(userInfo, { userid: res.data.Result.userid });
              }
            })
          }
        });
        
      }
    });

    this.getCanteenInfo();
  },
  //基准URL
  baseUrl: 'https://tangxuke.cn/A01',
  //餐厅编号
  CanteenGuid:'859E95AD-95EC-40F6-B766-9C155D8306AF',
  //用户信息
  userInfo:{},
  //餐厅信息
  canteenInfo:{},

  //获取餐厅信息
  getCanteenInfo: function () {
    var url = this.baseUrl + '/setting/' + this.CanteenGuid;
    wx.request({
      url: url,
      method: 'get',
      success: function (res) {
        var result = res.data;
        if (result.Success) {
          if (result.Result.length === 0) {
          } else {
            var row = result.Result[0];
            console.log(row);
            this.canteenInfo = {
              Name: row.Name,
              Contact: row.Contact,
              Tel: row.Tel,
              PrinterSN: row.PrinterSN
            };
          }
        } else {
        }
      }.bind(this)
    });
  },

  //打印订单
  printOrder: function (text) {
    let p=new Promise((resolve,reject)=>{
      wx.request({
        url: this.baseUrl + '/print-order/' + this.CanteenGuid,
        method: 'post',
        data: {
          text
        },
        success: res => {
          var data = res.data;
          if (data.Success) {
            var returnMessage = data.Result;
            if (returnMessage.msg === 'ok') {
              resolve(returnMessage);
            } else {
              reject(returnMessage);
            }
          } else {
            reject(data.Message);
          }
        },
        fail:()=>{
          reject('未知原因！');
        }
      });
    });
    return p;
    
  },
})
