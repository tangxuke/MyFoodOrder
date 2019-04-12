// miniprogram/pages/manage/setting/index.js
var app=getApp();
var guid=app.CanteenGuid;
var baseUrl=app.baseUrl;

Page({
  onLoad:function(params){
    this.getData();
  },
  /**
   * 打印测试
   */
  printTest:function(){
    app.printOrder('恭喜你打印成功！')
    .then(value=>{
      wx.showModal({
        title: '提示',
        content: '恭喜你，打印机测试成功！',
      })
    })
    .catch(reason=>{
      wx.showModal({
        title: '打印测试失败',
        content: reason,
      })
    });
  },
  /**
   * 输入改变事件
   */
  onChange:function(event){
    var value=event.detail;
    var key=event.target.id;
    var data = {};
    data[key] = value;
    this.setData(data);
  },
  /**
   * 获取数据
   */
  getData:function(){
    var url=baseUrl+'/setting/'+guid;
    wx.request({
      url: url,
      method:'get',
      success:function(res){
        var result=res.data;
        if(result.Success){
          if(result.Result.length===0){
            wx.showModal({
              title: '系统提示',
              content: '单位信息已经不存在，请联系产品运营！',
              complete:function(){
                this.close();
              }
            });
            return;
          }else{
            var row = result.Result[0];
            this.setData({
              Name: row.Name,
              Contact: row.Contact,
              Tel: row.Tel,
              PrinterSN: row.PrinterSN
            });
          }
        }else{
          wx.showModal({
            title: '系统提示',
            content: '获取系统设置失败：\n'+result.Message,
          });
        }
      }.bind(this)
    });
  },
  /**
   * 页面的初始数据
   */
  data: {
    Name:'',
    Contact:'',
    Tel:'',
    PrinterSN:''
  },

  //保存
  save:function(){
    var url = baseUrl + '/setting/' + guid;
    wx.request({
      url: url,
      method:'put',
      data:this.data,
      success:res=>{
        wx.showModal({
          title: '系统提示',
          content: '保存设置成功！',
          complete:()=>{
            wx.navigateBack({
            });
          }
        });
      },
      fail:reason=>{
        console.log(reason);
        wx.showModal({
          title: '系统提示',
          content: '保存设置失败！',
        });
      }
    })
    
  },

  //返回
  close:function(){
    wx.navigateBack({  
    });
  }
})